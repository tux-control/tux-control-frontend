import { BackendValidator } from "./backend-validator";

export interface BackendMinValidator extends BackendValidator {
    minValue: number;
}