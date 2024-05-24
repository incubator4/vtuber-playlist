import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type MapProp = PageObjectResponse["properties"];
type Prop = MapProp[keyof MapProp];

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const database = {
  user: "aea9b2d3ada94e6eac577077189a78ed",
  playlist: "81769e93528c4fe28d85c07e2c78ad5e",
};

export const getUsers = async () => {
  const { results } = await notion.databases.query({
    database_id: database.user,
  });
  return (results as PageObjectResponse[]).map((result) => ({
    id: getID(result.properties.id),
    name: getName(result.properties.Name),
    uid: getUID(result.properties.UID),
    avatar: getAvatar(result.properties.Avatar),
  }));
};

export const getUser = async (id: string) => {
  const { results } = await notion.databases.query({
    database_id: database.user,
    filter: {
      property: "id",
      rich_text: {
        equals: id,
      },
    },
  });

  return results && results.length > 0
    ? (results[0] as PageObjectResponse)
    : null;
};

export const getPlaylist = async (userId: string) => {
  const { results } = await notion.databases.query({
    database_id: database.playlist,
    filter: {
      property: "User",
      relation: {
        contains: userId,
      },
    },
    page_size: 100,
  });

  return results
    .filter((result) => result.object === "page")
    .map((result) => {
      const page = result as PageObjectResponse;
      return {
        title: getTitle(page.properties.Title) || "Err: title not found",
        genre: getGenre(page.properties.Genre) || "Err: genre not found",
        artist: getArtist(page.properties.Artist) || "Err: artist not found",
        lang: getLanguage(page.properties.Language) || "Err: lang not found",
      };
    });
};

const getAllPages = async (
  database_id: string,
  start_cursor: string | null
) => {
  const pages: PageObjectResponse[] = [];

  const { results, has_more, next_cursor } = await notion.databases.query({
    database_id,
    start_cursor: start_cursor ?? undefined,
  });

  pages.push(...results.map((result) => result as PageObjectResponse));
  if (has_more) {
    pages.push(...(await getAllPages(database_id, next_cursor)));
  }

  return pages;
};

const getTitle = (prop: Prop) => {
  if (prop.type !== "title") {
    return "Err: prop is not title";
  }

  const { title } = prop;
  if (title.length === 0) {
    return "Err: title is empty";
  }

  return title[0].plain_text;
};

const getGenre = (prop: Prop) => {
  if (prop.type !== "multi_select") {
    return "Err: prop is not multi_select";
  }

  return prop.multi_select.map((option) => option.name);
};

const getArtist = (prop: Prop) => {
  if (prop.type !== "rich_text") {
    return "Err: prop is not rich_text";
  }

  const text = prop.rich_text;

  if (text.length === 0) {
    return "Err: text is empty";
  }

  return text[0].plain_text;
};

const getLanguage = (prop: Prop) => {
  if (prop.type !== "select") {
    return "Err: prop is not select";
  }

  return prop.select ? prop.select.name : "";
};

const getName = (prop: Prop) => {
  if (prop.type !== "title") {
    return "Err: prop is not rich_text";
  }

  const text = prop.title;

  if (text.length === 0) {
    return "Err: text is empty";
  }

  return text[0].plain_text;
};

const getID = (prop: Prop) => {
  if (prop.type !== "rich_text") {
    return "Err: prop is not rich_text";
  }

  const text = prop.rich_text;

  if (text.length === 0) {
    return "Err: text is empty";
  }

  return text[0].plain_text;
};

const getUID = (prop: Prop) => {
  if (prop.type !== "number") {
    return -1;
  }

  return prop.number;
};

const getAvatar = (prop: Prop) => {
  if (prop.type !== "url") {
    return "Err: prop is not url";
  }

  return prop.url;
};
