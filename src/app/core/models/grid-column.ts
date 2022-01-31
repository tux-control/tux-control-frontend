
export interface GridColumn {
    field: string;
    header: string;
    filterMatchMode: string | null;
    isSortable: boolean;
    columnFormat: string | null; 
}