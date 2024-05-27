"use client";
import { useState, useMemo, useCallback, Fragment } from "react";
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
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Pagination } from "@nextui-org/pagination";
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
  actions?: string[];
}

export default function App(props: PlaylistProps) {
  const columns = [
    { key: "title", label: "Title" },
    { key: "genre", label: "Genre" },
    { key: "artist", label: "Artist" },
    { key: "lang", label: "Language" },
  ];

  if (props.actions) {
    columns.push({ key: "actions", label: "Actions" });
  }

  const [_, copy] = useCopyToClipboard();

  const [filterValue, setFilterValue] = useState("");
  const [genreFilter, setGenreFilter] = useState<Selection>("all");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(25);

  const hasSearchFilter = Boolean(filterValue);

  const genreOptions = useMemo(() => {
    return props.data
      .map((item) => item.genre)
      .flat()
      .filter((v, i, a) => a.indexOf(v) === i)
      .map((item) => ({
        key: item.id,
        label: item.name,
      }));
  }, [props.data]);

  const onRowChange = useCallback((val: number) => {
    setRowPerPage(val);
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const filteredData = useMemo(() => {
    let filteredData = [...props.data];

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
          item.genre.map((i) => i.name).includes(genre?.label || "")
        );
      });
    }

    return filteredData;
  }, [props.data, genreFilter, filterValue, hasSearchFilter, genreOptions]);

  const items = useMemo(() => {
    const start = (page - 1) * rowPerPage;
    const end = start + rowPerPage;
    return filteredData.slice(start, end);
  }, [page, rowPerPage, filteredData]);

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
            <Button
              onClick={() => {
                const randomIndex = Math.floor(
                  Math.random() * filteredData.length
                );
                copy(`点歌 ${filteredData[randomIndex].title}`).then(() => {
                  alert(
                    `歌曲 "${filteredData[randomIndex].title}" 已复制到剪切板`
                  );
                });
              }}
            >
              Random In
              <p>{filteredData.length} Items</p>
            </Button>
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
    genreFilter,
    genreOptions,
    onClear,
    filteredData,
    copy,
  ]);

  const buttomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          siblings={1}
          boundaries={2}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={Math.ceil(filteredData.length / rowPerPage)}
          variant="light"
          onChange={setPage}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button>{rowPerPage} per page</Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={new Set([rowPerPage])}
            onSelectionChange={(keys) => {
              let numbers = Array.from(keys as Set<number>);
              onRowChange(numbers[0]);
            }}
            items={[10, 25, 50, 100].map((item) => ({
              key: item,
              label: item,
            }))}
          >
            {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
          </DropdownMenu>
        </Dropdown>
        <span className="text-small text-default-400">
          {genreFilter === "all"
            ? "All items selected"
            : `${genreFilter.size} of ${props.data.length} selected`}
        </span>
      </div>
    );
  }, [
    props.data.length,
    page,
    rowPerPage,
    filteredData.length,
    hasSearchFilter,
    genreFilter,
    onRowChange,
  ]);

  const renderCell = useCallback(
    (item: Song, columnKey: React.Key) => {
      switch (columnKey) {
        case "genre":
          return (
            <div>
              {item.genre.map((g) => (
                <Fragment key={`${item.id}-${columnKey}-${g.id}`}>
                  <Chip style={{ margin: "0.2rem" }}>{g.name}</Chip>
                </Fragment>
              ))}
            </div>
          );
        case "actions":
          return (
            <div className="flex gap gap-2">
              {props.actions?.map((action, index) => (
                <Fragment key={index}>
                  <Button size="sm" key={index}>
                    {action}
                  </Button>
                </Fragment>
              ))}
            </div>
          );
        default:
          return getKeyValue(item, columnKey);
      }
    },
    [props.actions]
  );

  return (
    <Table
      topContent={topContent}
      bottomContent={buttomContent}
      onRowAction={(key) => {
        const item = props.data[key as number];
        copy(`点歌 ${item.title}`).then(() => {
          alert(`歌曲 "${item.title}" 已复制到剪切板`);
        });
      }}
      aria-label="Example static collection table"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody isLoading={props.isLoading} items={items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell key={`${item.id}-${columnKey}`}>
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
