import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AccountOpening from './features/account-opening/AccountOpening';

jest.mock('react-router-dom', () => ({Link: ({to, children, ...props}) => <a href={to} {...props}>{children}</a>}));
beforeEach(() => {
  window.scrollTo = jest.fn();
  window.ResizeObserver = class { observe() {} disconnect() {} };
  Element.prototype.scrollIntoView = jest.fn();
  Element.prototype.scrollTo = jest.fn();
  // jsdom has <dialog> but no showModal/close; mirror the browser's open attribute.
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({clearRect: jest.fn()}));
});
test('completes the nine-step preview, retains edits, and gates results behind the terms', async () => {
  render(<AccountOpening />);
  const advance = async (name, nextStep) => {
    fireEvent.click(screen.getByRole('button', {name, exact:true}));
    await waitFor(() => expect(screen.getByText(new RegExp(`Step ${nextStep} of 9`))).toBeInTheDocument());
  };
  fireEvent.click(screen.getByRole('button', {name:'Use sample details'}));
  await advance('Submit',2);
  '64912'.split('').forEach((digit,i) => fireEvent.change(screen.getByLabelText(`OTP digit ${i+1}`),{target:{value:digit}}));
  await advance('Confirm OTP',3);
  fireEvent.change(screen.getByLabelText('Parent/Guardian Name'),{target:{value:'Example Parent'}});
  await advance('Submit Form',4);
  await advance('Continue',5);
  await advance('Submit Form',6);
  await advance('Submit Form',7);
  expect(screen.getByText('Example Parent')).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole('button',{name:'Edit Info'})[0]);
  expect(screen.getByLabelText('Parent/Guardian Name')).toHaveValue('Example Parent');
  await advance('Save and return to review',7);
  // Review opens the Terms & Conditions dialog; accepting it shows the account numbers (step 8).
  fireEvent.click(screen.getByRole('button', {name:'Continue Account Opening'}));
  await waitFor(() => expect(screen.getByText('Thanks for reading. You can now accept.')).toBeInTheDocument());
  await advance('I agree to the terms & conditions',8);
  expect(screen.getByText('Demo results only — no bank accounts were created.')).toBeInTheDocument();
  expect(document.querySelector('.account-result p').textContent).toMatch(/^\d{10}$/);
  await advance('Fund Account Now',9);
  expect(screen.getByRole('button', {name:'Fund Account'})).toBeInTheDocument();
});
