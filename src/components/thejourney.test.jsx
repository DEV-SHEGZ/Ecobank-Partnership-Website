import { fireEvent, render, screen, within } from "@testing-library/react";
import TheJourney from "./thejourney";

beforeEach(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

function simulate(age, name, gender) {
  fireEvent.change(screen.getByLabelText("Select Your Child’s Age Range"), { target: { value: age } });
  fireEvent.change(screen.getByLabelText("Enter Your Child’s First Name"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("Select Your Child’s Gender"), { target: { value: gender } });
  fireEvent.click(screen.getByRole("button", { name: "Simulate Now" }));
}

test("shows the three-year plan, navigates between years, and downloads the selected plan", () => {
  render(<TheJourney />);
  simulate("7 - 13 years", "Sarah", "Female");

  const result = screen.getByRole("region", { name: "Sarah’s learning plan" });
  expect(within(result).getByRole("heading", { name: "Sarah’s First Year" })).toBeInTheDocument();
  expect(within(result).getByText(/three \(3\) workbooks/)).toBeInTheDocument();
  expect(within(result).getByRole("heading", { name: "She will master:" })).toBeInTheDocument();
  expect(within(result).getByRole("button", { name: "Previous year" })).toBeDisabled();

  fireEvent.click(within(result).getByRole("button", { name: "Next year" }));
  expect(within(result).getByRole("heading", { name: "Sarah’s Second Year" })).toBeInTheDocument();
  expect(within(result).getByRole("heading", { name: "Interface Design and Analysis" })).toBeInTheDocument();

  fireEvent.click(within(result).getByRole("button", { name: "Next year" }));
  expect(within(result).getByRole("heading", { name: "Sarah’s Third Year" })).toBeInTheDocument();
  expect(within(result).getByRole("button", { name: "Next year" })).toBeDisabled();
  fireEvent.click(within(result).getByRole("button", { name: "Previous year" }));
  expect(within(result).getByRole("heading", { name: "Sarah’s Second Year" })).toBeInTheDocument();

  const download = within(result).getByRole("link", { name: "Download Learning Plan" });
  expect(download).toHaveAttribute("download", "learning-plan.txt");
  expect(decodeURIComponent(download.getAttribute("href"))).toContain("Sarah’s learning journey");
  expect(decodeURIComponent(download.getAttribute("href"))).toContain("Age range: 7 - 13 years");
});

test("starts the younger learner’s four-year plan with the engineering workbooks", () => {
  render(<TheJourney />);
  simulate("5 - 6 years", "Andrew", "Male");

  const result = screen.getByRole("region", { name: "Andrew’s learning plan" });
  expect(within(result).getByRole("heading", { name: "Andrew’s First Year" })).toBeInTheDocument();
  expect(within(result).getByText(/six \(6\) workbooks/)).toBeInTheDocument();
  expect(within(result).getByRole("heading", { name: "Engineering Thinking Book 1" })).toBeInTheDocument();
  expect(within(result).getByRole("heading", { name: "Engineering Thinking Book 2" })).toBeInTheDocument();
  expect(within(result).getByRole("heading", { name: "Engineering Thinking Book 3" })).toBeInTheDocument();

  fireEvent.click(within(result).getByRole("button", { name: "Next year" }));
  expect(within(result).getByRole("heading", { name: "Andrew’s Second Year" })).toBeInTheDocument();
  expect(within(result).getByRole("heading", { name: "HTML and the Web" })).toBeInTheDocument();
});
