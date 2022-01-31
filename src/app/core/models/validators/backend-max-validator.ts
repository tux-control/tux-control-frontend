import { BackendValidator } from "./backend-validator";

export interface BackendMaxValidator extends BackendValidator {
    maxValue: number;
}