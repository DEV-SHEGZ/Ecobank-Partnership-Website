import LGAS from './lgas.json';

export const STEPS = [
  { key: 'identity', name: 'Identity', copy: 'Kindly fill in the details provided correctly' },
  { key: 'otp', name: 'OTP', copy: 'Enter the OTP sent to your phone number' },
  { key: 'parent', name: 'Parent details', copy: 'Please, fill in parent and guardian details.' },
  { key: 'count', name: 'Number of children', copy: 'Kindly select the number of children/wards you wish to open an account for' },
  { key: 'children', name: 'Child details', copy: 'Kindly select the number of children/wards you wish to open an account for' },
  { key: 'documents', name: 'Documents', copy: 'Kindly upload the following document to complete this account opening process of each child/ward' },
  { key: 'review', name: 'Review', copy: 'Kindly review all information provided to ensure that they are all correct.' },
  { key: 'results', name: 'Account numbers' },
  { key: 'fund', name: 'Fund account', title: 'FUND ACCOUNT', copy: 'Fund each child/ward’s account individually with a one-time payment or a recurring standing order.' }
];
export const STEP_NAMES = STEPS.map(step => step.name);
export const stepIndex = key => STEPS.findIndex(step => step.key === key) + 1;

export const STATES = Object.keys(LGAS);
export const lgasFor = state => LGAS[state] || [];
export const MAX_CHILDREN = 6;
export const PHOTO_MAX_AGE_DAYS = 90;

/* A preview stand-in for the record a BVN lookup returns. */
export const BVN_RECORD = { name: 'Funmilayo Adaeze Sanusi', dob: '1990-06-23' };

const option = (key, label, options, extra = {}) => ({ key, label, type: 'select', options, ...extra });
export const stateLabel = state => state === 'FCT' ? 'FCT, Abuja' : `${state} State`;
const field = (key, label, type = 'text', extra = {}) => ({ key, label, type, ...extra });

export const parentFields = [
  field('name', 'Parent/Guardian Name', 'text', { readOnly: true, hint: 'Retrieved from your BVN' }),
  field('childName', 'Child’s Name', 'text', { placeholder: 'Joshua Adeola Sanusi' }),
  field('dob', 'Date of Birth', 'date', { readOnly: true, hint: 'Retrieved from your BVN' }),
  field('email', 'Email Address', 'email', { placeholder: 'funmilayoadaeze@domain.com' }),
  option('origin', 'State of Origin', STATES, { caption: 'State of Origin', resets: 'originLga', format: stateLabel }),
  option('originLga', 'Local Government Area (LGA)', values => lgasFor(values.origin), { caption: 'Local Government Area', dependsOn: 'origin' }),
  option('residence', 'State of Residence', STATES, { caption: 'State of Residence', resets: 'residenceLga', format: stateLabel }),
  option('residenceLga', 'Local Government Area (LGA) of Residence', values => lgasFor(values.residence), { caption: 'LGA of Residence', dependsOn: 'residence' })
];
export const addressFields = [
  field('houseNumber', 'House Number', 'text', { placeholder: 'Plot 20' }),
  field('street', 'Street Name', 'text', { placeholder: 'James Coker Street' }),
  field('city', 'City/Town', 'text', { placeholder: 'Victoria Island' })
];
export const parentExtraFields = [
  option('income', 'Annual Income', ['Less than ₦32 million', '₦32 million to less than ₦50 million', '₦50 million and above'], { caption: 'Annual Income' }),
  option('employment', 'Employment Status', ['Employed', 'Self Employed', 'Unemployed'], { caption: 'Employment Status' }),
  field('nextOfKin', 'Next of Kin (18 years and older)', 'text', { placeholder: 'Damola Chinedu Sanusi' }),
  field('nextOfKinDob', 'Next of Kin’s Date of Birth', 'date'),
  option('pep', 'Politically Exposed Person (PEP) Status', ['Yes', 'No'], { caption: 'PEP Status' })
];
export const allParentFields = [...parentFields, ...addressFields, ...parentExtraFields];

export const childFields = [
  option('title', 'Title', ['Master', 'Miss'], { caption: 'Title' }),
  field('name', 'Full Name (First, Middle, and Last Name)', 'text', { placeholder: 'John Alan Doe' }),
  field('dob', 'Date of Birth', 'date'),
  option('gender', 'Gender', ['Male', 'Female'], { caption: 'Gender' }),
  field('birthplace', 'Place of Birth', 'text', { placeholder: 'Nigeria' }),
  field('nin', 'NIN (if available)', 'text', { placeholder: '11 digits', optional: true }),
  field('phone', 'Child/Ward Phone Number (if any)', 'tel', { placeholder: '+234 803 456 7890', optional: true }),
  option('currency', 'Account Currency', ['NGN (₦)', 'USD ($)', 'Euro (€)'], { caption: 'Account Currency' })
];

export const FUNDING_TYPES = ['One-time payment', 'Recurring payment'];
export const FREQUENCIES = ['Weekly', 'Monthly', 'Quarterly'];

const emptyOf = fields => Object.fromEntries(fields.map(({ key }) => [key, '']));
export const emptyChild = () => emptyOf(childFields);
export const emptyFunding = () => ({ type: '', amount: '', sourceAccount: '', frequency: '', startDate: '', endDate: '' });

export const emptyValues = () => ({
  bvn: '',
  nin: '',
  otp: '',
  parent: { ...emptyOf(allParentFields), pepPosition: '', location: null },
  count: '',
  children: Array.from({ length: MAX_CHILDREN }, emptyChild),
  photo: null,
  parentPhoto: null,
  addressFile: null,
  signature: null,
  childFiles: Array.from({ length: MAX_CHILDREN }, () => ({ photo: null, birth: null })),
  consent: false,
  accounts: [],
  funding: Array.from({ length: MAX_CHILDREN }, emptyFunding),
  mandate: false
});

const sample = name => ({ name, demo: true });
export function sampleValues() {
  const values = emptyValues();
  values.bvn = '00000000000';
  values.nin = '00000000000';
  values.parent = {
    ...values.parent,
    ...BVN_RECORD,
    childName: 'Joshua Adeola Sanusi',
    email: 'parent@example.com',
    origin: 'Oyo',
    originLga: 'Ibadan North',
    residence: 'Lagos',
    residenceLga: 'Eti-Osa',
    houseNumber: 'Plot 20',
    street: 'James Coker Street',
    city: 'Victoria Island',
    location: { lat: 6.4281, lng: 3.4219, label: 'Victoria Island, Eti-Osa, Lagos' },
    income: 'Less than ₦32 million',
    employment: 'Self Employed',
    nextOfKin: 'Damola Chinedu Sanusi',
    nextOfKinDob: '1985-02-11',
    pep: 'No'
  };
  values.count = '4';
  const names = ['Joshua Sanusi', 'Shade Sanusi', 'Samuel Sanusi', 'David Sanusi', 'Ada Sanusi', 'John Sanusi'];
  values.children = names.map((name, i) => ({
    title: i % 2 ? 'Miss' : 'Master', name, dob: '2017-06-23', gender: i % 2 ? 'Female' : 'Male',
    birthplace: 'Nigeria', nin: '', phone: '', currency: 'NGN (₦)'
  }));
  values.photo = { ...sample('Sample live photograph'), liveness: true };
  values.parentPhoto = { ...sample('Sample photograph'), source: 'camera' };
  values.addressFile = sample('Sample proof of address.pdf');
  values.signature = sample('Sample signature');
  values.childFiles = names.map(() => ({ photo: sample('Sample photograph'), birth: sample('Sample birth certificate.pdf') }));
  return values;
}

export function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function ageInYears(value, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return NaN;
  const date = new Date(value + 'T00:00:00');
  if (Number.isNaN(date.getTime()) || date > today || isoDate(date) !== value) return NaN;
  return today.getFullYear() - date.getFullYear() - Number(today.getMonth() < date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() < date.getDate()));
}
export const formatAddress = parent => [parent.houseNumber, parent.street, parent.city, parent.residenceLga, parent.residence && `${parent.residence} State`].filter(Boolean).join(', ');
export const optionsFor = (spec, data) => typeof spec.options === 'function' ? spec.options(data) : spec.options;
export const formatNaira = value => {
  const n = Number(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? '₦' + n.toLocaleString('en-NG', { maximumFractionDigits: 2 }) : '';
};

export function photoTooOld(file, today = Date.now()) {
  if (!file || file.demo || file.source === 'camera') return false;
  const taken = file.takenAt || file.file?.lastModified;
  return !taken || today - taken > PHOTO_MAX_AGE_DAYS * 864e5;
}

export function validateStep(step, values, today = new Date()) {
  const errors = {};
  const required = (path, value) => {
    if (!String(value ?? '').trim()) errors[path] = 'This field is required.';
  };
  const validateFields = (fields, prefix, data) => fields.forEach(spec => {
    if (!spec.optional) required(prefix + spec.key, data[spec.key]);
    const options = spec.type === 'select' && optionsFor(spec, data);
    if (options && data[spec.key] && !options.includes(data[spec.key])) errors[prefix + spec.key] = 'Choose an option from the list.';
  });
  const count = Number(values.count);
  const key = STEPS[step - 1]?.key;
  if (key === 'identity') {
    for (const id of ['bvn', 'nin']) if (!/^\d{11}$/.test(values[id])) errors[id] = 'Enter exactly 11 digits.';
    if (!values.photo?.liveness) errors.photo = 'Take a live photo so we can match it to your BVN/NIN photo.';
  }
  if (key === 'otp' && values.otp !== '64912') errors.otp = 'Use the preview code 64912. No SMS is sent.';
  if (key === 'parent') {
    const p = values.parent;
    validateFields(allParentFields, 'parent.', p);
    if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errors['parent.email'] = 'Enter a valid email address.';
    if (!(ageInYears(p.dob, today) >= 18)) errors['parent.dob'] = 'Parent/guardian must be at least 18 years old.';
    if (!(ageInYears(p.nextOfKinDob, today) >= 18)) errors['parent.nextOfKinDob'] = 'Next of kin must be at least 18 years old.';
    if (!p.location) errors['parent.location'] = 'Pin your residential address on the map.';
    if (p.pep === 'Yes') required('parent.pepPosition', p.pepPosition);
  }
  if (['count', 'children'].includes(key) && !(count >= 1 && count <= MAX_CHILDREN)) errors.count = 'Choose between 1 and 6 children.';
  if (key === 'children') values.children.slice(0, count).forEach((child, i) => {
    const p = `children.${i}.`;
    validateFields(childFields, p, child);
    const age = ageInYears(child.dob, today);
    if (child.dob && !(age >= 0 && age <= 15)) errors[p + 'dob'] = 'Enter a date of birth for a child aged 0–15.';
    if (child.nin && !/^\d{11}$/.test(child.nin)) errors[p + 'nin'] = 'Enter exactly 11 digits or leave this blank.';
    if (child.phone && !/^\+?[\d ()-]{7,20}$/.test(child.phone)) errors[p + 'phone'] = 'Enter a valid phone number or leave this blank.';
  });
  if (key === 'documents') {
    if (!values.parentPhoto) errors.parentPhoto = 'Take a photograph with your camera.';
    else if (values.parentPhoto.source !== 'camera') errors.parentPhoto = 'This photograph must be taken with your camera.';
    if (!values.addressFile) errors.addressFile = 'Upload or take a picture of your proof of address.';
    if (!values.signature) errors.signature = 'Sign on the pad, upload your signature or take a picture of it.';
    values.childFiles.slice(0, count).forEach((files, i) => {
      if (!files.photo) errors[`childFiles.${i}.photo`] = 'Upload or take a photograph.';
      else if (photoTooOld(files.photo, today.getTime())) errors[`childFiles.${i}.photo`] = `Use a photograph taken within the last ${PHOTO_MAX_AGE_DAYS} days.`;
      if (!files.birth) errors[`childFiles.${i}.birth`] = 'Upload or take a picture of the birth certificate.';
    });
  }
  if (key === 'fund') {
    const todayIso = isoDate(today);
    let recurring = false;
    values.funding.slice(0, count).forEach((fund, i) => {
      const p = `funding.${i}.`;
      if (!FUNDING_TYPES.includes(fund.type)) errors[p + 'type'] = 'Choose a funding type.';
      const amount = Number(String(fund.amount).replace(/[^\d.]/g, ''));
      if (!(amount > 0)) errors[p + 'amount'] = 'Enter an amount greater than ₦0.';
      if (!/^\d{10}$/.test(fund.sourceAccount)) errors[p + 'sourceAccount'] = 'Enter the 10-digit account number to debit.';
      if (fund.type === 'Recurring payment') {
        recurring = true;
        if (!FREQUENCIES.includes(fund.frequency)) errors[p + 'frequency'] = 'Choose how often to fund this account.';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fund.startDate) || fund.startDate < todayIso) errors[p + 'startDate'] = 'Choose a start date from today onwards.';
        if (fund.endDate && fund.endDate <= fund.startDate) errors[p + 'endDate'] = 'The end date must be after the start date.';
      }
    });
    if (recurring && !values.mandate) errors.mandate = 'Authorise the standing order to continue.';
  }
  return errors;
}

export function validateFile(file, imageOnly = false) {
  if (!file || file.size === 0) return 'Choose a non-empty file.';
  if (file.size > 5 * 1024 * 1024) return 'Choose a file smaller than 5 MB.';
  const allowed = imageOnly
    ? { 'image/png': ['png'], 'image/jpeg': ['jpg', 'jpeg'] }
    : { 'image/png': ['png'], 'image/jpeg': ['jpg', 'jpeg'], 'application/pdf': ['pdf'] };
  const ext = file.name.split('.').pop().toLowerCase();
  return allowed[file.type]?.includes(ext) ? null : `Choose ${imageOnly ? 'a JPG or PNG image' : 'a PDF, JPG or PNG file'}.`;
}

export function demoAccountNumbers(count, seed = Date.now()) {
  return Array.from({ length: count }, (_, i) => '01' + String((seed * 7 + i * 7919) % 1e8).padStart(8, '0'));
}
