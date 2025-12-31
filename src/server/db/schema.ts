import "server-only";

import {
  bigint,
  text,
  index,
  singlestoreTableCreator,
} from "drizzle-orm/singlestore-core";

const tableCreator = singlestoreTableCreator((name) => `ma-drive_${name}`);

export const filesTable = tableCreator(
  "files_table",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    name: text("name").notNull(),
    size: bigint("size", { mode: "bigint" }).notNull(),
    fileUrl: text("file_url").notNull(),
    parent: bigint("parent", { mode: "bigint" }).notNull(),
    modified: text("modified").notNull(),
  },
  (t) => {
    return [index("idx_parent").on(t.parent)];
  },
);

export const foldersTable = tableCreator(
  "folders_table",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    name: text("name").notNull(),
    modified: text("modified").notNull(),
    parent: bigint("parent", { mode: "bigint" }),
  },
  (t) => {
    return [index("idx_parent").on(t.parent)];
  },
);
