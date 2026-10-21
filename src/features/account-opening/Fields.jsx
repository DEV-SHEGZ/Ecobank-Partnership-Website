import { useEffect, useId, useRef, useState } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import samplePhoto from '../../images/account/4ac37.png';
import uploadIcon from '../../images/account/f5999.svg';
import { optionsFor, photoTooOld, validateFile, PHOTO_MAX_AGE_DAYS } from './model';

export const getAt = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);

function useFieldError(name) {
  const { formState: { errors } } = useFormContext();
  return getAt(errors, name)?.message;
}
const ErrorText = ({ name, error }) => error ? <span className="account-error" id={`${name}-error`}>{error}</span> : null;

/* Text-like inputs. Read-only values (from BVN) use the muted style in the design. */
export function longDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  const d = +m[3], suffix = d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th';
  return `${d}${suffix} ${new Date(+m[1], +m[2] - 1, 1).toLocaleString('en-GB', { month: 'long' })}, ${m[1]}`;
}
export function Input({ name, label, type = 'text', placeholder, optional = false, readOnly = false, hint }) {
  const { register } = useFormContext();
  const value = useWatch({ name });
  const error = useFieldError(name);
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(' ') || undefined;
  return <div className={`account-field${readOnly ? ' is-readonly' : ''}`}>
    <label htmlFor={name}>{label}</label>
    {readOnly && type === 'date' ? <input id={name} type="text" readOnly value={longDate(value)} aria-describedby={describedBy} aria-invalid={!!error} /> :
    <input id={name} {...register(name)} type={type} placeholder={placeholder} readOnly={readOnly}
      maxLength={type === 'date' ? undefined : 200} inputMode={/bvn|nin|sourceAccount/i.test(name) ? 'numeric' : /amount/i.test(name) ? 'decimal' : undefined}
      autoComplete="off" aria-invalid={!!error} aria-required={!optional && !readOnly} aria-describedby={describedBy} />}
    {hint && <span className="account-visually-hidden" id={`${name}-hint`}>{hint}</span>}
    <ErrorText name={name} error={error} />
  </div>;
}

const Chevron = () => <svg className="account-chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* Custom listbox matching the "Dropdowns for Form" sheet: white card, caption, medium options. */
export function Select({ name, label, options, caption, optional = false, placeholder = 'Select', onChange, disabledText, format = v => v }) {
  const { field } = useController({ name });
  const error = useFieldError(name);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(), list = useRef(), button = useRef(), typed = useRef({ text: '', at: 0 });
  const listId = useId();
  const disabled = !options.length;
  useEffect(() => {
    if (!open) return;
    const close = e => { if (!root.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    list.current?.focus({ preventScroll: true });
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);
  useEffect(() => {
    if (open) list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);
  const openList = () => {
    if (disabled) return;
    setActive(Math.max(0, options.indexOf(field.value)));
    setOpen(true);
  };
  const choose = value => {
    field.onChange(value);
    onChange?.(value);
    setOpen(false);
    button.current?.focus();
  };
  const onListKey = e => {
    const last = options.length - 1;
    const keys = { ArrowDown: Math.min(active + 1, last), ArrowUp: Math.max(active - 1, 0), Home: 0, End: last, PageDown: Math.min(active + 8, last), PageUp: Math.max(active - 8, 0) };
    if (e.key in keys) { e.preventDefault(); setActive(keys[e.key]); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(options[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); button.current?.focus(); }
    else if (e.key === 'Tab') setOpen(false);
    else if (e.key.length === 1) {
      const now = Date.now();
      typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : '') + e.key.toLowerCase(), at: now };
      const match = options.findIndex(o => o.toLowerCase().startsWith(typed.current.text));
      if (match >= 0) setActive(match);
    }
  };
  return <div className="account-field" ref={root}>
    <span className="account-label" id={`${name}-label`}>{label}</span>
    <div className="account-select">
      <button type="button" id={name} ref={button} className={`account-select-trigger${field.value ? '' : ' is-empty'}${error ? ' is-invalid' : ''}`}
        aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined} aria-labelledby={`${name}-label ${name}`}
        aria-describedby={[error && `${name}-error`, !optional && `${name}-req`].filter(Boolean).join(' ') || undefined} aria-disabled={disabled || undefined}
        onClick={() => open ? setOpen(false) : openList()} onBlur={field.onBlur}
        onKeyDown={e => { if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); openList(); } }}>
        <span>{field.value ? format(field.value) : (disabled && disabledText) || placeholder}</span><Chevron />
      </button>
      {!optional && <span className="account-visually-hidden" id={`${name}-req`}>Required</span>}
      {open && <div className="account-menu-card">
        <p className="account-menu-caption" aria-hidden="true">{caption || label}</p>
        <ul id={listId} ref={list} role="listbox" tabIndex={-1} aria-labelledby={`${name}-label`} aria-activedescendant={`${listId}-${active}`} onKeyDown={onListKey}>
          {options.map((value, i) => <li key={value} id={`${listId}-${i}`} data-index={i} role="option" aria-selected={value === field.value}
            className={i === active ? 'is-active' : ''} onPointerEnter={() => setActive(i)} onClick={() => choose(value)}>{value}</li>)}
        </ul>
      </div>}
    </div>
    <ErrorText name={name} error={error} />
  </div>;
}

/* Renders a field spec from model.js; dependent selects read their sibling values. */
export function FieldSpec({ spec, prefix, data }) {
  const { setValue } = useFormContext();
  const name = prefix + spec.key;
  if (spec.type === 'select') {
    const options = optionsFor(spec, data);
    return <Select name={name} label={spec.label} caption={spec.caption} options={options} optional={spec.optional}
      disabledText={spec.dependsOn ? 'Select a state first' : undefined} format={spec.format}
      onChange={spec.resets ? () => setValue(prefix + spec.resets, '') : undefined} />;
  }
  return <Input name={name} label={spec.label} type={spec.type} placeholder={spec.placeholder} optional={spec.optional} readOnly={spec.readOnly} hint={spec.hint} />;
}

export function Photo({ value, label }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!value?.file || !value.file.type.startsWith('image/')) { setUrl(''); return; }
    const next = URL.createObjectURL(value.file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [value]);
  const src = value?.demo ? samplePhoto : url;
  return src ? <img className={`account-photo${value?.demo ? ' account-photo-sample' : ''}`} src={src} alt={label} /> : <div className="account-photo-placeholder">{value?.name || 'No photo selected'}</div>;
}

const LIVENESS_PROMPTS = ['Look straight at the camera', 'Blink slowly', 'Turn your head slightly to the left', 'Turn your head slightly to the right', 'Hold still'];

/* Camera capture in a modal. With `liveness`, it walks through prompts before capturing. */
export function CameraCapture({ open, onClose, onCapture, title, liveness = false, facing = 'user', document: isDocument = false }) {
  const dialog = useRef(), video = useRef(), stream = useRef();
  const [status, setStatus] = useState('starting');
  const [prompt, setPrompt] = useState(-1);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal?.();
    if (!open && node.open) node.close();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus('starting');
    setPrompt(-1);
    if (!navigator.mediaDevices?.getUserMedia) { setStatus('unsupported'); return; }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false })
      .then(media => {
        if (cancelled) { media.getTracks().forEach(t => t.stop()); return; }
        stream.current = media;
        video.current.srcObject = media;
        video.current.play().catch(() => {});
        setStatus('ready');
      })
      .catch(err => !cancelled && setStatus(err?.name === 'NotAllowedError' ? 'denied' : 'unsupported'));
    return () => {
      cancelled = true;
      stream.current?.getTracks().forEach(t => t.stop());
      stream.current = null;
    };
  }, [open, facing]);
  useEffect(() => {
    if (prompt < 0) return;
    if (prompt >= LIVENESS_PROMPTS.length) { capture(true); return; }
    const timer = setTimeout(() => setPrompt(p => p + 1), 1600);
    return () => clearTimeout(timer);
  }, [prompt]); // eslint-disable-line react-hooks/exhaustive-deps
  function capture(passed = false) {
    const v = video.current;
    if (!v?.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext('2d');
    if (facing === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(v, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], `${isDocument ? 'document' : 'photo'}-${Date.now()}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
      onCapture({ name: file.name, file, source: 'camera', takenAt: Date.now(), ...(liveness ? { liveness: passed } : {}) });
    }, 'image/jpeg', 0.9);
  }
  const messages = {
    starting: 'Starting your camera…',
    denied: 'Camera access was blocked. Allow camera access for this site in your browser settings, then try again.',
    unsupported: 'We couldn’t find a camera on this device. Use a phone or computer with a camera.'
  };
  return <dialog ref={dialog} className="account-modal account-camera" aria-labelledby="camera-title" onClose={onClose} onCancel={onClose}>
    <div className="account-modal-head"><h2 id="camera-title">{title}</h2><button type="button" className="account-close" onClick={onClose} aria-label="Close camera"><CloseIcon /></button></div>
    <div className={`account-camera-frame${isDocument ? ' is-document' : ''}${facing === 'user' ? ' is-mirrored' : ''}`}>
      <video ref={video} playsInline muted aria-hidden="true" />
      {status === 'ready' && <span className="account-camera-guide" aria-hidden="true" />}
      {status !== 'ready' && <p className="account-camera-message" role="status">{messages[status]}</p>}
    </div>
    {liveness && <p className="account-camera-prompt" role="status" aria-live="assertive">{prompt < 0 ? 'Keep your face inside the frame, then start the check.' : LIVENESS_PROMPTS[Math.min(prompt, LIVENESS_PROMPTS.length - 1)]}</p>}
    {liveness && prompt >= 0 && <div className="account-camera-steps" aria-hidden="true">{LIVENESS_PROMPTS.map((_, i) => <span key={i} className={i <= prompt ? 'is-done' : ''} />)}</div>}
    {liveness && <p className="account-camera-note">Preview: the prompts are simulated. The live service runs a certified liveness check and compares your face with your BVN/NIN photo.</p>}
    <div className="account-modal-actions">
      <button type="button" className="account-back" onClick={onClose}>Cancel</button>
      <button type="button" className="account-primary" disabled={status !== 'ready' || prompt >= 0} onClick={() => liveness ? setPrompt(0) : capture()}>
        {liveness ? (prompt >= 0 ? 'Checking…' : 'Start liveness check') : 'Capture'}
      </button>
    </div>
  </dialog>;
}

export const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 3.5l13 13M16.5 3.5l-13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;

/* Step 1 "Photo Taken": live capture with liveness prompts. */
export function LivePhoto() {
  const { setValue, clearErrors } = useFormContext();
  const value = useWatch({ name: 'photo' });
  const error = useFieldError('photo');
  const [camera, setCamera] = useState(false);
  return <div className="account-upload account-upload-portrait">
    <span className="account-label account-upload-title" id="photo-label">Photo Taken</span>
    <div className={`account-drop${value ? ' has-photo' : ''}`}>
      {value ? <Photo value={value} label="Your live photograph" /> : <><CameraIcon /><p>Take a live photo</p></>}
      {!value && <button type="button" id="photo" className={`account-file-button${error ? ' is-invalid' : ''}`} aria-describedby={error ? 'photo-error' : undefined} onClick={() => setCamera(true)}>Take Photo</button>}
    </div>
    {value && <p className="account-liveness-ok" role="status"><CheckIcon /> Liveness check passed</p>}
    {value && <button type="button" id="photo" className="account-change" onClick={() => setCamera(true)}>Retake photo</button>}
    <ErrorText name="photo" error={error} />
    <CameraCapture open={camera} liveness title="Live photo check" onClose={() => setCamera(false)}
      onCapture={photo => { setValue('photo', photo, { shouldDirty: true }); clearErrors('photo'); setCamera(false); }} />
  </div>;
}

const CameraIcon = () => <svg className="account-drop-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" fill="none" stroke="#00577a" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.25" fill="none" stroke="#00577a" strokeWidth="1.5" /></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#669438" /><path d="M4.5 8.2l2.2 2.2 4.8-4.8" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* Document/photo slot. mode: 'both' (browse or camera), 'camera' (camera only). */
export function Upload({ name, label, imageOnly = false, mode = 'both', dropText, maxAge = false, facing = 'environment', samplePreview = true }) {
  const { setValue, setError, clearErrors } = useFormContext();
  const value = useWatch({ name });
  const error = useFieldError(name);
  const input = useRef(), root = useRef();
  const [menu, setMenu] = useState(false);
  const [camera, setCamera] = useState(false);
  useEffect(() => {
    if (!menu) return;
    const close = e => { if (!root.current?.contains(e.target)) setMenu(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [menu]);
  const accept = next => {
    if (maxAge && photoTooOld(next)) {
      setError(name, { type: 'file', message: `Use a photograph taken within the last ${PHOTO_MAX_AGE_DAYS} days.` });
      return;
    }
    setValue(name, next, { shouldDirty: true });
    clearErrors(name);
  };
  const choose = file => {
    if (!file) return;
    const problem = validateFile(file, imageOnly);
    if (problem) { setError(name, { type: 'file', message: problem }); return; }
    accept({ name: file.name, file, source: 'upload', takenAt: file.lastModified });
  };
  const pick = () => mode === 'camera' ? setCamera(true) : setMenu(m => !m);
  const isImage = value && (value.file?.type.startsWith('image/') || (value.demo && imageOnly && samplePreview));
  const buttonText = mode === 'camera' ? 'Take Photo' : 'Browse Files/Take Photo';
  return <div className="account-upload" ref={root}>
    <span className="account-label account-upload-title" id={`${name}-label`}>{label}</span>
    <div className={`account-drop${isImage ? ' has-photo' : ''}`}
      onDragOver={mode === 'camera' ? undefined : e => e.preventDefault()}
      onDrop={mode === 'camera' ? undefined : e => { e.preventDefault(); choose(e.dataTransfer.files[0]); }}>
      {isImage ? <Photo value={value} label={label} /> : <>
        {mode === 'camera' ? <CameraIcon /> : <img className="account-drop-icon" src={uploadIcon} alt="" />}
        <p>{value?.name || dropText || (mode === 'camera' ? 'Take Photograph with Camera' : 'Drag and drop file here')}</p>
      </>}
      {mode !== 'camera' && <input ref={input} type="file" tabIndex={-1} aria-hidden="true" accept={imageOnly ? '.jpg,.jpeg,.png' : '.jpg,.jpeg,.png,.pdf'}
        onChange={e => { choose(e.target.files[0]); e.target.value = ''; }} />}
      {!value && <div className="account-pick">
        <button type="button" id={name} className={`account-file-button${error ? ' is-invalid' : ''}`} aria-haspopup={mode === 'camera' ? 'dialog' : 'menu'} aria-expanded={mode === 'camera' ? undefined : menu}
          aria-labelledby={`${name}-label ${name}`} aria-describedby={error ? `${name}-error` : undefined} onClick={pick}>{buttonText}</button>
        {menu && <PickMenu onBrowse={() => { setMenu(false); input.current.click(); }} onCamera={() => { setMenu(false); setCamera(true); }} onClose={() => setMenu(false)} />}
      </div>}
    </div>
    <span className="account-upload-label" aria-hidden="true">{label}</span>
    {value && <div className="account-pick account-pick-change">
      <button type="button" id={name} className="account-change" aria-label={`Change ${label}`} aria-haspopup={mode === 'camera' ? 'dialog' : 'menu'} onClick={pick}>Change</button>
      {menu && <PickMenu onBrowse={() => { setMenu(false); input.current.click(); }} onCamera={() => { setMenu(false); setCamera(true); }} onClose={() => setMenu(false)} />}
    </div>}
    <ErrorText name={name} error={error} />
    <CameraCapture open={camera} title={label} facing={mode === 'camera' ? 'user' : facing} document={!imageOnly}
      onClose={() => setCamera(false)} onCapture={photo => { accept(photo); setCamera(false); }} />
  </div>;
}

function PickMenu({ onBrowse, onCamera, onClose }) {
  const first = useRef();
  useEffect(() => first.current?.focus(), []);
  const onKey = e => {
    const items = [...e.currentTarget.querySelectorAll('button')];
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i + items.length - 1) % items.length].focus(); }
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };
  return <div className="account-menu-card account-pick-menu" role="menu" onKeyDown={onKey}>
    <button ref={first} type="button" role="menuitem" onClick={onBrowse}>Browse files</button>
    <button type="button" role="menuitem" onClick={onCamera}>Take photo</button>
  </div>;
}

export function Signature() {
  const canvas = useRef();
  const drawing = useRef(false);
  const moved = useRef(false);
  const { setValue, clearErrors } = useFormContext();
  const value = useWatch({ name: 'signature' });
  useEffect(() => {
    const node = canvas.current, ctx = node.getContext('2d');
    ctx.clearRect(0, 0, node.width, node.height);
    if (value?.drawing) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = value.drawing;
    }
  }, [value]);
  function point(e) {
    const rect = canvas.current.getBoundingClientRect();
    return [(e.clientX - rect.left) * 1000 / rect.width, (e.clientY - rect.top) * 180 / rect.height];
  }
  function start(e) {
    drawing.current = true;
    moved.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = canvas.current.getContext('2d');
    ctx.strokeStyle = '#023448';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(...point(e));
  }
  function move(e) {
    if (!drawing.current) return;
    moved.current = true;
    const ctx = canvas.current.getContext('2d');
    ctx.lineTo(...point(e));
    ctx.stroke();
  }
  function stop() {
    if (!drawing.current) return;
    drawing.current = false;
    if (!moved.current) return;
    setValue('signature', { name: 'Drawn signature', drawing: canvas.current.toDataURL('image/png') }, { shouldDirty: true });
    clearErrors('signature');
  }
  return <div className="account-signature">
    <h3>Parent/Guardian Signature</h3>
    <div className="account-signature-pad">
      <p id="signature-pad-help">Sign your signature directly on this webpage using a signature pad.</p>
      <canvas ref={canvas} width="1000" height="180" aria-label="Signature drawing pad" aria-describedby="signature-pad-help"
        onPointerDown={start} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} />
      {value?.drawing && <button type="button" className="account-change account-signature-clear" onClick={() => { setValue('signature', null); canvas.current.getContext('2d').clearRect(0, 0, 1000, 180); }}>Clear</button>}
    </div>
    {!value?.drawing && <Upload name="signature" label="Signature file" imageOnly samplePreview={false} dropText="Drag and drop signature file here" />}
  </div>;
}

export function Otp() {
  const { setValue, formState: { errors } } = useFormContext();
  const value = useWatch({ name: 'otp' }) || '';
  const refs = useRef([]);
  const [sent, setSent] = useState(false);
  const update = (i, next) => {
    const chars = value.padEnd(5, ' ').split('');
    chars[i] = next || ' ';
    setValue('otp', chars.join(''), { shouldDirty: true });
  };
  return <div className="account-otp"><p>Enter OTP</p><div className="account-otp-inputs">{Array.from({ length: 5 }, (_, i) => <input key={i} ref={el => refs.current[i] = el}
    aria-label={`OTP digit ${i + 1}`} aria-invalid={!!errors.otp} inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={1}
    value={value[i]?.trim() || ''}
    onChange={e => { const next = e.target.value.replace(/\D/g, '').slice(-1); update(i, next); if (next) refs.current[i + 1]?.focus(); }}
    onKeyDown={e => { if (e.key === 'Backspace' && !value[i]?.trim()) refs.current[i - 1]?.focus(); }}
    onPaste={e => { e.preventDefault(); const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5); setValue('otp', digits); refs.current[Math.min(digits.length, 4)]?.focus(); }} />)}
  </div>{errors.otp && <p className="account-error" role="alert">{errors.otp.message}</p>}
    <p className="account-hint">Preview code: <strong>64912</strong>. No SMS is sent.</p>
    <button type="button" className="account-text-button" onClick={() => setSent(true)}>Resend OTP</button>{sent && <p role="status">Use 64912 again for this preview.</p>}</div>;
}
