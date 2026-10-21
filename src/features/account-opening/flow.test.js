import { render, screen, fireEvent, act } from '@testing-library/react';
import AccountOpening from './AccountOpening';

jest.mock('react-router-dom', () => ({ Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a> }), { virtual: false });

beforeAll(() => {
  global.ResizeObserver = class { observe() {} disconnect() {} };
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
});

test('sample details fill the identity step', async () => {
  render(<AccountOpening />);
  await act(async () => { fireEvent.click(screen.getByText('Use sample details')); });
  expect(screen.getByLabelText('Parent’s Bank Verification Number (BVN)')).toHaveValue('00000000000');
});
