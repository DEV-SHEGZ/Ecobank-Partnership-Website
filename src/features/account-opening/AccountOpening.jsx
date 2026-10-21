import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FieldSpec, Input, Select, Upload, Photo, Signature, Otp, LivePhoto } from './Fields';
import AddressMap from './AddressMap';
import { TermsModal, BenefitsModal } from './Modals';
import {
  STEPS, BVN_RECORD, MAX_CHILDREN, FUNDING_TYPES, FREQUENCIES, parentFields, addressFields, parentExtraFields, childFields,
  emptyValues, sampleValues, validateStep, formatAddress, formatNaira, demoAccountNumbers, stepIndex
} from './model';
import SuccessArt from './SuccessArt';
import AccountHero from './AccountHero';
import learningBadge from '../../images/account/learning-badge.svg';
import logo from '../../images/account/666e2.svg';
import footerLogo from '../../images/account/3204c.svg';
import atcText from '../../images/account/93f63.svg';
import atcFace from '../../images/account/d6b77.png';
import checkArt from '../../images/account/be198.svg';
import './account-opening.css';

const destinations = [['About', 'about'], ['How it Works', 'how-it-works'], ['Our Teachers', 'teachers'], ['The Journey', 'journey'], ['Enrol Now', 'enrol']];
const COUNT_OPTIONS = Array.from({ length: MAX_CHILDREN }, (_, i) => String(i + 1));

function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="account-nav"><Link to="/" aria-label="Ecobank home"><img src={logo} alt="Ecobank" /></Link><button type="button" className="account-menu" aria-expanded={open} aria-controls="account-links" onClick={() => setOpen(!open)}><span className="account-visually-hidden">{open ? 'Close menu' : 'Menu'}</span><span aria-hidden="true">☰</span></button><nav id="account-links" className={open ? 'is-open' : ''} aria-label="Main navigation">{destinations.map(([title, id]) => <Link key={id} to={`/#${id}`}>{title}</Link>)}</nav><Link className="account-learning" to="/#enrol">Start Learning <img src={learningBadge} alt="" /></Link></header>;
}
const SOCIAL = ['Instagram', 'Facebook', 'LinkedIn', 'Email'];
const QUICK_LINKS = [['About', 'about'], ['How it Works', 'how-it-works'], ['The Journey', 'journey'], ['Our Teachers', 'teachers'], ['Learning Pathway', 'enrol']];
const LEGAL = ['Terms and Conditions', 'Privacy Policy', 'Legal'];
const Arrow = () => <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12L12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
/* Footer frame (1440 × 573): #023448, lime headings, divider #046C95. Social/legal URLs are not in the design yet. */
function FormFooter() {
  return <footer className="account-footer">
    <div className="account-footer-top">
      <div className="account-footer-about">
        <div className="account-brands"><img src={footerLogo} alt="Ecobank, The Pan African Bank" /><span aria-hidden="true" /><img className="account-face" src={atcFace} alt="" /><img className="account-atc" src={atcText} alt="Andrew Teaches Coding" /></div>
        <p>Ecobank Nigeria is partnering with Andrew Teaches Coding to expand the accessibility, credibility and reach of coding education for school children across Nigeria.</p>
      </div>
      <div className="account-footer-links">
        <nav aria-label="Social links"><h3>Social Links</h3><ul>{SOCIAL.map(name => <li key={name}><span className="account-footer-soon" title="Link coming soon">{name}<Arrow /></span></li>)}</ul></nav>
        <nav aria-label="Quick links"><h3>Quick Links</h3><ul>{QUICK_LINKS.map(([title, id]) => <li key={title}><Link to={`/#${id}`}>{title}</Link></li>)}</ul></nav>
      </div>
    </div>
    <div className="account-legal">
      <p>© 2026.&nbsp; EcoBank/Andrew Teaches Coding.&nbsp; All Rights Reserved.</p>
      <ul>{LEGAL.map(name => <li key={name}><span className="account-footer-soon" title="Link coming soon">{name}</span></li>)}</ul>
    </div>
  </footer>;
}

function Fields({ fields, prefix, data }) {
  return <div className="account-grid">{fields.map(spec => <FieldSpec key={spec.key} spec={spec} prefix={prefix} data={data} />)}</div>;
}
function Accordion({ title, open, children }) {
  return <details open={open}><summary>{title}</summary><div className="account-child-body">{children}</div></details>;
}
function ReviewFields({ fields, values }) {
  return <dl className="account-grid account-review">{fields.map(({ key, label, value }) => <div key={key}><dt>{label}</dt><dd>{value ?? values?.[key] ?? 'Not provided'}</dd></div>)}</dl>;
}
function CountSelect() {
  return <div className="account-count"><Select name="count" label="How many children/wards do you wish to open an account for, on their behalf?" caption="Number of children/wards" options={COUNT_OPTIONS} /></div>;
}

function ParentStep({ parent }) {
  const pep = parent?.pep;
  return <>
    <Fields fields={parentFields} prefix="parent." data={parent} />
    <fieldset className="account-address">
      <legend className="account-label">Residential Address</legend>
      <div className="account-grid account-address-grid">{addressFields.map(spec => <FieldSpec key={spec.key} spec={spec} prefix="parent." data={parent} />)}</div>
      <AddressMap />
    </fieldset>
    <Fields fields={parentExtraFields} prefix="parent." data={parent} />
    <div className="account-pep">
      <h2>PEP QUESTION</h2>
      <ul>
        <li>Have you or a member of your nuclear family ever held a <strong>“position of authority”</strong> in the government, a political party, an international organization, a government ministry, department or agency, a public corporation, the judicial system, the military, the police or any other law enforcement agency or a traditional leader? Yes or No)</li>
        {pep === 'Yes' ? <li className="account-pep-field"><Input name="parent.pepPosition" label="If Yes, state position held" /></li> : <li>If Yes, state position held<span className="account-pep-dots" aria-hidden="true" /></li>}
        <li>If No, proceed to next question.</li>
      </ul>
    </div>
  </>;
}

function DocumentsStep({ count }) {
  return <>
    <h2 className="account-subtitle">Parent/Guardian Section</h2>
    <div className="account-document-card">
      <div className="account-grid">
        <Upload name="parentPhoto" label="Parent/Guardian Photograph" imageOnly mode="camera" />
        <Upload name="addressFile" label="Proof of Address" dropText="Drag and drop file here" />
      </div>
      <p className="account-doc-note">Proof of address can be a recent utility bill or another document that shows your residential address.</p>
      <Signature />
    </div>
    <h2 className="account-subtitle">Children/Wards Section</h2>
    <div className="account-children">{Array.from({ length: count }, (_, i) => <Accordion key={i} title={`Child/Ward ${i + 1}`} open={i === 0}>
      <div className="account-grid">
        <Upload name={`childFiles.${i}.photo`} label="Child/Ward Photograph" imageOnly maxAge dropText="Take Photograph with Camera" />
        <Upload name={`childFiles.${i}.birth`} label="Child/Ward Birth Certificate" />
      </div>
      <p className="account-doc-note">The photograph must be recent — taken within the last 90 days.</p>
    </Accordion>)}</div>
  </>;
}

function ReviewStep({ values, count, edit }) {
  const p = values.parent;
  const parentRows = [
    ...parentFields,
    { key: 'address', label: 'Residential Address', value: formatAddress(p) || 'Not provided' },
    { key: 'pin', label: 'Map Pin', value: p.location ? p.location.label : 'Not provided' },
    ...parentExtraFields,
    ...(p.pep === 'Yes' ? [{ key: 'pepPosition', label: 'Position Held' }] : [])
  ];
  const docName = file => file ? file.name : 'Not provided';
  return <>
    <div className="account-review-heading"><h2>Parent/Guardian Information</h2><button type="button" onClick={() => edit('parent')}>Edit Info</button></div>
    <ReviewFields fields={parentRows} values={p} />
    <div className="account-review-heading"><h2>Children/Wards Information</h2><button type="button" onClick={() => edit('children')}>Edit Info</button></div>
    <div className="account-children">{Array.from({ length: count }, (_, i) => <Accordion key={i} title={`Child/Ward ${i + 1}`} open={i === 0}><ReviewFields fields={childFields} values={values.children[i]} /></Accordion>)}</div>
    <div className="account-review-heading"><h2>Documents</h2><button type="button" onClick={() => edit('documents')}>Edit Documents</button></div>
    <dl className="account-grid account-review">
      <div><dt>Parent/Guardian Photograph</dt><dd>{docName(values.parentPhoto)}</dd></div>
      <div><dt>Proof of Address</dt><dd>{docName(values.addressFile)}</dd></div>
      <div><dt>Parent/Guardian Signature</dt><dd>{docName(values.signature)}</dd></div>
      {Array.from({ length: count }, (_, i) => <div key={i}><dt>Child/Ward {i + 1} Documents</dt><dd>{[values.childFiles[i].photo, values.childFiles[i].birth].filter(Boolean).length} of 2 provided</dd></div>)}
    </dl>
  </>;
}

function FundStep({ values, count }) {
  const funding = useWatch({ name: 'funding' }) || [];
  const recurring = funding.slice(0, count).some(f => f.type === 'Recurring payment');
  const { register, formState: { errors } } = useFormContext();
  return <>
    <div className="account-children">{Array.from({ length: count }, (_, i) => {
      const f = funding[i] || {}, p = `funding.${i}.`;
      return <Accordion key={i} open title={<>{`Child/Ward ${i + 1}`}<span className="account-summary-meta">{values.children[i].name} · {values.accounts[i]}</span></>}>
        <div className="account-grid">
          <Select name={p + 'type'} label="Funding Type" caption="Funding Type" options={FUNDING_TYPES} />
          <Input name={p + 'amount'} label={f.type === 'Recurring payment' ? 'Amount per Payment (₦)' : 'Amount (₦)'} placeholder="50,000" />
          <Input name={p + 'sourceAccount'} label="Account to Debit (10-digit account number)" placeholder="0123456789" />
          {f.type === 'Recurring payment' && <>
            <Select name={p + 'frequency'} label="Frequency" caption="Frequency" options={FREQUENCIES} />
            <Input name={p + 'startDate'} label="Start Date" type="date" />
            <Input name={p + 'endDate'} label="End Date (optional)" type="date" optional />
          </>}
        </div>
        {f.type === 'Recurring payment' && formatNaira(f.amount) && f.frequency && <p className="account-fund-summary">Standing order: {formatNaira(f.amount)} {f.frequency.toLowerCase()} into {values.children[i].name}’s account{f.startDate ? `, starting ${f.startDate}` : ''}{f.endDate ? ` until ${f.endDate}` : ''}.</p>}
      </Accordion>;
    })}</div>
    {recurring && <label className="account-consent"><input id="mandate" type="checkbox" aria-invalid={!!errors.mandate} aria-describedby={errors.mandate ? 'mandate-error' : undefined} {...register('mandate')} />I authorise Ecobank to debit my account for the standing order(s) above at the amount and frequency I have chosen, until the end date or until I cancel.</label>}
    {errors.mandate && <p className="account-error" id="mandate-error">{errors.mandate.message}</p>}
  </>;
}

function FundDone({ values, count }) {
  return <div className="account-fund-done">
    <img className="account-fund-check" src={checkArt} alt="" />
    <h2>Funding instructions received</h2>
    <p className="account-demo-result">Demo only — no money has moved.</p>
    <ul>{Array.from({ length: count }, (_, i) => {
      const f = values.funding[i];
      return <li key={i}><strong>{values.children[i].name}</strong><em>{values.accounts[i]}</em><span>{f.type === 'Recurring payment' ? `${formatNaira(f.amount)} ${f.frequency.toLowerCase()} standing order from ${f.startDate}` : `${formatNaira(f.amount)} one-time payment`}</span></li>;
    })}</ul>
  </div>;
}

export default function AccountOpening() {
  const methods = useForm({ defaultValues: emptyValues(), shouldUnregister: false });
  const { getValues, setValue, reset, setError, clearErrors } = methods;
  const watched = useWatch({ control: methods.control });
  const count = Math.min(Math.max(Number(watched.count) || 1, 1), MAX_CHILDREN);
  const [step, setStep] = useState(1),
    [errorList, setErrorList] = useState([]),
    [returnToReview, setReturnToReview] = useState(false),
    [claimMessage, setClaimMessage] = useState(false),
    [terms, setTerms] = useState(false),
    [benefits, setBenefits] = useState(false),
    [funded, setFunded] = useState(false);
  const heading = useRef(), panel = useRef(), mounted = useRef(false);
  const current = STEPS[step - 1];
  useEffect(() => {
    document.title = `${current.name} · Ecobank Account Opening`;
    if (mounted.current) {
      heading.current?.focus({ preventScroll: true });
      panel.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    } else {
      window.scrollTo(0, 0);
      mounted.current = true;
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { document.title = 'Ecobank · Andrew Teaches Coding'; }, []);

  const changeStep = next => {
    clearErrors();
    setErrorList([]);
    setStep(next);
  };
  const showErrors = errors => {
    clearErrors();
    Object.entries(errors).forEach(([name, message]) => setError(name, { type: 'validate', message }));
    setErrorList(Object.values(errors));
    requestAnimationFrame(() => {
      const el = document.getElementById(Object.keys(errors)[0]) || document.querySelector('.account-form [aria-invalid="true"]');
      el?.closest('details')?.setAttribute('open', '');
      el?.focus();
    });
  };
  function submit(e) {
    e.preventDefault();
    const values = getValues();
    if (current.key === 'review') {
      for (const check of STEPS.slice(0, stepIndex('review') - 1)) {
        const n = stepIndex(check.key);
        if (Object.keys(validateStep(n, values)).length) {
          setReturnToReview(true);
          changeStep(n);
          requestAnimationFrame(() => showErrors(validateStep(n, getValues())));
          return;
        }
      }
      setTerms(true);
      return;
    }
    const errors = validateStep(step, values);
    if (Object.keys(errors).length) { showErrors(errors); return; }
    if (current.key === 'identity') {
      setValue('parent.name', BVN_RECORD.name);
      setValue('parent.dob', BVN_RECORD.dob);
    }
    if (current.key === 'fund') {
      clearErrors();
      setErrorList([]);
      setFunded(true);
      if (values.funding.slice(0, count).some(f => f.type === 'One-time payment')) setBenefits(true);
      requestAnimationFrame(() => panel.current?.scrollIntoView({ block: 'start', behavior: 'instant' }));
      return;
    }
    if (returnToReview && ['parent', 'children', 'documents'].includes(current.key)) {
      setReturnToReview(false);
      changeStep(stepIndex('review'));
    } else changeStep(step + 1);
  }
  const edit = key => { setReturnToReview(true); changeStep(stepIndex(key)); };
  function agree() {
    setValue('consent', true);
    setValue('accounts', demoAccountNumbers(count));
    setTerms(false);
    changeStep(stepIndex('results'));
  }
  function startStandingOrder() {
    getValues('funding').slice(0, count).forEach((f, i) => { if (f.type === 'One-time payment') setValue(`funding.${i}.type`, 'Recurring payment'); });
    setBenefits(false);
    setFunded(false);
    requestAnimationFrame(() => document.getElementById('funding.0.frequency')?.focus());
  }
  function loadSample() {
    if (methods.formState.isDirty && !window.confirm('Replace the details currently entered with sample details?')) return;
    reset(sampleValues());
    clearErrors();
    setErrorList([]);
    setReturnToReview(false);
    setFunded(false);
    changeStep(1);
  }
  const values = getValues();
  const primaryLabel = returnToReview ? 'Save and return to review' : {
    identity: 'Submit', otp: 'Confirm OTP', parent: 'Submit Form', count: 'Continue', children: 'Submit Form',
    documents: 'Submit Form', review: 'Continue Account Opening', fund: 'Fund Account'
  }[current.key];
  const isResults = current.key === 'results';
  const bvnReady = /^\d{11}$/.test(watched.bvn || '') && /^\d{11}$/.test(watched.nin || '');

  return <div className="account-page"><a className="account-skip" href="#account-form">Skip to account opening</a><SiteHeader /><AccountHero />
    <div className="account-preview"><strong>Local preview</strong><span>Use sample details only. Nothing is sent to a bank or saved after you leave or refresh.</span><button type="button" onClick={loadSample}>Use sample details</button></div>
    <main><section ref={panel} id="account-form" className={`account-panel account-step-${current.key}`} aria-labelledby="account-title">
      <div className="account-paper"><div className="account-progress"><span>Step {step} of {STEPS.length} · {current.name}</span><progress value={step} max={STEPS.length} aria-label={`Step ${step} of ${STEPS.length}`} /></div>
        {!isResults && <div className="account-title"><h1 id="account-title" ref={heading} tabIndex={-1}>{current.title || 'ACCOUNT OPENING'}</h1><p>{funded ? 'Here is a summary of the funding you set up for each child/ward.' : current.copy}</p></div>}
        <FormProvider {...methods}><form className="account-form" onSubmit={submit} noValidate>
          {errorList.length > 0 && <div className="account-error-summary" role="alert">Please correct the highlighted fields before continuing.</div>}
          {current.key === 'identity' && <>
            <div className="account-grid"><Input name="bvn" label="Parent’s Bank Verification Number (BVN)" placeholder="21234596870" /><Input name="nin" label="Parent’s National Identification Number (NIN)" placeholder="22515263226" /></div>
            <div className="account-identity">
              <div><h2>BVN/NIN Photo</h2><div className="account-reference-photo"><Photo value={bvnReady || watched.photo?.demo ? { name: 'BVN photo', demo: true } : null} label="Photograph linked to your BVN/NIN" /></div>
                <p className="account-hint">{bvnReady ? 'Sample photo linked to your BVN/NIN.' : 'Enter your BVN and NIN to see the photo linked to them.'}</p></div>
              <div><LivePhoto /><p className="account-capture-note">Kindly follow the instructions below while on the capturing screen.</p><ul><li>Keep your shot within the frame provided.</li><li>Your camera has to be in a steady position.</li><li>Make sure you capture in a plain background.</li></ul></div>
            </div>
          </>}
          {current.key === 'otp' && <Otp />}
          {current.key === 'parent' && <ParentStep parent={watched.parent} />}
          {current.key === 'count' && <CountSelect />}
          {current.key === 'children' && <><CountSelect /><p className="account-intro">Fill in the personal information for each child/ward you have selected to open an account for</p>
            <div className="account-children">{Array.from({ length: count }, (_, i) => <Accordion key={i} title={`Child/Ward ${i + 1}`} open={i === 0}><Fields fields={childFields} prefix={`children.${i}.`} data={watched.children?.[i]} /></Accordion>)}</div></>}
          {current.key === 'documents' && <DocumentsStep count={count} />}
          {current.key === 'review' && <ReviewStep values={values} count={count} edit={edit} />}
          {isResults && <div className="account-success"><img className="account-success-check" src={checkArt} alt="" /><SuccessArt /><div className="account-success-content">
            <h1 id="account-title" ref={heading} tabIndex={-1}>Your Account Numbers are:</h1><p className="account-demo-result">Demo results only — no bank accounts were created.</p>
            {values.children.slice(0, count).map((child, i) => <div className="account-result" key={i}><h2>{child.name}</h2><p>{values.accounts[i]}</p></div>)}
            <button className="account-learning" type="button" onClick={() => setClaimMessage(true)}><img src={atcFace} alt="" />Claim free coding workbook now</button>
            {claimMessage && <p role="status" className="account-hint">Workbook claiming will be available when the live account service is connected. <Link to="/#enrol">View learning options</Link>.</p>}
          </div></div>}
          {current.key === 'fund' && (funded ? <FundDone values={values} count={count} /> : <FundStep values={values} count={count} />)}
          <div className="account-actions">
            {step > 1 && !isResults && !(current.key === 'fund' && funded) && <button className="account-back" type="button" onClick={() => { setReturnToReview(false); changeStep(step - 1); }}>Back</button>}
            {isResults && <button type="button" className="account-primary" onClick={() => changeStep(stepIndex('fund'))}>Fund Account Now</button>}
            {current.key === 'fund' && funded && <><button type="button" className="account-back" onClick={() => setFunded(false)}>Edit funding</button><Link className="account-primary" to="/">Back to home</Link></>}
            {primaryLabel && !isResults && !(current.key === 'fund' && funded) && <button type="submit" className="account-primary">{primaryLabel}</button>}
          </div>
        </form>
          <TermsModal open={terms} onClose={() => setTerms(false)} onAgree={agree} />
          <BenefitsModal open={benefits} onClose={() => setBenefits(false)} onStart={startStandingOrder} />
        </FormProvider></div>
    </section><section className="account-ad"><h2>Give <span>Your Child</span> the Best Start in Life!</h2><p>Every big dream begins with a small step. <strong>MyFirst Account</strong> is specially designed for children and teenagers aged <strong>0 - 15 years,</strong> helping parents build a strong financial foundation from day one.</p><button type="button" className="account-primary" onClick={() => {
      if (isResults || current.key === 'fund') {
        if (window.confirm('Start a new preview and clear these details?')) { reset(emptyValues()); setFunded(false); setReturnToReview(false); changeStep(1); }
      } else panel.current?.scrollIntoView({ behavior: 'smooth' });
    }}>Register Now</button></section></main><FormFooter /></div>;
}
