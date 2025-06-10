import { IRoute } from "@core/interface/IRoutes.js";
import { IUser } from "@core/interface/IUser.js";

export class RouteMatcher {
  constructor(
    private routes: IRoute[],
    private rolePaths: Record<string, string>
  ) {}

  cleanPath(path: string): string {
    return path.replace(/\/$/, "") || "/";
  }

  match(path: string, user?: IUser): IRoute | undefined {
    const clean = this.cleanPath(path);

    return this.routes.find((route) => {
      const isMatch =
        route.path === clean || this.isDynamicMatch(route.path, clean);
      const hasAccess = !route.guard || (user && route.guard(user));
      return isMatch && hasAccess;
    });
  }

  private isDynamicMatch(routePath: string, currentPath: string): boolean {
    const regex = new RegExp("^" + routePath.replace(/:\w+/g, "[^/]+") + "$");
    return regex.test(currentPath);
  }
}
