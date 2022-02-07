
export interface FileInfo {
    parts: string[];
    parent?: FileInfo;
    parents: FileInfo[];
    name: string;
    absolute: string;
    suffix: string;
    stem: string;
    isDir: boolean;
    isFile: boolean;
    isWritable: boolean;
    isReadable: boolean;
    mimeType: string;
    owner: string;
    size: number;
    created: Date;
    updated: Date;

    //!TODO rework this to Control[] ?
    onDelete?: () => void;
    onEdit?: () => void;
    onDownload?: () => void;
    onInfo?: () => void;
    onClick?: (event: MouseEvent) => void;
}