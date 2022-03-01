import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockGET } from "../utils/test/mockServer";
import Dashboard from "./Dashboard";

const mockGetRepoData = (data: any) =>
  mockGET("https://api.github.com/search/repositories", (req, res, ctx) =>
    res(ctx.json(data))
  );

describe("Dashboard", () => {
  beforeEach(() => {
    mockGetRepoData({
      items: [
        {
          id: 1,
          name: "repo title",
          link: "some url",
          description: "some description",
          stars: 1,
        },
        {
          id: 2,
          name: "repo title_2",
          link: "some url",
          description: "some description",
          stars: 1,
        },
      ],
    });
  });

  it("should render list of repos", async () => {
    render(<Dashboard />);
    expect(await screen.findByText("repo title")).toBeInTheDocument();
    expect(await screen.findByText("repo title_2")).toBeInTheDocument();
  });

  it("each repo should have a favourite icon", async () => {
    render(<Dashboard />);
    const favIcons = await screen.findAllByTestId("FavoriteIcon");
    expect(favIcons.length).toBe(2);
  });

  it("should render a checkbox to filter favourites repos", async () => {
    render(<Dashboard />);

    expect(
      await screen.findByTestId("CheckBoxOutlineBlankIcon")
    ).toBeInTheDocument();
  });

  it("should render just the favourites repos when the filter is selected", async () => {
    render(<Dashboard />);
    const favIcons = await screen.findAllByTestId("FavoriteIcon");
    const filter = await screen.findByTestId("CheckBoxOutlineBlankIcon");
    expect(await screen.findByText("repo title_2")).toBeInTheDocument();
    userEvent.click(favIcons[0]);
    userEvent.click(filter);
    expect(screen.queryByTestId("repo title_2")).not.toBeInTheDocument();
  });
});
