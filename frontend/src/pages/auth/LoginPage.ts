import { IBasePage } from "@core/interface/IBasePage.js";
import { AuthField, AuthFormData } from "@core/types/Auth.js";
import { authController } from "@features/auth/AuthController.js";
import { AuthValidator } from "@features/auth/AuthValidator.js";
import { AuthView } from "@features/auth/AuthView.js";
import { notificationStore } from "@infrastructure/store/NotificationStore.js";

export default class LoginPage implements IBasePage {
  private view: AuthView;

  constructor(private container: HTMLElement) {
    this.view = new AuthView(container);
  }

  async render() {
    this.view.renderLogin();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.view.bindLoginSubmit(this.handleLogin.bind(this));
    this.view.bindFieldValidation("email", (value) =>
      this.validateField("email", value)
    );
    this.view.bindFieldValidation("password", (value) =>
      this.validateField("password", value)
    );
  }

  private async handleLogin(formData: AuthFormData): Promise<void> {
    if (!this.validateForm(formData)) return;

    try {
      this.view.setButtonLoading(true);
      await authController.login(formData.email, formData.password);
      this.view.setButtonLoading(false);
    } catch (error) {
      this.view.setButtonLoading(false);
      this.handleError(error);
    }
  }

  private validateForm(formData: AuthFormData): boolean {
    const emailValid = this.validateField("email", formData.email);
    const passwordValid = this.validateField("password", formData.password);
    return emailValid && passwordValid;
  }

  private validateField(field: AuthField, value: string): boolean {
    const validator =
      field === "email"
        ? AuthValidator.validateEmail(value)
        : AuthValidator.validatePassword(value);

    if (!validator.isValid) {
      this.view.showError(field, validator.message || "");
      return false;
    }

    this.view.clearError(field);
    return true;
  }

  private handleError(error: unknown): void {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue";

    notificationStore.showTransientNotification({
      message: errorMessage,
      type: "error",
    });
  }
  cleanUp() {}
}
