export interface DriveFile {
  id: bigint;
  name: string;
  type: "file";
  size: number;
  modified: string;
  fileUrl: string;
  parent: bigint;
}

export interface DriveFolder {
  id: bigint;
  name: string;
  type: "folder";
  modified: string;
  parent: bigint | null;
}
