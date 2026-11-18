import { ageInYears, emptyValues, sampleValues, validateStep, validateFile, stepIndex, lgasFor, STATES, photoTooOld, formatAddress, demoAccountNumbers } from './model';

const now = new Date(2026, 9, 21, 12);
const step = key => stepIndex(key);

test('dates are validated in local time, including birthdays and invalid calendar dates', () => {
  expect(ageInYears('2008-10-21', now)).toBe(18);
  expect(ageInYears('2008-10-22', now)).toBe(17);
  expect(ageInYears('2026-02-30', now)).toBeNaN();
  expect(ageInYears('2027-01-01', now)).toBeNaN();
});

test('every state has its official LGAs (774 in total)', () => {
  expect(STATES).toHaveLength(37);
  expect(STATES.reduce((sum, s) => sum + lgasFor(s).length, 0)).toBe(774);
  expect(lgasFor('Lagos')).toContain('Eti-Osa');
  expect(lgasFor('Unknown')).toEqual([]);
});

test('identity needs BVN, NIN and a live photo that passed the liveness check', () => {
  expect(Object.keys(validateStep(step('identity'), emptyValues(), now))).toEqual(['bvn', 'nin', 'photo']);
  const values = sampleValues();
  expect(validateStep(step('identity'), values, now)).toEqual({});
  values.photo = { name: 'upload.png', source: 'upload' };
  expect(validateStep(step('identity'), values, now).photo).toBeTruthy();
  expect(validateStep(step('otp'), values, now).otp).toBeTruthy();
  values.otp = '64912';
  expect(validateStep(step('otp'), values, now)).toEqual({});
});

test('parent details: LGA must belong to the state, next of kin 18+, address pinned, PEP position', () => {
  const values = sampleValues();
  expect(validateStep(step('parent'), values, now)).toEqual({});
  values.parent.originLga = 'Eti-Osa';
  values.parent.nextOfKinDob = '2010-01-01';
  values.parent.location = null;
  values.parent.pep = 'Yes';
  const errors = validateStep(step('parent'), values, now);
  expect(errors['parent.originLga']).toBeTruthy();
  expect(errors['parent.nextOfKinDob']).toBeTruthy();
  expect(errors['parent.location']).toBeTruthy();
  expect(errors['parent.pepPosition']).toBeTruthy();
  expect(formatAddress(sampleValues().parent)).toBe('Plot 20, James Coker Street, Victoria Island, Eti-Osa, Lagos State');
});

test('parent details require a 13-digit tax ID and a source of funds, with an explanation for Others', () => {
  const values = sampleValues();
  values.parent.tin = '';
  values.parent.sourceFunds = '';
  let errors = validateStep(step('parent'), values, now);
  expect(errors['parent.tin']).toBeTruthy();
  expect(errors['parent.sourceFunds']).toBeTruthy();

  values.parent.tin = '123456789012a';
  values.parent.sourceFunds = 'Others';
  errors = validateStep(step('parent'), values, now);
  expect(errors['parent.tin']).toMatch(/13 digits/i);
  expect(errors['parent.sourceFundsOther']).toBeTruthy();

  values.parent.tin = '0123456789012';
  values.parent.sourceFundsOther = 'Family support';
  expect(validateStep(step('parent'), values, now)).toEqual({});

  values.parent.sourceFunds = 'Salary';
  values.parent.sourceFundsOther = '';
  expect(validateStep(step('parent'), values, now)).toEqual({});
});

test('children must be 0–15 and documents follow the camera/upload rules', () => {
  const values = sampleValues();
  values.children[3].dob = '1990-06-23';
  expect(validateStep(step('children'), values, now)['children.3.dob']).toBeTruthy();
  expect(validateStep(step('documents'), values, now)).toEqual({});
  values.parentPhoto = { name: 'upload.jpg', source: 'upload' };
  values.count = '6';
  values.childFiles[5].birth = null;
  values.childFiles[4].photo = { name: 'old.jpg', source: 'upload', takenAt: now.getTime() - 91 * 864e5 };
  const errors = validateStep(step('documents'), values, now);
  expect(errors.parentPhoto).toMatch(/camera/);
  expect(errors['childFiles.5.birth']).toBeTruthy();
  expect(errors['childFiles.4.photo']).toMatch(/90 days/);
  expect(photoTooOld({ name: 'new.jpg', takenAt: now.getTime() - 5 * 864e5 }, now.getTime())).toBe(false);
});

test('funding shares the type, debit account and schedule while validating each child’s amount', () => {
  const values = sampleValues();
  values.count = '2';
  let errors = validateStep(step('fund'), values, now);
  expect(errors['funding.type']).toBeTruthy();
  expect(errors['funding.sourceAccount']).toBeTruthy();
  expect(errors['funding.amounts.0']).toBeTruthy();
  expect(errors['funding.amounts.1']).toBeTruthy();

  values.funding = { type: 'Recurring Payment', sourceAccount: '0123456789', amounts: ['50,000', '10000'], frequency: 'Monthly', startDate: '2026-10-01', endDate: '2026-09-01' };
  errors = validateStep(step('fund'), values, now);
  expect(errors['funding.type']).toBeUndefined();
  expect(errors['funding.startDate']).toBeTruthy();
  expect(errors['funding.endDate']).toBeTruthy();
  expect(errors.mandate).toBeTruthy();
  values.funding.startDate = '2026-11-01';
  values.funding.endDate = '';
  values.mandate = true;
  expect(validateStep(step('fund'), values, now)).toEqual({});

  values.funding.type = 'One-Time Payment';
  values.funding.amounts[1] = '0';
  values.mandate = false;
  errors = validateStep(step('fund'), values, now);
  expect(errors['funding.amounts.1']).toBeTruthy();
  expect(errors.mandate).toBeUndefined();
  values.funding.amounts = ['50,000'];
  expect(validateStep(step('fund'), values, now)['funding.amounts.1']).toBeTruthy();
});

test('demo account numbers are 10 digits and unique per child', () => {
  const numbers = demoAccountNumbers(6, 1792593502821);
  expect(numbers.every(n => /^\d{10}$/.test(n))).toBe(true);
  expect(new Set(numbers).size).toBe(6);
});

test('uploads reject executable, mismatched, empty and oversized files', () => {
  expect(validateFile({ name: 'test.png', type: 'image/png', size: 100 }, true)).toBeNull();
  for (const file of [
    { name: 'test.svg', type: 'image/svg+xml', size: 100 },
    { name: 'test.html', type: 'image/png', size: 100 },
    { name: 'test.png', type: 'image/png', size: 0 },
    { name: 'test.png', type: 'image/png', size: 6 * 1024 * 1024 }
  ]) expect(validateFile(file)).toBeTruthy();
  expect(validateFile({ name: 'test.pdf', type: 'application/pdf', size: 100 }, true)).toBeTruthy();
});
