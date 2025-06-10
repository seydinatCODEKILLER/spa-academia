import { UserRole } from "@core/types/User.js";
import { IUser } from "./IUser.js";
import { IBasePage } from "./IBasePage.js";
import { LayoutConstructor } from "@core/types/Layout.js";

export interface IRoute {
  path: string;
  role?: UserRole;
  page: () => Promise<{ default: new (container: HTMLElement) => IBasePage }>;
  isProtected?: boolean;
  guard?: (user: IUser) => boolean;
  layout?: LayoutConstructor;
  metadata?: {
    title?: string;
  };
}
