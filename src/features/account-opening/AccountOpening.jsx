import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Field, Upload, Photo, Signature, Otp } from './Fields';
import { STEP_NAMES, STEP_COPY, parentFields, childFields, emptyValues, sampleValues, validateStep } from './model';
import SuccessArt from './SuccessArt';
import AccountHero from './AccountHero';
import learningBadge from '../../images/account/learning-badge.svg';
import terms from './terms.json';
import logo from '../../images/account/666e2.svg';
import footerLogo from '../../images/account/3204c.svg';
import atcText from '../../images/account/93f63.svg';
import atcFace from '../../images/account/d6b77.png';
import checkArt from '../../images/account/be198.svg';
import './account-opening.css';
const destinations = [['About', 'about'], ['How it Works', 'how-it-works'], ['Our Teachers', 'teachers'], ['The Journey', 'journey'], ['Enrol Now', 'enrol']];
function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="account-nav"><Link to="/" aria-label="Ecobank home"><img src={logo} alt="Ecobank" /></Link><button type="button" className="account-menu" aria-expanded={open} aria-controls="account-links" onClick={() => setOpen(!open)}><span className="account-visually-hidden">{open ? 'Close menu' : 'Menu'}</span><span aria-hidden="true">☰</span></button><nav id="account-links" className={open ? 'is-open' : ''} aria-label="Main navigation">{destinations.map(([title, id]) => <Link key={id} to={`/#${id}`}>{title}</Link>)}</nav><Link className="account-learning" to="/#enrol">Start Learning <img src={learningBadge} alt="" /></Link></header>;
}
function FormFooter() {
  return <footer className="account-footer"><div className="account-footer-top"><div><div className="account-brands"><img src={footerLogo} alt="Ecobank" /><span /><img className="account-face" src={atcFace} alt="" /><img className="account-atc" src={atcText} alt="Andrew Teaches Coding" /></div><p>Ecobank Nigeria is partnering with Andrew Teaches Coding to expand the accessibility, credibility and reach of coding education for school children across Nigeria.</p></div><div><h3>Social Links</h3><p className="account-footer-note">Social and contact links will be available when the service launches.</p></div><nav aria-label="Footer navigation"><h3>Quick Links</h3>{destinations.map(([title, id]) => <Link key={id} to={`/#${id}`}>{title}</Link>)}</nav></div><div className="account-legal"><p>© 2026. Ecobank/Andrew Teaches Coding. All Rights Reserved.</p><span>Local account-opening preview</span></div></footer>;
}
function Fields({
  fields,
  prefix
}) {
  return <div className="account-grid">{fields.map(([key, label, type, placeholder, optional]) => <Field key={key} name={prefix + key} label={label} type={type} placeholder={placeholder} optional={optional} />)}</div>;
}
function Children({
  count,
  documents = false,
  review = false,
  values
}) {
  return <div className="account-children">{Array.from({
      length: count
    }, (_, i) => <details key={i} open={i === 0}><summary>Child/Ward {i + 1}</summary><div className="account-child-body">{review ? <ReviewFields fields={childFields} values={values.children[i]} /> : documents ? <div className="account-grid"><Upload name={`childFiles.${i}.photo`} label="Child/Ward Photograph" imageOnly /><Upload name={`childFiles.${i}.birth`} label="Child/Ward Birth Certificate" /></div> : <Fields fields={childFields} prefix={`children.${i}.`} />}</div></details>)}</div>;
}
function ReviewFields({
  fields,
  values
}) {
  return <dl className="account-grid account-review">{fields.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{values[key] || 'Not provided'}</dd></div>)}</dl>;
}
export default function AccountOpening() {
  const methods = useForm({
    defaultValues: emptyValues(),
    shouldUnregister: false
  });
  const {
    getValues,
    reset,
    setError,
    clearErrors
  } = methods;
  const count = Number(useWatch({
    control: methods.control,
    name: 'count'
  })) || 1;
  const pep = useWatch({
    control: methods.control,
    name: 'parent.pep'
  });
  const photo = useWatch({
    control: methods.control,
    name: 'photo'
  });
  const [step, setStep] = useState(1),
    [errorList, setErrorList] = useState([]),
    [returnToReview, setReturnToReview] = useState(false),
    [claimMessage, setClaimMessage] = useState(false);
  const heading = useRef(),
    panel = useRef(),
    mounted = useRef(false);
  useEffect(() => {
    document.title = `${STEP_NAMES[step - 1]} · Ecobank Account Opening`;
    if (mounted.current) {
      heading.current?.focus({
        preventScroll: true
      });
      panel.current?.scrollIntoView({
        block: 'start',
        behavior: 'instant'
      });
    } else {
      window.scrollTo(0, 0);
      mounted.current = true;
    }
  }, [step]);
  useEffect(() => () => {
    document.title = 'Ecobank · Andrew Teaches Coding';
  }, []);
  const changeStep = next => {
    clearErrors();
    setErrorList([]);
    setStep(next);
  };
  function submit(e) {
    e.preventDefault();
    if (step === 7) {
      for (const check of [1, 2, 3, 4, 5, 6]) {
        if (Object.keys(validateStep(check, getValues())).length) {
          setReturnToReview(true);
          changeStep(check);
          return;
        }
      }
    }
    const errors = validateStep(step, getValues());
    clearErrors();
    Object.entries(errors).forEach(([name, message]) => setError(name, {
      type: 'validate',
      message
    }));
    setErrorList(Object.values(errors));
    if (Object.keys(errors).length) {
      requestAnimationFrame(() => {
        const el = document.getElementById(Object.keys(errors)[0]) || document.querySelector('.account-form [aria-invalid="true"]');
        el?.closest('details')?.setAttribute('open', '');
        el?.focus();
      });
      return;
    }
    if (returnToReview && [3, 5, 6].includes(step)) {
      setReturnToReview(false);
      changeStep(7);
    } else changeStep(step + 1);
  }
  const edit = next => {
    setReturnToReview(true);
    changeStep(next);
  };
  function loadSample() {
    if (methods.formState.isDirty && !window.confirm('Replace the details currently entered with sample details?')) return;
    reset(sampleValues());
    clearErrors();
    setErrorList([]);
    setReturnToReview(false);
    changeStep(1);
  }
  const values = getValues();
  return <div className="account-page"><a className="account-skip" href="#account-form">Skip to account opening</a><SiteHeader /><AccountHero />
    <div className="account-preview"><strong>Local preview</strong><span>Use sample details only. Nothing is sent to a bank or saved after you leave or refresh.</span><button type="button" onClick={loadSample}>Use sample details</button></div>
    <main><section ref={panel} id="account-form" className={`account-panel account-step-${step}`} aria-labelledby="account-title">
      <div className="account-paper"><div className="account-progress"><span>Step {step} of 9 · {STEP_NAMES[step - 1]}</span><progress value={step} max={9} aria-label={`Step ${step} of 9`} /></div>
      {step < 8 && <div className="account-title"><h1 id="account-title" ref={heading} tabIndex={-1}>ACCOUNT OPENING</h1><p>{STEP_COPY[step - 1]}</p></div>}
      <FormProvider {...methods}><form className="account-form" onSubmit={submit} noValidate>
        {errorList.length > 0 && <div className="account-error-summary" role="alert">Please correct the highlighted fields before continuing.</div>}
        {step === 1 && <><div className="account-grid"><Field name="bvn" label="Parent’s Bank Verification Number (BVN)" placeholder="21234596870" /><Field name="nin" label="Parent’s National Identification Number (NIN)" placeholder="22515263226" /></div><div className="account-identity"><div><h2>BVN/NIN Photo</h2><div className="account-reference-photo"><Photo value={photo?.demo ? photo : null} label="Sample BVN/NIN photograph" /></div><p className="account-hint">Reference photo appears after verification in the live service.</p></div><div><Upload name="photo" label="Photo Taken" imageOnly portrait /><p className="account-capture-note">Kindly follow the instructions below while on the capturing screen.</p><ul><li>Keep your shot within the frame provided.</li><li>Your camera has to be in a steady position.</li><li>Make sure you capture in a plain background.</li></ul></div></div></>}
        {step === 2 && <Otp />}
        {step === 3 && <><Fields fields={parentFields} prefix="parent." /><div className="account-pep"><h2>PEP QUESTION</h2><p>Have you or a member of your nuclear family ever held a “position of authority” in the government, a political party, an international organization, a government ministry, department or agency, a public corporation, the judicial system, the military, the police or any other law enforcement agency or a traditional leader? Yes or No)</p>{pep === 'Yes' ? <Field name="parent.pepPosition" label="If Yes, state position held" /> : <p>If No, proceed to next question.</p>}</div></>}
        {[4, 5].includes(step) && <div className="account-count"><Field name="count" label="How many children/wards do you wish to open an account for, on their behalf?" type={['1', '2', '3', '4', '5', '6']} /></div>}
        {step === 5 && <><p className="account-intro">Fill in the personal information for each child/ward you have selected to open an account for</p><Children count={count} /></>}
        {step === 6 && <><h2 className="account-subtitle">Parent/Guardian Section</h2><div className="account-document-card"><div className="account-grid"><Upload name="photo" label="Parent/Guardian Photograph" imageOnly /><Upload name="addressFile" label="Proof of Address" /></div><Signature /></div><h2 className="account-subtitle">Children/Wards Section</h2><Children count={count} documents /></>}
        {step === 7 && <><div className="account-review-heading"><h2>Parent/Guardian Information</h2><button type="button" onClick={() => edit(3)}>Edit Info</button></div><ReviewFields fields={parentFields} values={values.parent} />{values.parent.pep === 'Yes' && <p>Position held: {values.parent.pepPosition}</p>}<div className="account-review-heading"><h2>Children/Wards Information</h2><button type="button" onClick={() => edit(5)}>Edit Info</button></div><Children count={count} review values={values} /><div className="account-review-heading"><h2>Documents</h2><button type="button" onClick={() => edit(6)}>Edit Documents</button></div><p>{count} child/ward document sets selected. Files stay in this browser session.</p></>}
        {step === 8 && <><div className="account-terms-heading"><h1 id="account-title" ref={heading} tabIndex={-1}>Terms &amp; Conditions</h1><button type="button" onClick={() => changeStep(7)} aria-label="Close terms and return to review">×</button></div><p className="account-hint">Preview only: the design contains placeholder terms below. This does not create an agreement or open an account.</p><div className="account-terms">{terms.map((text, i) => text === 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' ? <h2 key={i}>{text}</h2> : <p key={i}>{text}</p>)}</div><label className="account-consent"><input id="consent" aria-invalid={!!methods.formState.errors.consent} type="checkbox" {...methods.register('consent')} />I understand these are placeholder terms for a local preview.</label>{methods.formState.errors.consent && <p className="account-error">{methods.formState.errors.consent.message}</p>}</>}
        {step === 9 && <div className="account-success"><img className="account-success-check" src={checkArt} alt="" /><SuccessArt /><div className="account-success-content"><h1 id="account-title" ref={heading} tabIndex={-1}>Your Account Numbers are:</h1><p className="account-demo-result">Demo results only — no bank accounts were created.</p>{values.children.slice(0, count).map((child, i) => <div className="account-result" key={i}><h2>{child.name}</h2><p>DEMO-{String(i + 1).padStart(4, '0')}</p></div>)}<button className="account-learning" type="button" onClick={() => setClaimMessage(true)}><img src={atcFace} alt="" />Claim free coding workbook now</button>{claimMessage && <p role="status" className="account-hint">Workbook claiming will be available when the live account service is connected. <Link to="/#enrol">View learning options</Link>.</p>}</div></div>}
        <div className="account-actions">{step > 1 && <button className="account-back" type="button" onClick={() => {
                  setReturnToReview(false);
                  changeStep(step - 1);
                }}>Back</button>}{step < 9 && <button type="submit" className="account-primary">{returnToReview ? 'Save and return to review' : {
                    1: 'Submit',
                    2: 'Confirm OTP',
                    3: 'Submit Form',
                    4: 'Continue',
                    5: 'Submit Form',
                    6: 'Submit Form',
                    7: 'Continue Account Opening',
                    8: 'I agree to the terms & conditions'
                  }[step]}</button>}{step === 9 && <Link className="account-primary" to="/">Back to home</Link>}</div>
      </form></FormProvider></div>
    </section><section className="account-ad"><h2>Give <span>Your Child</span> the Best Start in Life!</h2><p>Every big dream begins with a small step. <strong>MyFirst Account</strong> is specially designed for children and teenagers aged <strong>0 - 15 years,</strong> helping parents build a strong financial foundation from day one.</p><button type="button" className="account-primary" onClick={() => {
          if (step === 9) {
            if (window.confirm('Start a new preview and clear these details?')) {
              reset(emptyValues());
              changeStep(1);
            }
          } else panel.current?.scrollIntoView({
            behavior: 'smooth'
          });
        }}>Register Now</button></section></main><FormFooter /></div>;
}
