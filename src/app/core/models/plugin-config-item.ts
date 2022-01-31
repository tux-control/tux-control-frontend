import { PluginConfigOption } from "./plugin-config-option";

export interface PluginConfigItem {
    key?: string;
    name?: string;
    isDeletable?: boolean;
    isEditable?: boolean;
    pluginConfigOptions: PluginConfigOption[];
}