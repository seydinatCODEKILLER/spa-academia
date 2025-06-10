import {
  IHeaderConfig,
  ILayoutPage,
  ISidebarConfig,
} from "@core/interface/ILayout.js";
import { IUser } from "@core/interface/IUser.js";
import { NavigationService } from "@infrastructure/navigation/NavigationService.js";
import { ResponsiveHeader } from "@ui/components/header/Header.js";
import { Sidebar } from "@ui/components/sidebar/Sidebar.js";

export class ResponsableLayout implements ILayoutPage {
  private sidebar: Sidebar;
  private header: ResponsiveHeader;
  private contentElement: HTMLElement;
  private mainWrapper: HTMLElement;

  constructor(private container: HTMLElement, private user: IUser) {
    this.mainWrapper = document.createElement("div");
    this.mainWrapper.className = "ml-0 lg:ml-64 flex flex-col min-h-screen";

    this.contentElement = document.createElement("div");
    this.contentElement.className = "p-4";

    this.sidebar = new Sidebar(
      container,
      this.getSidebarConfig(),
      NavigationService.getInstance()
    );
    this.header = new ResponsiveHeader(this.getHeaderConfig());
  }

  render(): void {
    this.sidebar.render();
    this.header.render(this.mainWrapper);
    this.mainWrapper.appendChild(this.contentElement);
    this.container.appendChild(this.mainWrapper);
  }

  update(content: HTMLElement, title?: string): void {
    if (title) {
      this.header.update({ currentPage: title });
    }
    this.contentElement.innerHTML = "";
    this.contentElement.appendChild(content);
  }

  getContentContainer(): HTMLElement {
    return this.contentElement;
  }

  cleanUp(): void {
    this.sidebar.cleanUp();
    this.header.cleanUp();
    this.mainWrapper.remove();
  }

  private getSidebarConfig(): ISidebarConfig {
    return {
      logo: {
        icon: "ri-admin-line",
        text: "Academica.io",
      },
      links: [
        {
          text: "Tableau de bord",
          icon: "ri-dashboard-line",
          path: "/rp/dashboard",
          active: true,
        },
        {
          text: "Professeurs",
          icon: "ri-user-3-line",
          path: "/rp/teachers",
        },
        {
          text: "Classes",
          icon: "ri-building-line",
          path: "/rp/classes",
        },
        {
          text: "Cours",
          icon: "ri-book-line",
          path: "/rp/courses",
        },
      ],
      user: {
        name:
          `${this.user.prenom} ${this.user.nom}` || "Responsable Pédagogique",
        role: "Responsable",
        avatar: this.user.avatar || "/assets/default-avatar.png",
      },
    };
  }

  private getHeaderConfig(): IHeaderConfig {
    return {
      currentPage: "Tableau de bord",
      userName: this.user.prenom || "Responsable",
      currentYear: new Date().getFullYear(),
      onMenuClick: () => this.sidebar.toggle(),
      onThemeChange: () => {
        document.documentElement.classList.toggle("dark");
      },
    };
  }
}
