import { filesTable } from "./schema";
import { db } from ".";

async function createFile(input: { file: {
    name: string;
    size: number;
    fileUrl: string;
    parent: bigint;
    modified: string;
    ownerId: string;
}; userId: string }) {
  return db.insert(filesTable).values({
    name: input.file.name,
    size: BigInt(input.file.size),
    fileUrl: input.file.fileUrl,
    parent: input.file.parent,
    modified: input.file.modified,
    ownerId: input.userId,
  });
}

export const MUTATIONS = {
  createFile,
};
