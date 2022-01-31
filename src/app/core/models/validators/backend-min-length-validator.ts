import { BackendValidator } from "./backend-validator";

export interface BackendMinLengthValidator extends BackendValidator {
    minLength: number;
}