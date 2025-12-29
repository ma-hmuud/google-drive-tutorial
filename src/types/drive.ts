export interface DriveFile {
  id: number;
  name: string;
  type: "file";
  size: number;
  modified: string;
  fileUrl: string;
  parent: number;
}

export interface DriveFolder {
  id: number;
  name: string;
  type: "folder";
  modified: string;
  parent: number | null;
}
