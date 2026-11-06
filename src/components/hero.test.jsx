import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Hero from "./hero";

jest.mock("swiper/react", () => ({
  Swiper: ({ children }) => <div>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>,
}), { virtual: true });
jest.mock("swiper/modules", () => ({ Autoplay: {} }), { virtual: true });
jest.mock("swiper/css", () => ({}), { virtual: true });

test("links the banner to the available page sections", () => {
  render(<Hero />);

  expect(screen.getByRole("link", { name: "Claim Now" })).toHaveAttribute("href", "#enrol");
  expect(screen.getByRole("link", { name: "See Teachers Profile" })).toHaveAttribute("href", "#teachers");
});

test("opens both Junior Savers links in a new tab", () => {
  render(<Hero />);

  for (const name of ["Open a Junior Savers Account", "Open Now"]) {
    const link = screen.getByRole("link", { name });
    expect(link).toHaveAttribute("href", "/open-account");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

test("focuses the account-number field when the banner claim link is selected", async () => {
  render(<Hero />);

  fireEvent.click(screen.getByRole("link", { name: "Claim Now" }));
  await waitFor(() => expect(screen.getByLabelText("Junior Savers account number")).toHaveFocus());
});
