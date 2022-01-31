import { GridColumn } from "./grid-column";
import { PluginConfigOption } from "./plugin-config-option";

export interface Plugin {
    key: string;
    name: string;
    icon: string;
    newItemPluginConfigOptions?: PluginConfigOption[];
    hasOnNew: boolean;
    gridColumns: GridColumn[];
}