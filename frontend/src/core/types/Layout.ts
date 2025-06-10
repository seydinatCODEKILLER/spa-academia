import { ILayoutPage } from "@core/interface/ILayout.js";
import { IUser } from "@core/interface/IUser.js";

export type LayoutConstructor = new (
  container: HTMLElement,
  user: IUser
) => ILayoutPage;
