import {
  bigint,
  text,
  index,
  singlestoreTableCreator,
} from "drizzle-orm/singlestore-core";

const tableCreator = singlestoreTableCreator((name) => `ma_drive_${name}`);

export const filesTable = tableCreator(
  "files_table",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    name: text("name").notNull(),
    size: bigint("size", { mode: "bigint" }).notNull(),
    fileUrl: text("file_url").notNull(),
    parent: bigint("parent", { mode: "bigint" }).notNull(),
    modified: text("modified").notNull(),
    ownerId: text("owner_id").notNull(),
  },
  (t) => {
    return [
      index("idx_parent").on(t.parent),
      index("idx_owner_id").on(t.ownerId),
    ];
  },
);

export const foldersTable = tableCreator(
  "folders_table",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    name: text("name").notNull(),
    modified: text("modified").notNull(),
    parent: bigint("parent", { mode: "bigint" }),
    ownerId: text("owner_id").notNull(),
  },
  (t) => {
    return [
      index("idx_parent").on(t.parent),
      index("idx_owner_id").on(t.ownerId),
    ];
  },
);
