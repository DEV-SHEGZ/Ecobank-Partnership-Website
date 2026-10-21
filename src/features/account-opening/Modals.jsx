import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './Fields';
import terms from './terms.json';
import boy from '../../images/account/tile-boy.svg';
import blocks from '../../images/account/tile-blocks.svg';

function useDialog(open) {
  const ref = useRef();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal?.();
    if (!open && node.open) node.close();
  }, [open]);
  return ref;
}

export function TermsModal({ open, onClose, onAgree }) {
  const ref = useDialog(open);
  const body = useRef();
  const [read, setRead] = useState(false);
  useEffect(() => { if (open) { setRead(false); body.current?.scrollTo(0, 0); } }, [open]);
  const check = () => {
    const el = body.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setRead(true);
  };
  useEffect(() => { if (open) requestAnimationFrame(check); }, [open]);
  return <dialog ref={ref} className="account-modal account-terms-modal" aria-labelledby="terms-title" onClose={onClose} onCancel={onClose}>
    <div className="account-terms-heading">
      <h2 id="terms-title">Terms &amp; Conditions</h2>
      <button type="button" className="account-close" onClick={onClose} aria-label="Close terms and return to review"><CloseIcon /></button>
    </div>
    <div className="account-terms" ref={body} onScroll={check} tabIndex={0} aria-label="Terms and conditions text">
      <p className="account-hint">Preview only: the design contains placeholder terms below. Agreeing does not create an agreement or open a real account.</p>
      {terms.map((text, i) => text === 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' ? <h3 key={i}>{text}</h3> : <p key={i}>{text}</p>)}
    </div>
    <div className="account-modal-actions">
      <p className="account-terms-status" role="status">{read ? 'Thanks for reading. You can now accept.' : 'Scroll to the end of the terms to accept.'}</p>
      <button type="button" className="account-primary" disabled={!read} onClick={onAgree}>I agree to the terms &amp; conditions</button>
    </div>
  </dialog>;
}

const BENEFITS = [
  'Enjoy an additional 1% p.a. interest to help your child’s savings grow faster.',
  'Milestone celebration gifts at ages 1, 5, 10, and 15.',
  'Access to free e-coding platform to build digital skills.',
  'Debit card access for controlled spending.',
  'Monthly debit transaction limit of ₦10,000,000.',
  'Education protection cover (when parents subscribe to life insurance).'
];

export function BenefitsModal({ open, onClose, onStart }) {
  const ref = useDialog(open);
  return <dialog ref={ref} className="account-modal account-benefits" aria-labelledby="benefits-title" onClose={onClose} onCancel={onClose}>
    <button type="button" className="account-close account-benefits-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
    <div className="account-benefits-lead">
      <h2 id="benefits-title">You can also set up a standing order from your account to fund your child’s account regularly, making saving easy and consistent.</h2>
      <button type="button" className="account-benefits-start" onClick={onStart}>Get Started Now</button>
    </div>
    <div className="account-benefits-list">
      <h3>More Benefits of MyFirst Account</h3>
      <ol>{BENEFITS.map((text, i) => <li key={i}><span>{String(i + 1).padStart(2, '0')}</span>{text}</li>)}</ol>
    </div>
    <img className="account-benefits-boy" src={boy} width="577" height="372" alt="" />
    <img className="account-benefits-blocks" src={blocks} width="693" height="93" alt="" />
  </dialog>;
}
