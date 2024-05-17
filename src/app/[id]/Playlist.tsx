"use client";
import { useState, useMemo, useCallback, useEffect, Fragment } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Selection,
  getKeyValue,
} from "@nextui-org/table";
import { Spacer } from "@nextui-org/spacer";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import SearchIcon from "./SearchIcon";
import { useCopyToClipboard } from "usehooks-ts";
import { Song } from "@/types";

interface PlaylistProps {
  data: Array<Song>;
  isLoading: boolean;
}

interface Option<T> {
  key: string | number;
  label: T;
}

const columns = [
  { key: "title", label: "Title" },
  { key: "genre", label: "Genre" },
  { key: "artist", label: "Artist" },
  { key: "lang", label: "Language" },
];

export default function App(props: PlaylistProps) {
  const data = useMemo(
    () => props.data.map((item, index) => ({ ...item, key: index })),
    [props.data]
  );

  const [_, copy] = useCopyToClipboard();

  const [filterValue, setFilterValue] = useState("");
  const [genreOptions, setGenreOptions] = useState<Array<Option<string>>>([]);
  const [genreFilter, setGenreFilter] = useState<Selection>("all");

  const hasSearchFilter = Boolean(filterValue);

  useEffect(() => {
    // every item on data has a genre array, merge all and unique
    const options = data
      .map((item) => item.genre)
      .flat()
      .filter((v, i, a) => a.indexOf(v) === i)
      .map((item, index) => ({
        key: index,
        label: item,
      }));
    setGenreOptions(options);
  }, [data]);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const filteredData = useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.title.includes(filterValue)
      );
    }

    if (
      genreFilter !== "all" &&
      Array.from(genreFilter).length !== genreOptions.length
    ) {
      // Array.from(genreFilter) got an array of keys, example ["0", "1"]
      // genreOptions is an array of genre, example [{key: 0, label: "Pop"}]
      //
      // select filterData where genre is in genreOptions
      filteredData = filteredData.filter((item) => {
        const selectedGenres = Array.from(genreFilter).map((key) =>
          genreOptions.find((option) => option.key + "" === key)
        );

        return selectedGenres.some((genre) =>
          item.genre.includes(genre?.label || "")
        );
      });
    }
    return filteredData;
  }, [data, genreFilter, filterValue, hasSearchFilter, genreOptions]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            value={filterValue}
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button>Genre</Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={genreFilter}
                selectionMode="multiple"
                onSelectionChange={setGenreFilter}
                items={genreOptions}
              >
                {(item) => (
                  <DropdownItem key={item.key} className="capitalize">
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    hasSearchFilter,
    genreFilter,
    genreOptions,
    onClear,
  ]);

  return (
    <Table
      topContent={topContent}
      onRowAction={(key) => {
        const item = data[key as number];
        copy(`点歌 ${item.title}`).then(() => {
          alert(`歌曲 "${item.title}" 已复制到剪切板`);
        });
      }}
      aria-label="Example static collection table"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody isLoading={props.isLoading} items={filteredData}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell key={`${item.key}-${columnKey}`}>
                {columnKey === "genre" ? (
                  <div>
                    {getKeyValue(item, columnKey).map(
                      (i: string, index: number) => (
                        <Fragment key={`${item.key}-${columnKey}-${index}`}>
                          <Chip style={{ margin: "0.2rem" }}>{i}</Chip>
                        </Fragment>
                      )
                    )}
                  </div>
                ) : (
                  getKeyValue(item, columnKey)
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
