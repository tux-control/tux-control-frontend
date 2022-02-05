import { FileInfo } from "./file-info";

export interface FileInfoUpdateResponse {
    oldFileInfo: FileInfo;
    newFileInfo: FileInfo;
}