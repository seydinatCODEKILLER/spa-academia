import { INavigation } from "@core/interface/INavigation.js";
import { Router } from "@infrastructure/router/routeur.js";

export class NavigationService implements INavigation {
  private static instance: NavigationService;

  private constructor(private router: Router) {}

  public static init(router: Router) {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService(router);
    }
    return NavigationService.instance;
  }

  public static getInstance() {
    if (!NavigationService.instance) {
      throw new Error("NavigationService not initialized");
    }
    return NavigationService.instance;
  }

  handleSidebarNavigation(event: Event, path: string): void {
    event.preventDefault();
    this.router.navigateTo(path);
  }

  handleLogout(event: Event): void {
    event.preventDefault();
    this.router.logout();
  }
}
