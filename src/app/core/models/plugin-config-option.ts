
import { Control } from './controls/control';
import { BackendValidator } from './validators/backend-validator';

export interface PluginConfigOption {
  key: string;
  name: string;
  description: string;
  validators: BackendValidator[];
  defaultValue?: any;
  value?: any;
  control: Control;
}
