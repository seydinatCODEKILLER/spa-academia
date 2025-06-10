import { IRoute } from "@core/interface/IRoutes.js";
import { DefaultLayout } from "@ui/layout/DefaultLayout.js";
import { ResponsableLayout } from "@ui/layout/ResponsableLayout.js";

export const routes: IRoute[] = [
  {
    path: "/",
    page: () => import("@pages/auth/LoginPage"),
    layout: DefaultLayout,
    isProtected: false,
    metadata: {
      title: "Connexion",
    },
  },
  {
    path: "/login",
    page: () => import("@pages/auth/LoginPage"),
    layout: DefaultLayout,
    isProtected: false,
    metadata: {
      title: "Connexion",
    },
  },
  {
    path: "/rp/dashboard",
    role: "1",
    page: () => import("@pages/responsable/DashboardPage"),
    isProtected: true,
    layout: ResponsableLayout,
    metadata: {
      title: "Dashboard",
    },
  },
];
