import { useEffect, useRef } from 'react';
import { CloseIcon } from './Fields';
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
