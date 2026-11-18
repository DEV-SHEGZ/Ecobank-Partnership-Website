import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import AccountOpening from './AccountOpening';

jest.mock('react-router-dom', () => ({ Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a> }), { virtual: false });
jest.mock('./AddressMap', () => () => <div>Address map preview</div>);

beforeAll(() => {
  global.ResizeObserver = class { observe() {} disconnect() {} };
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
  Element.prototype.scrollTo = () => {};
  HTMLCanvasElement.prototype.getContext = () => ({ clearRect() {} });
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});

async function openParentDetails() {
  render(<AccountOpening />);
  await act(async () => { fireEvent.click(screen.getByText('Use sample details')); });
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  for (const [index, digit] of [...'64912'].entries()) {
    fireEvent.change(screen.getByLabelText(`OTP digit ${index + 1}`), { target: { value: digit } });
  }
  fireEvent.click(screen.getByRole('button', { name: 'Confirm OTP' }));
}

function choose(label, option) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(label) }));
  fireEvent.click(screen.getByRole('option', { name: option }));
}

test('sample details fill the identity step', async () => {
  render(<AccountOpening />);
  await act(async () => { fireEvent.click(screen.getByText('Use sample details')); });
  expect(screen.getByLabelText('Parent’s Bank Verification Number (BVN)')).toHaveValue('00000000000');
});

test('parent details show the PEP question first and require an explanation for another source of funds', async () => {
  await openParentDetails();
  const tin = screen.getByLabelText('Taxpayer Identification Number (TIN)');
  expect(tin).toHaveAttribute('maxlength', '13');
  expect(screen.getByRole('link', { name: 'Retrieve and Verify Your Tax ID' })).toHaveAttribute('href', 'https://taxid.jrb.gov.ng/');
  const question = screen.getByText(/Have you or a member of your nuclear family/);
  const pep = screen.getByRole('button', { name: /Politically Exposed Person/ });
  expect(question.compareDocumentPosition(pep) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

  choose('Source of Funds', 'Others');
  expect(screen.getByLabelText('Please specify your source of funds')).toBeInTheDocument();
  fireEvent.change(tin, { target: { value: '123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }));
  expect(screen.getByText('Enter exactly 13 digits.')).toBeInTheDocument();
  expect(screen.getByLabelText('Please specify your source of funds')).toHaveAttribute('aria-invalid', 'true');

  choose('Source of Funds', 'Salary');
  expect(screen.queryByLabelText('Please specify your source of funds')).not.toBeInTheDocument();
});

test('terms are a separate step and must be reached before the preview can continue', async () => {
  const bounds = jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top: window.innerHeight + 100 });
  try {
    await openParentDetails();
    fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue Account Opening' }));

    expect(screen.getByText(/Step 8 of 10/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Terms & Conditions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'I agree to the terms & conditions' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Close terms and return to review' }));
    expect(screen.getByText(/Step 7 of 10/)).toBeInTheDocument();
    expect(screen.getByText('Joshua Adeola Sanusi')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Continue Account Opening' }));
    expect(screen.getByRole('button', { name: 'I agree to the terms & conditions' })).toBeDisabled();

    bounds.mockReturnValue({ top: 0 });
    fireEvent.scroll(window);
    expect(screen.getByRole('button', { name: 'I agree to the terms & conditions' })).toBeEnabled();
  } finally {
    bounds.mockRestore();
  }
});

test('funding uses one shared type and debit account with a separate amount for each child', async () => {
  await openParentDetails();
  fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }));
  choose('How many children', '2');
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }));
  fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }));
  fireEvent.click(screen.getByRole('button', { name: 'Continue Account Opening' }));
  const agree = await screen.findByRole('button', { name: 'I agree to the terms & conditions' });
  await waitFor(() => expect(agree).toBeEnabled());
  fireEvent.click(agree);
  const accountNumbers = screen.getAllByText(/^01\d{8}$/).map(element => element.textContent);
  expect(accountNumbers).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', { name: 'Fund Account Now' }));

  expect(screen.getAllByRole('button', { name: /Funding Type/ })).toHaveLength(1);
  expect(screen.getAllByLabelText(/Ecobank Account to Be Debited/)).toHaveLength(1);
  accountNumbers.forEach(number => expect(screen.getByText(number)).toBeVisible());
  choose('Funding Type', 'Recurring Payment');
  expect(screen.getAllByRole('button', { name: /Frequency/ })).toHaveLength(1);
  fireEvent.change(screen.getByLabelText(/Ecobank Account to Be Debited/), { target: { value: '0123456789' } });
  choose('Frequency', 'Monthly');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const start = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: start } });
  fireEvent.change(screen.getByLabelText('Amount per Payment for Joshua Sanusi (₦)'), { target: { value: '50000' } });
  fireEvent.change(screen.getByLabelText('Amount per Payment for Shade Sanusi (₦)'), { target: { value: '10000' } });
  fireEvent.click(screen.getByRole('checkbox', { name: /I authorise Ecobank/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Fund Account' }));
  expect(screen.getByRole('heading', { name: 'Funding instructions received' })).toBeInTheDocument();
  expect(screen.getByText(/₦50,000 monthly standing order/)).toBeInTheDocument();
  expect(screen.getByText(/₦10,000 monthly standing order/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Edit funding' }));
  choose('Funding Type', 'One-Time Payment');
  expect(screen.queryByRole('button', { name: /Frequency/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Fund Account' }));
  fireEvent.click(screen.getByRole('button', { name: 'Get Started Now' }));
  expect(screen.getByRole('button', { name: /Funding Type Recurring Payment/ })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Frequency/ })).toHaveLength(1);
  expect(screen.getByLabelText('Amount per Payment for Joshua Sanusi (₦)')).toHaveValue('50000');
  expect(screen.getByLabelText('Amount per Payment for Shade Sanusi (₦)')).toHaveValue('10000');
});
