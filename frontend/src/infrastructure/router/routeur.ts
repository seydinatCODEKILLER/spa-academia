import { getEnvironnementConfig } from "@config/env.js";
import { IBasePage } from "@core/interface/IBasePage.js";
import { IRoute } from "@core/interface/IRoutes.js";
import { IUser } from "@core/interface/IUser.js";
import { authStore } from "@infrastructure/store/AuthStore.js";
import { routes } from "./routes.config.js";
import { ROLE_PATHS } from "@config/route.constant.js";
import { ILayoutPage } from "@core/interface/ILayout.js";
import { RouteMatcher } from "./RouteMatcher.js";
import { NavigationService } from "@infrastructure/navigation/NavigationService.js";

export class Router {
  private static instance: Router;
  private basePath: string;
  private loginPath: string;
  private contentContainer: HTMLElement;
  private currentUser: IUser | null = null;
  private currentPage: IBasePage | null = null;
  private currentLayout: ILayoutPage | null = null;
  private routeMatcher: RouteMatcher;

  constructor(contentContainerID: string = "app") {
    const env = getEnvironnementConfig();
    this.basePath = env.basePath;
    this.loginPath = env.loginPage;
    this.contentContainer =
      document.getElementById(contentContainerID) || document.body;
    this.currentUser = authStore.getCurrentUser();
    this.routeMatcher = new RouteMatcher(routes, ROLE_PATHS);

    this.setupEventListener();
  }

  private setupEventListener(): void {
    document.addEventListener("click", (e) => {
      const link = (e.target as HTMLElement).closest("a[data-router-link]");
      if (link) {
        e.preventDefault();
        const path = link.getAttribute("href");
        path && this.navigateTo(path);
      }
    });
    window.addEventListener("popstate", () => this.handleRoute());
  }

  public async init(): Promise<void> {
    await this.handleRoute();
  }

  private async handleRoute(): Promise<void> {
    this.currentUser = authStore.getCurrentUser();
    const currentPath = this.routeMatcher.cleanPath(window.location.pathname);

    const route = this.routeMatcher.match(
      currentPath,
      this.currentUser ?? undefined
    );

    if (!route) {
      await this.navigateTo("/404");
      return;
    }

    if (!this.isPublicRoute(currentPath) && !this.currentUser) {
      this.redirectToLogin();
      return;
    }

    if (route.guard && !route.guard(this.currentUser!)) {
      await this.navigateTo("/dashboard");
      return;
    }

    this.renderView(route);
  }

  private isPublicRoute(path: string): boolean {
    return routes.some((r) => r.path === path && r.isProtected === false);
  }

  private async renderView(route: IRoute): Promise<void> {
    try {
      this.showLoading();
      await this.cleanupPreviousView();
      await this.initializeLayout(route);
      const pageContent = await this.renderPage(route);
      this.updateLayout(route, pageContent);
    } catch (error) {
      console.error("Router error:", error);
      this.showErrorPage();
    }
  }

  private async cleanupPreviousView(): Promise<void> {
    if (this.currentPage?.cleanUp) {
      this.currentPage.cleanUp();
    }
    this.currentPage = null;

    if (this.currentLayout) {
      this.currentLayout.cleanUp();
      this.currentLayout = null;
    }
  }

  private async initializeLayout(route: IRoute): Promise<void> {
    if (!route.layout) return;

    this.currentLayout = new route.layout(
      this.contentContainer,
      authStore.getCurrentUser()!
    );
    console.log("[ROUTER] Initializing layout:", this.currentLayout);

    this.currentLayout.render(this.contentContainer);
  }

  private async renderPage(route: IRoute): Promise<HTMLElement> {
    const PageClass = (await route.page()).default;

    const targetContainer =
      this.currentLayout?.getContentContainer() || this.contentContainer;

    const pageContent = document.createElement("div");

    this.currentPage = new PageClass(pageContent);
    await this.currentPage.render();

    return pageContent;
  }

  private updateLayout(route: IRoute, content: HTMLElement): void {
    if (this.currentLayout) {
      document.title = route.metadata?.title || "Academica";
      this.currentLayout.update(content, route.metadata?.title);
    } else {
      this.contentContainer.innerHTML = "";
      this.contentContainer.appendChild(content);
    }
  }

  private showLoading(): void {
    this.contentContainer.innerHTML = `
      <div class="router-loading">
        <div class="spinner"></div>
      </div>
    `;
  }

  private showErrorPage(): void {
    this.contentContainer.innerHTML = `
      <div class="router-error">
        <h1>Erreur de chargement</h1>
        <button id="retry-btn">Réessayer</button>
      </div>
    `;

    document.getElementById("retry-btn")?.addEventListener("click", () => {
      window.location.reload();
    });
  }

  public async navigateTo(path: string): Promise<void> {
    // Supprimez toute la logique existante et remplacez par :
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    window.history.pushState({}, "", normalizedPath);
    await this.handleRoute();
  }

  public redirectTo(path: string): void {
    window.location.href = path;
  }

  public redirectToLogin(): void {
    this.redirectTo(`${this.basePath}${this.loginPath}`);
  }

  public logout(): void {
    authStore.clearCurrentUser();
    this.cleanupPreviousView();
    this.redirectToLogin();
  }

  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }
}
