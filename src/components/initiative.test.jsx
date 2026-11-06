import { render, screen } from "@testing-library/react";
import Initiative from "./initiative";

test("links to the supplied statement and removes the help widget", () => {
  render(<Initiative />);

  const statement = screen.getByRole("link", { name: "Read Official Statement" });
  expect(statement).toHaveAttribute("href", "https://punchng.com/ecobank-partners-firm-on-digital-training-for-students/?utm_source=rss.punchng.com&utm_medium=web");
  expect(statement).toHaveAttribute("target", "_blank");
  expect(statement).toHaveAttribute("rel", "noopener noreferrer");
  expect(screen.queryByText("How can we help you today?")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /help prompt/i })).not.toBeInTheDocument();
});
