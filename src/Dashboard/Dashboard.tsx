import { useEffect, useState } from "react";
import RepoCard from "../RepoCard/RepoCard";
import getLastWeekDate from "../utils/getLastWeek";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Box, Container, Typography } from "@mui/material";

export interface RepoProps {
  id: number;
  name: string;
  link: string;
  description?: string;
  stars: number;
  isFavourite?: boolean;
  addToFavourite: (id: number) => void;
}

const Dashboard = () => {
  const [repoData, setRepoData] = useState<RepoProps[]>([]);
  const [showingFiltered, setShowingFiltered] = useState<boolean>(false);
  const [hasErrorFetchingData, setHasErrorFetchingData] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFavourite, setHasFavourite] = useState<boolean>(false);

  const addToFavourite = (id: number) => {
    const repoWithFavourites = repoData.map((repo) => {
      if (repo.id === id) {
        return {
          ...repo,
          isFavourite: !repo.isFavourite,
        };
      }
      return repo;
    });

    const filteredFavourites = repoWithFavourites.filter(
      (repo) => repo.isFavourite
    );

    setHasFavourite(filteredFavourites.length > 0);
    localStorage.setItem("favRepo", JSON.stringify(filteredFavourites));
    setRepoData(repoWithFavourites);
  };

  useEffect(() => {
    const getData = async () => {
      const url = `https://api.github.com/search/repositories?q=created:%3E${getLastWeekDate()}&sort=stars&order=desc`;
      setIsLoading(true);
      try {
        const response = await fetch(url);
        const data = await response.json();
        const storedFavourites = localStorage.getItem("favRepo");
        const hasFavourite = storedFavourites && JSON.parse(storedFavourites);
        if (hasFavourite && hasFavourite.length > 0) {
          setHasFavourite(true);
        }

        const reposData: RepoProps[] = data.items.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          link: repo.html_url,
          stars: repo.stargazers_count,
          isFavourite:
            hasFavourite &&
            hasFavourite.some((el: RepoProps) => el.id === repo.id),
        }));
        setRepoData(reposData);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        setHasErrorFetchingData(true);
      }
    };
    getData();
  }, []);

  if (isLoading) {
    return (
      <Container sx={{ marginTop: "2rem" }}>
        <Box>
          <Typography variant="h4">...Loading</Typography>
        </Box>
      </Container>
    );
  }

  if (!isLoading && hasErrorFetchingData) {
    return (
      <Container sx={{ marginTop: "2rem" }}>
        <Box>
          <Typography variant="h4">
            Sorry, there was an Error, Please reloa
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: "2rem" }}>
      <FormControlLabel
        control={
          <Checkbox
            disabled={!hasFavourite}
            onChange={() => setShowingFiltered(!showingFiltered)}
          />
        }
        label="Show Favourites"
      />
      {repoData
        .filter((repo) =>
          showingFiltered && hasFavourite ? repo.isFavourite : repo
        )
        .map((repo) => (
          <RepoCard
            key={repo.id}
            name={repo.name}
            description={repo.description}
            link={repo.link}
            stars={repo.stars}
            id={repo.id}
            addToFavourite={addToFavourite}
            isFavourite={repo.isFavourite}
          />
        ))}
    </Container>
  );
};

export default Dashboard;
