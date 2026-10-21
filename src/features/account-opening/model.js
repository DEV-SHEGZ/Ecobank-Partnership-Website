export const STEP_NAMES = ['Identity', 'OTP', 'Parent details', 'Number of children', 'Child details', 'Documents', 'Review', 'Terms & Conditions', 'Account results'];
export const STEP_COPY = ['Kindly fill in the details provided correctly', 'Enter the OTP sent to your phone number', 'Please, fill in parent and guardian details.', 'Kindly select the number of children/wards you wish to open an account for', 'Kindly select the number of children/wards you wish to open an account for', 'Kindly upload the following document to complete this account opening process of each child/ward', 'Kindly review all information provided to ensure that they are all correct.'];
export const STATES = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];
export const parentFields = [['name', 'Parent/Guardian Name', 'text', 'Funmilayo Adaeze Sanusi'], ['childName', 'Child’s Name', 'text', 'Joshua Adeola Sanusi'], ['dob', 'Date of Birth', 'date'], ['email', 'Email Address', 'email', 'funmilayoadaeze@domain.com'], ['origin', 'State of Origin', STATES], ['originLga', 'Local Government Area (LGA)', 'text', 'Enter local government area'], ['residence', 'State of Residence', STATES], ['residenceLga', 'Local Government Area (LGA) of Residence', 'text', 'Enter local government area'], ['address', 'Residential Address', 'text', 'Enter residential address'], ['income', 'Annual Income', ['Less than ₦32 million', '₦32 million to less than ₦50 million', '₦50 million and above']], ['employment', 'Employment Status', ['Employed', 'Self Employed', 'Unemployed']], ['nextOfKin', 'Next of Kin (18 years and older)', 'text', 'Damola Chinedu Sanusi'], ['pep', 'Politically Exposed Person (PEP) Status', ['Yes', 'No']]];
export const childFields = [['title', 'Title', ['Master', 'Miss']], ['name', 'Full Name (First, Middle, and Last Name)', 'text', 'John Alan Doe'], ['dob', 'Date of Birth', 'date'], ['gender', 'Gender', ['Male', 'Female']], ['birthplace', 'Place of Birth', 'text', 'Nigeria'], ['nin', 'NIN (if available)', 'text', '11 digits', true], ['phone', 'Child/Ward Phone Number (if any)', 'tel', '+234 803 456 7890', true], ['currency', 'Account Currency', ['NGN (₦)', 'USD ($)', 'Euro (€)']]];
export const emptyChild = () => Object.fromEntries(childFields.map(([key]) => [key, '']));
export const emptyValues = () => ({
  bvn: '',
  nin: '',
  otp: '',
  parent: Object.fromEntries(parentFields.map(([key]) => [key, ''])),
  count: '1',
  children: Array.from({
    length: 6
  }, emptyChild),
  photo: null,
  addressFile: null,
  signature: null,
  childFiles: Array.from({
    length: 6
  }, () => ({
    photo: null,
    birth: null
  })),
  consent: false
});
export function sampleValues() {
  const values = emptyValues();
  values.bvn = '00000000000';
  values.nin = '00000000000';
  values.parent = {
    name: 'Funmilayo Adaeze Sanusi',
    childName: 'Joshua Adeola Sanusi',
    dob: '1990-06-23',
    email: 'parent@example.com',
    origin: 'Oyo',
    originLga: 'Ibadan North',
    residence: 'Lagos',
    residenceLga: 'Alimosho',
    address: '20 Example Street, Lagos',
    income: 'Less than ₦32 million',
    employment: 'Self Employed',
    nextOfKin: 'Damola Chinedu Sanusi',
    pep: 'No',
    pepPosition: ''
  };
  values.count = '4';
  const names = ['Joshua Sanusi', 'Shade Sanusi', 'Samuel Sanusi', 'David Sanusi', 'Ada Sanusi', 'John Sanusi'];
  values.children = names.map((name, i) => ({
    title: i % 2 ? 'Miss' : 'Master',
    name,
    dob: '2017-06-23',
    gender: i % 2 ? 'Female' : 'Male',
    birthplace: 'Nigeria',
    nin: '',
    phone: '',
    currency: 'NGN (₦)'
  }));
  values.photo = {
    name: 'Sample photograph',
    demo: true
  };
  values.addressFile = {
    name: 'Sample proof of address.pdf',
    demo: true
  };
  values.signature = {
    name: 'Sample signature',
    demo: true
  };
  values.childFiles = names.map(() => ({
    photo: {
      name: 'Sample photograph',
      demo: true
    },
    birth: {
      name: 'Sample birth certificate.pdf',
      demo: true
    }
  }));
  return values;
}
export function ageInYears(value, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return NaN;
  const date = new Date(value + 'T00:00:00');
  if (Number.isNaN(date.getTime()) || date > today || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` !== value) return NaN;
  return today.getFullYear() - date.getFullYear() - Number(today.getMonth() < date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() < date.getDate()));
}
export function validateStep(step, values) {
  const errors = {};
  const required = (path, value) => {
    if (!String(value ?? '').trim()) errors[path] = 'This field is required.';
  };
  const validateFields = (fields, prefix, data) => fields.forEach(([key,, type,, optional]) => {
    if (!optional) required(prefix + key, data[key]);
    if (Array.isArray(type) && data[key] && !type.includes(data[key])) errors[prefix + key] = 'Choose an option from the list.';
  });
  if (step === 1) {
    for (const key of ['bvn', 'nin']) if (!/^\d{11}$/.test(values[key])) errors[key] = 'Enter exactly 11 digits.';
    if (!values.photo) errors.photo = 'Choose a photo or use the sample details.';
  }
  if (step === 2 && values.otp !== '64912') errors.otp = 'Use the preview code 64912. No SMS is sent.';
  if (step === 3) {
    validateFields(parentFields, 'parent.', values.parent);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.parent.email)) errors['parent.email'] = 'Enter a valid email address.';
    if (!(ageInYears(values.parent.dob) >= 18)) errors['parent.dob'] = 'Parent/guardian must be at least 18 years old.';
    if (values.parent.pep === 'Yes') required('parent.pepPosition', values.parent.pepPosition);
  }
  if ([4, 5].includes(step) && !/^[1-6]$/.test(String(values.count))) errors.count = 'Choose between 1 and 6 children.';
  if (step === 5) values.children.slice(0, Number(values.count)).forEach((child, i) => {
    const p = `children.${i}.`;
    validateFields(childFields, p, child);
    const age = ageInYears(child.dob);
    if (!(age >= 0 && age <= 15)) errors[p + 'dob'] = 'Enter a date of birth for a child aged 0–15.';
    if (child.nin && !/^\d{11}$/.test(child.nin)) errors[p + 'nin'] = 'Enter exactly 11 digits or leave this blank.';
    if (child.phone && !/^\+?[\d ()-]{7,20}$/.test(child.phone)) errors[p + 'phone'] = 'Enter a valid phone number or leave this blank.';
  });
  if (step === 6) {
    if (!values.photo) errors.photo = 'Choose a parent/guardian photograph.';
    if (!values.addressFile) errors.addressFile = 'Choose proof of address.';
    if (!values.signature) errors.signature = 'Draw or select a signature.';
    values.childFiles.slice(0, Number(values.count)).forEach((files, i) => {
      if (!files.photo) errors[`childFiles.${i}.photo`] = 'Choose a photograph.';
      if (!files.birth) errors[`childFiles.${i}.birth`] = 'Choose a birth certificate.';
    });
  }
  if (step === 8 && !values.consent) errors.consent = 'Confirm that you understand this is a preview.';
  return errors;
}
export function validateFile(file, imageOnly = false) {
  if (!file || file.size === 0) return 'Choose a non-empty file.';
  if (file.size > 5 * 1024 * 1024) return 'Choose a file smaller than 5 MB.';
  const allowed = imageOnly ? {
    'image/png': ['png'],
    'image/jpeg': ['jpg', 'jpeg']
  } : {
    'image/png': ['png'],
    'image/jpeg': ['jpg', 'jpeg'],
    'application/pdf': ['pdf']
  };
  const ext = file.name.split('.').pop().toLowerCase();
  return allowed[file.type]?.includes(ext) ? null : `Choose ${imageOnly ? 'a JPG or PNG image' : 'a PDF, JPG or PNG file'}.`;
}
