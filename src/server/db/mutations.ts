import { filesTable } from "./schema";
import { db } from ".";

async function createFile(input: { file: {
    name: string;
    size: number;
    fileUrl: string;
    parent: bigint;
    modified: string;
}; userId: string }) {
  return db.insert(filesTable).values({
    name: input.file.name,
    size: BigInt(input.file.size),
    fileUrl: input.file.fileUrl,
    parent: BigInt(1),
    modified: input.file.modified,
  });
}

export const MUTATIONS = {
  createFile,
};
