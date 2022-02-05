import { FileInfo } from "./file-info";

export interface ChunkUploadInfo {
    id?: string;
    file?: FileInfo;
    finished: boolean;
}