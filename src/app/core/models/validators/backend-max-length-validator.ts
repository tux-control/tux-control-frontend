import { BackendValidator } from "./backend-validator";

export interface BackendMaxLengthValidator extends BackendValidator {
    maxLength: number;
}