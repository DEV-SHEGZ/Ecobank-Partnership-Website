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

test("hides the sticky claim bar at the journey and restores it when scrolling back up", async () => {
  const { container } = render(<><Hero /><div id="journey">The Journey</div></>);
  const hero = container.querySelector(".hero-home");
  const bar = container.querySelector(".claim-section");
  const journey = container.querySelector("#journey");
  let heroBottom = -200;
  let journeyTop = window.innerHeight + 100;

  jest.spyOn(hero, "getBoundingClientRect").mockImplementation(() => ({ bottom: heroBottom }));
  jest.spyOn(journey, "getBoundingClientRect").mockImplementation(() => ({ top: journeyTop }));

  fireEvent.scroll(window);
  await waitFor(() => expect(bar).toHaveClass("claim-section--pinned"));

  journeyTop = window.innerHeight - 1;
  fireEvent.scroll(window);
  await waitFor(() => expect(bar).not.toHaveClass("claim-section--pinned"));

  journeyTop = -800;
  fireEvent.scroll(window);
  await waitFor(() => expect(bar).not.toHaveClass("claim-section--leaving"));

  journeyTop = window.innerHeight + 100;
  fireEvent.scroll(window);
  await waitFor(() => expect(bar).toHaveClass("claim-section--pinned"));

  heroBottom = 0;
  fireEvent.scroll(window);
  await waitFor(() => expect(bar).not.toHaveClass("claim-section--pinned"));
});

test("lets a visitor reopen and close the claim bar after it has been hidden", async () => {
  const { container } = render(<><Hero /><div id="journey">The Journey</div></>);
  const hero = container.querySelector(".hero-home");
  const bar = container.querySelector(".claim-section");
  const journey = container.querySelector("#journey");

  jest.spyOn(hero, "getBoundingClientRect").mockReturnValue({ bottom: -200 });
  jest.spyOn(journey, "getBoundingClientRect").mockReturnValue({ top: -200 });
  fireEvent.scroll(window);

  fireEvent.click(screen.getByRole("link", { name: "Claim Now" }));
  await waitFor(() => expect(screen.getByLabelText("Junior Savers account number")).toHaveFocus());
  expect(bar).toHaveClass("claim-section--claim-active");

  fireEvent.click(screen.getByRole("button", { name: "Close account number bar" }));
  expect(bar).not.toHaveClass("claim-section--claim-active");
});
