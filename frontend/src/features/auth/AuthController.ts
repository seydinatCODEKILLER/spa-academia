import { authStore } from "@infrastructure/store/AuthStore.js";
import { authService } from "./AuthService.js";
import { Router } from "@infrastructure/router/routeur.js";
import { notificationStore } from "@infrastructure/store/NotificationStore.js";

export class AuthController {
  constructor(private router: Router) {}
  async login(email: string, password: string): Promise<void> {
    try {
      const user = await authService.login(email, password);
      authStore.setCurrentUser(user);
      notificationStore.showPersistentNotification({
        message: "Connexion réussie !",
        type: "success",
        duration: 3000,
      });
      this.router.navigateTo(this.getDashboardPath(user.id_role));
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    authStore.clearCurrentUser();
    this.router.navigateTo("/login");
  }

  private getDashboardPath(roleId: string): string {
    const paths: Record<string, string> = {
      "1": "/rp/dashboard",
      "2": "/teacher/dashboard",
      "3": "/attache/dashboard",
      "4": "/student/dashboard",
    };
    return paths[roleId] || "/";
  }
}

export const authController = new AuthController(new Router());
