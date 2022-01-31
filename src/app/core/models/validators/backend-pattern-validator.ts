import { BackendValidator } from "./backend-validator";


export interface BackendPatternValidator extends BackendValidator {
    pattern: string;
}