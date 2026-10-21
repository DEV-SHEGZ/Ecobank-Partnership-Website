import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import samplePhoto from '../../images/account/4ac37.png';
import uploadIcon from '../../images/account/f5999.svg';
import { validateFile } from './model';
export const getAt = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
export function Field({
  name,
  label,
  type = 'text',
  placeholder,
  optional = false
}) {
  const {
    register,
    formState: {
      errors
    }
  } = useFormContext();
  const error = getAt(errors, name)?.message;
  return <div className="account-field"><label htmlFor={name}>{label}</label>{Array.isArray(type) ? <select aria-required={!optional} id={name} {...register(name)} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined}><option value="">Select</option>{type.map(option => <option key={option} value={option}>{option}</option>)}</select> : <input id={name} {...register(name)} type={type} placeholder={placeholder} maxLength={type === 'date' ? undefined : 200} inputMode={/bvn|nin/i.test(name) ? 'numeric' : undefined} autoComplete="off" aria-invalid={!!error} aria-required={!optional} aria-describedby={error ? `${name}-error` : undefined} />}
    {error && <span className="account-error" id={`${name}-error`}>{error}</span>}
  </div>;
}
export function Photo({
  value,
  label
}) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!value?.file || !value.file.type.startsWith('image/')) {
      setUrl('');
      return;
    }
    const next = URL.createObjectURL(value.file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [value]);
  const src = value?.demo ? samplePhoto : url;
  return src ? <img className={`account-photo${value?.demo ? ' account-photo-sample' : ''}`} src={src} alt={label} /> : <div className="account-photo-placeholder">{value?.name || 'No photo selected'}</div>;
}
export function Upload({
  name,
  label,
  imageOnly = false,
  portrait = false
}) {
  const {
    setValue,
    setError,
    clearErrors,
    formState: {
      errors
    }
  } = useFormContext();
  const value = useWatch({
    name
  });
  const input = useRef();
  const error = getAt(errors, name)?.message;
  const choose = file => {
    const problem = validateFile(file, imageOnly);
    if (problem) {
      setError(name, {
        type: 'file',
        message: problem
      });
      return;
    }
    setValue(name, {
      name: file.name,
      file
    }, {
      shouldDirty: true
    });
    clearErrors(name);
  };
  return <div className={`account-upload ${portrait ? 'account-upload-portrait' : ''}`}>
    <label htmlFor={name}>{label}</label>
    <div className={`account-drop${portrait && value ? ' has-photo' : ''}`} onDragOver={e => e.preventDefault()} onDrop={e => {
      e.preventDefault();
      choose(e.dataTransfer.files[0]);
    }}>
      {value && ((imageOnly && !value.drawing && !(name === 'signature' && value.demo)) || value.file?.type.startsWith('image/')) ? <Photo value={value} label={label} /> : <><img src={uploadIcon} alt="" /><p>{value?.name || 'Drag and drop file here'}</p></>}
      <input ref={input} id={name} type="file" accept={imageOnly ? '.jpg,.jpeg,.png' : '.jpg,.jpeg,.png,.pdf'} capture={imageOnly ? 'user' : undefined} onChange={e => {
        if (e.target.files[0]) choose(e.target.files[0]);
        e.target.value = '';
      }} aria-invalid={!!error} aria-describedby={`${name}-help${error ? ' ' + name + '-error' : ''}`} />
      {!(portrait && value) && <button type="button" className="account-file-button" onClick={() => input.current.click()}>{value ? 'Change' : 'Browse Files/Take Photo'}</button>}
    </div>
    {portrait && value && <button type="button" className="account-photo-change" onClick={() => input.current.click()}>Change photo</button>}
    <small id={`${name}-help`}>{imageOnly ? 'JPG or PNG' : 'PDF, JPG or PNG'} · Maximum 5 MB{value ? ' · ' + value.name : ''}</small>
    {error && <span className="account-error" id={`${name}-error`}>{error}</span>}
  </div>;
}
export function Signature() {
  const canvas = useRef();
  const drawing = useRef(false);
  const moved = useRef(false);
  const {
    setValue,
    clearErrors
  } = useFormContext();
  const value = useWatch({
    name: 'signature'
  });
  useEffect(() => {
    const node = canvas.current,
      ctx = node.getContext('2d');
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
    setValue('signature', {
      name: 'Drawn signature',
      drawing: canvas.current.toDataURL('image/png')
    }, {
      shouldDirty: true
    });
    clearErrors('signature');
  }
  return <div className="account-signature"><h3>Parent/Guardian Signature</h3><p id="signature-pad-help">Sign your signature directly on this webpage using a signature pad.</p><canvas ref={canvas} width="1000" height="180" aria-label="Signature drawing pad" aria-describedby="signature-pad-help" onPointerDown={start} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} /><button type="button" className="account-text-button" onClick={() => {
      setValue('signature', null);
      canvas.current.getContext('2d').clearRect(0, 0, 1000, 180);
    }}>Clear signature</button><Upload name="signature" label="Or select a signature file" imageOnly /></div>;
}
export function Otp() {
  const {
    setValue,
    formState: {
      errors
    }
  } = useFormContext();
  const value = useWatch({
    name: 'otp'
  }) || '';
  const refs = useRef([]);
  const [sent, setSent] = useState(false);
  const update = (i, next) => {
    const chars = value.padEnd(5, ' ').split('');
    chars[i] = next || ' ';
    setValue('otp', chars.join(''), {
      shouldDirty: true
    });
  };
  return <div className="account-otp"><p>Enter OTP</p><div className="account-otp-inputs">{Array.from({
        length: 5
      }, (_, i) => <input key={i} ref={el => refs.current[i] = el} aria-label={`OTP digit ${i + 1}`} aria-invalid={!!errors.otp} inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={1} value={value[i]?.trim() || ''} onChange={e => {
        const next = e.target.value.replace(/\D/g, '').slice(-1);
        update(i, next);
        if (next) refs.current[i + 1]?.focus();
      }} onKeyDown={e => {
        if (e.key === 'Backspace' && !value[i]?.trim()) refs.current[i - 1]?.focus();
      }} onPaste={e => {
        e.preventDefault();
        const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
        setValue('otp', digits);
        refs.current[Math.min(digits.length, 4)]?.focus();
      }} />)}</div>{errors.otp && <p className="account-error" role="alert">{errors.otp.message}</p>}<p className="account-hint">Preview code: <strong>64912</strong>. No SMS is sent.</p><button type="button" className="account-text-button" onClick={() => setSent(true)}>Resend OTP</button>{sent && <p role="status">Use 64912 again for this preview.</p>}</div>;
}
