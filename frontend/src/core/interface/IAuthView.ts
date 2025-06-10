import { AuthField, AuthFormData } from "@core/types/Auth.js";

export interface IAuthView {
  renderLogin(): string;
  bindLoginSubmit(handler: (data: AuthFormData) => Promise<void>): void;
  bindFieldValidation(
    field: AuthField,
    handler: (value: string) => boolean
  ): void;
  showError(field: AuthField, message: string): void;
  clearError(field: AuthField): void;
}
