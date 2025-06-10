import { IUser } from "./IUser.js";

export interface IHeaderConfig {
  currentPage: string;
  userName: string;
  currentYear?: number;
  onThemeChange?: () => void;
  onMenuClick?: () => void;
}

export interface ISidebarLink {
  path: string;
  text: string;
  icon: string;
  active?: boolean;
}

export interface ISidebarUser {
  avatar: string;
  name: string;
  role: string;
}

export interface ISidebarConfig {
  logo?: {
    icon: string;
    text: string;
  };
  user: ISidebarUser;
  links: ISidebarLink[];
}

export interface ILayoutPage {
  render(container: HTMLElement): void;
  update(content: HTMLElement, title?: string): void;
  cleanUp(): void;
  getContentContainer(): HTMLElement;
}
