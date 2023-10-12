import * as React from "react";
import { styled } from "@mui/material/styles";
import { union, intersection } from "lodash";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

import { useTranslation } from "react-i18next";
import { useCopyToClipboard } from "usehooks-ts";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface PlaylistProps {
  color: {
    red: number;
    green: number;
    blue: number;
  };
  songs: Array<Song>;
}

const Playlist = (props: PlaylistProps) => {
  const { t } = useTranslation();

  const { red, green, blue } = props.color;
  const luma = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: `rgba(${red}, ${green}, ${blue}, 0.7)`,
      color:
        luma > 0.5 ? theme.palette.common.black : theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const [_value, copy] = useCopyToClipboard();

  const onClick = (_index: number, row: Song) => {
    console.log(`点歌 ${row.title}`);
    copy(`点歌 ${row.title}`).then(() => {
      alert(`歌曲 "${row.title}" 已复制到剪切板`);
    });
  };

  const [genres, setGenres] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof genres>) => {
    const {
      target: { value },
    } = event;
    setGenres(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [title, setTitle] = React.useState<string>("");

  const allGenres: string[] = union(
    ...props.songs.map((song) => song.genre || [])
  );

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item>
            <TextField
              id="outlined-search"
              label="Search title"
              type="search"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {t("song.genre")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                multiple
                value={genres}
                label={t("song.genre")}
                onChange={handleChange}
              >
                {allGenres.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Item>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>{t("song.title")} </StyledTableCell>
              <StyledTableCell align="left">{t("song.genre")}</StyledTableCell>
              <StyledTableCell align="center">
                {t("song.artist")}
              </StyledTableCell>
              <StyledTableCell align="right">{t("song.lang")}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.songs
              .filter((s) => (title ? s.title.indexOf(title) !== -1 : true))
              .filter((s) =>
                genres.length > 0
                  ? intersection(genres, s.genre || []).length > 0
                  : true
              )
              .map((row, index) => (
                <StyledTableRow
                  key={row.title}
                  onClick={() => onClick(index, row)}
                >
                  <StyledTableCell component="th" scope="row">
                    {row.title}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {(row.genre || []).map((tag, i) => (
                      <Chip key={`${index}-${i}`} label={tag} />
                    ))}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.artist || "-"}
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    {row.lang || "-"}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Playlist;
