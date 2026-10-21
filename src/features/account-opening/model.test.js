import { ageInYears, emptyValues, sampleValues, validateStep, validateFile } from './model';
test('dates are validated in local time, including birthdays and invalid calendar dates', () => {
  const now = new Date(2026, 9, 21, 12);
  expect(ageInYears('2008-10-21', now)).toBe(18);
  expect(ageInYears('2008-10-22', now)).toBe(17);
  expect(ageInYears('2026-02-30', now)).toBeNaN();
  expect(ageInYears('2027-01-01', now)).toBeNaN();
});
test('identity and OTP cannot advance without valid preview inputs', () => {
  expect(Object.keys(validateStep(1, emptyValues()))).toEqual(['bvn', 'nin', 'photo']);
  const values = sampleValues();
  expect(validateStep(1, values)).toEqual({});
  expect(validateStep(2, values).otp).toBeTruthy();
  values.otp = '64912';
  expect(validateStep(2, values)).toEqual({});
});
test('PEP details, child age and documents are required', () => {
  const values = sampleValues();
  values.parent.pep = 'Yes';
  expect(validateStep(3, values)['parent.pepPosition']).toBeTruthy();
  values.children[3].dob = '1990-06-23';
  expect(validateStep(5, values)['children.3.dob']).toBeTruthy();
  values.count = '6';
  values.childFiles[5].birth = null;
  expect(validateStep(6, values)['childFiles.5.birth']).toBeTruthy();
  expect(validateStep(8, values).consent).toBeTruthy();
});
test('uploads reject executable, mismatched, empty and oversized files', () => {
  expect(validateFile({
    name: 'test.png',
    type: 'image/png',
    size: 100
  }, true)).toBeNull();
  for (const file of [{
    name: 'test.svg',
    type: 'image/svg+xml',
    size: 100
  }, {
    name: 'test.html',
    type: 'image/png',
    size: 100
  }, {
    name: 'test.png',
    type: 'image/png',
    size: 0
  }, {
    name: 'test.png',
    type: 'image/png',
    size: 6 * 1024 * 1024
  }]) expect(validateFile(file)).toBeTruthy();
  expect(validateFile({
    name: 'test.pdf',
    type: 'application/pdf',
    size: 100
  }, true)).toBeTruthy();
});
