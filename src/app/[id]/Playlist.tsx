"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { Song } from "@/types";

interface PlaylistProps {
  data: Array<Song>;
  isLoading: boolean;
}

const columns = [
  { key: "title", label: "Title" },
  { key: "genre", label: "Genre" },
  { key: "artist", label: "Artist" },
  { key: "lang", label: "Language" },
];

export default function App(props: PlaylistProps) {
  const data = props.data.map((item, index) => ({ ...item, key: index }));

  console.log(data);

  return (
    <Table aria-label="Example static collection table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody isLoading={props.isLoading} items={data}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
