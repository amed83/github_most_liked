import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { FC } from "react";
import { RepoProps } from "../Dashboard/Dashboard";
import { Box } from "@mui/material";

const RepoCard: FC<RepoProps> = ({
  id,
  name,
  link,
  description,
  stars,
  addToFavourite,
  isFavourite,
}) => {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">{name}</Typography>
          <Box
            style={{ padding: "1rem", display: "flex", alignItems: "center" }}
          >
            <StarIcon /> {stars}
          </Box>
          <IconButton onClick={() => addToFavourite(id)}>
            <FavoriteIcon sx={{ color: isFavourite ? "red" : "primary" }} />
          </IconButton>
        </Box>
        {description && (
          <Typography variant="subtitle1"> ({description})</Typography>
        )}

        <Link href={link} target="_blank">
          {link}
        </Link>
      </CardContent>
    </Card>
  );
};

export default RepoCard;
