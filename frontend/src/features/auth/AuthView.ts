import { APP_IMAGES } from "@config/assets.js";
import { IAuthView } from "@core/interface/IAuthView.js";
import { AuthField, AuthFormData } from "@core/types/Auth.js";

export class AuthView implements IAuthView {
  private form?: HTMLFormElement;
  private emailInput?: HTMLInputElement;
  private passwordInput?: HTMLInputElement;

  constructor(private container: HTMLElement) {}

  renderLogin(): string {
    this.container.innerHTML = `
      <div class="h-screen flex bg-white">
        <div class="w-1/2 hidden lg:block">
          <img src=${APP_IMAGES.AUTH_BG} alt="" class="h-full object-cover" />
        </div>
        <div class="flex-1 relative flex flex-col justify-center items-center gap-5 inset-0 bg-gradient-to-r from-indigo-50/50 to-white">
          ${this.authHeader()}
          ${this.loginForm()}
        </div>
      </div>`;
    this.cacheElements();
    return this.container.innerHTML;
  }

  private authHeader(): string {
    return `
      <div class="flex justify-between">
        <div class="flex text-gray-800 font-medium text-lg animate-bounce items-center absolute top-5 left-28 gap-1">
          <i class="ri-book-open-fill"></i>
          <span>Academica.co</span>
        </div>
      </div>
      <div class="relative">
        <i class="ri-bookmark-fill text-purple-500 text-xl absolute -top-3 -right-2"></i>
        <p class="text-gray-600 w-full md:w-96 text-center font-medium">
          Bienvenue sur la plateforme de gestion scolaire ! Connectez-vous pour
          accéder à votre espace personnel
        </p>
      </div>
    `;
  }

  private loginForm(): string {
    return `
      <form id="loginForm" class="w-full md:w-[500px] mx-auto p-3 mt-4">
        <div class="mb-4">
          <label class="block text-gray-500 font-semibold mb-2">Email</label>
          <div class="relative">
            <input
              type="email"
              id="email"
              placeholder="votre adresse email"
              class="w-full px-4 py-3 border rounded shadow-sm border-gray-200 bg-white focus:outline-none focus:border-blue-500"
            />
            <i class="ri-mail-ai-line absolute right-2 top-2"></i>
          </div>
          <p id="errorEmail" class="text-red-500 text-sm h-4"></p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-500 font-semibold mb-2">Mot de passe</label>
          <div class="relative">
            <input
              type="password"
              id="password"
              placeholder="votre password"
              class="w-full px-4 py-3 border shadow-sm rounded border-gray-200 bg-white focus:outline-none focus:border-blue-500"
            />
            <i class="ri-lock-password-line absolute right-2 top-2"></i>
          </div>
          <p id="errorPassword" class="text-red-500 text-sm h-4"></p>
        </div>
        <button
          type="submit"
          id="loginButton"
          class="w-full bg-purple-500 rounded text-white font-medium py-4"
        >
          <span id="buttonText">Se connecter</span>
          <span id="spinner" class="loading loading-spinner hidden"></span>
        </button>
      </form>
      <div id="notifications" class="fixed top-4 right-4 space-y-2"></div>
    `;
  }

  public setButtonLoading(isLoading: boolean): void {
    const button = this.container.querySelector(
      "#loginButton"
    ) as HTMLButtonElement;
    const spinner = this.container.querySelector("#spinner") as HTMLSpanElement;
    const buttonText = this.container.querySelector(
      "#buttonText"
    ) as HTMLSpanElement;

    if (!button || !spinner || !buttonText) return;

    button.disabled = isLoading;
    spinner.classList.toggle("hidden", !isLoading);
    buttonText.textContent = isLoading
      ? "Connexion en cours..."
      : "Se connecter";
  }

  private cacheElements(): void {
    this.form = this.container.querySelector("#loginForm") as HTMLFormElement;
    this.emailInput = this.container.querySelector(
      "#email"
    ) as HTMLInputElement;
    this.passwordInput = this.container.querySelector(
      "#password"
    ) as HTMLInputElement;
  }

  bindLoginSubmit(handler: (data: AuthFormData) => Promise<void>): void {
    this.form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!this.emailInput || !this.passwordInput) return;

      await handler({
        email: this.emailInput.value.trim(),
        password: this.passwordInput.value.trim(),
      });
    });
  }

  bindFieldValidation(
    field: AuthField,
    handler: (value: string) => boolean
  ): void {
    const input = field === "email" ? this.emailInput : this.passwordInput;
    input?.addEventListener("input", () => {
      if (input) handler(input.value);
    });
  }

  showError(field: AuthField, message: string): void {
    const errorElement = this.container.querySelector(
      `#error${field.charAt(0).toUpperCase() + field.slice(1)}`
    ) as HTMLElement;
    if (errorElement) errorElement.textContent = message;
  }

  clearError(field: AuthField): void {
    this.showError(field, "");
  }
}
