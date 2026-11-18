import { useEffect, useRef } from 'react';
import { CloseIcon } from './Fields';
import terms from './terms.json';

export default function TermsPage({ headingRef, onBack, read, onRead }) {
  const end = useRef();

  useEffect(() => {
    const checkEnd = () => {
      if (end.current && end.current.getBoundingClientRect().top <= window.innerHeight) onRead(true);
    };
    const frame = requestAnimationFrame(checkEnd);
    window.addEventListener('scroll', checkEnd, { passive: true });
    window.addEventListener('resize', checkEnd);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', checkEnd);
      window.removeEventListener('resize', checkEnd);
    };
  }, [onRead]);

  return <div className="account-terms-page">
    <div className="account-terms-heading">
      <h1 id="account-title" ref={headingRef} tabIndex={-1}>Terms &amp; Conditions</h1>
      <button type="button" className="account-close" onClick={onBack} aria-label="Close terms and return to review"><CloseIcon /></button>
    </div>
    <div className="account-terms" aria-label="Terms and conditions text">
      <p className="account-hint">Preview only: the design contains placeholder terms below. Agreeing does not create an agreement or open a real account.</p>
      {terms.map((text, i) => text === 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' ? <h2 key={i}>{text}</h2> : <p key={i}>{text}</p>)}
    </div>
    <div ref={end} aria-hidden="true" />
    <p className="account-terms-status" role="status">{read ? 'Thanks for reading. You can now accept.' : 'Scroll to the end of the terms to accept.'}</p>
    <div className="account-actions">
      <button type="submit" className="account-primary" disabled={!read}>I agree to the terms &amp; conditions</button>
    </div>
  </div>;
}
