import {
  ISidebarConfig,
  ISidebarLink,
  ISidebarUser,
} from "@core/interface/ILayout.js";
import { NavigationService } from "@infrastructure/navigation/NavigationService.js";

export class Sidebar {
  private element: HTMLElement;
  private config: ISidebarConfig;
  private navigationService: NavigationService;

  constructor(
    private container: HTMLElement,
    config: Partial<ISidebarConfig>,
    navigationService: NavigationService
  ) {
    this.config = this.getDefaultConfig(config);
    this.element = this.createSidebar();
    this.navigationService = navigationService;
  }

  public render(): void {
    this.container.appendChild(this.element);
    this.setupEventListeners();
  }

  public updateLinks(links: ISidebarLink[]): void {
    this.config.links = links;
    this.updateNavigation();
  }

  public updateUser(user: ISidebarUser): void {
    this.config.user = user;
    this.updateFooter();
  }

  public toggle(): void {
    this.element.classList.toggle("-translate-x-full");
  }

  public cleanUp(): void {
    this.element.remove();
  }

  private getDefaultConfig(config: Partial<ISidebarConfig>): ISidebarConfig {
    return {
      logo: {
        icon: "ri-funds-fill",
        text: "Academica.co",
      },
      links: [],
      user: {
        avatar: "",
        name: "",
        role: "",
      },
      ...config,
    };
  }

  private createSidebar(): HTMLElement {
    const sidebar = document.createElement("div");
    sidebar.className =
      "flex flex-col justify-between p-3 fixed left-0 shadow-md h-full bg-white text-gray-900 w-64 lg:w-52 md:flex transform transition-transform duration-300 ease-in-out -translate-x-full lg:translate-x-0 z-50";

    const contentContainer = document.createElement("div");
    contentContainer.className = "flex flex-col gap-6";
    contentContainer.appendChild(this.createHeader());
    contentContainer.appendChild(this.createNavigation());

    sidebar.appendChild(contentContainer);
    sidebar.appendChild(this.createFooter());

    return sidebar;
  }

  private createHeader(): HTMLElement {
    const header = document.createElement("div");
    header.className = "flex justify-between";

    const logo = document.createElement("div");
    logo.className = "flex items-center gap-2 text-md";
    logo.innerHTML = `
      <i class="${this.config.logo?.icon} text-xl"></i>
      <span class="font-medium">${this.config.logo?.text}</span>
    `;

    const closeBtn = document.createElement("div");
    closeBtn.className = "lg:hidden cursor-pointer";
    closeBtn.innerHTML =
      '<i class="ri-layout-right-line text-lg font-semibold"></i>';
    closeBtn.addEventListener("click", () => this.toggle());

    header.appendChild(logo);
    header.appendChild(closeBtn);

    return header;
  }

  private createNavigation(): HTMLElement {
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    ul.className = "flex flex-col gap-1";

    this.config.links.forEach((link) => {
      ul.appendChild(this.createNavItem(link));
    });

    nav.appendChild(ul);
    return nav;
  }

  private createNavItem(link: ISidebarLink): HTMLElement {
    const li = document.createElement("li");
    li.className = `py-2 px-4 hover:bg-gray-50 hover:rounded ${
      link.active ? "bg-purple-500 text-white rounded-3xl shadow-lg" : ""
    }`;

    const a = document.createElement("a");
    a.href = link.path;
    a.className = "font-medium gap-3 flex items-center text-sm";
    a.setAttribute("data-router-link", "");
    a.innerHTML = `
      <i class="${link.icon} text-lg"></i>
      <span>${link.text}</span>
    `;

    a.addEventListener("click", (e) => {
      this.navigationService.handleSidebarNavigation(e, link.path);
      this.setActiveLink(link.path);
    });

    li.appendChild(a);
    return li;
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement("div");
    footer.className = "flex items-center justify-between";

    const userInfo = document.createElement("div");
    userInfo.className = "flex gap-1";
    userInfo.innerHTML = `
      <img src="${this.config.user.avatar}" alt="Avatar" class="w-9 h-9 rounded object-cover">
      <div class="flex flex-col">
        <span class="text-sm text-purple-500 font-medium">${this.config.user.role}</span>
        <p class=" text-gray-800 text-sm">${this.config.user.name}</p>
      </div>
    `;

    const dropdown = this.createDropdownMenu();
    footer.appendChild(userInfo);
    footer.appendChild(dropdown);

    return footer;
  }

  private createDropdownMenu(): HTMLElement {
    const dropdown = document.createElement("div");
    dropdown.className =
      "dropdown dropdown-top w-10 h-10 flex justify-center items-center hover:bg-gray-50 rounded border border-gray-300";
    dropdown.innerHTML = `
      <i class="ri-expand-up-down-line" tabindex="0" role="button"></i>
      <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-44 p-2 shadow-sm">
        <li>
          <a href="/profile" data-router-link class="text-sm font-semibold border-b border-gray-100">
            <i class="ri-settings-2-line font-medium"></i>
            <span>Mon compte</span>
          </a>
        </li>
        <li>
          <a id="logoutBtn" class="text-sm font-semibold logout-btn">
            <i class="ri-logout-box-r-line font-medium"></i>
            <span>Déconnexion</span>
          </a>
        </li>
      </ul>
    `;

    dropdown.querySelector("#logoutBtn")?.addEventListener("click", (e) => {
      this.navigationService.handleLogout(e);
    });

    return dropdown;
  }

  private updateNavigation(): void {
    const nav = this.element.querySelector("nav");
    if (nav) {
      nav.innerHTML = "";
      nav.appendChild(this.createNavigation());
    }
  }

  private updateFooter(): void {
    const oldFooter = this.element.querySelector("div:last-child");
    if (oldFooter) {
      oldFooter.replaceWith(this.createFooter());
    }
  }

  private setActiveLink(path: string): void {
    this.element.querySelectorAll("li").forEach((li) => {
      li.classList.remove(
        "bg-purple-500",
        "text-white",
        "rounded-3xl",
        "shadow-lg"
      );
    });

    const activeLink = this.element.querySelector(`a[href="${path}"]`);
    if (activeLink) {
      activeLink.parentElement?.classList.add(
        "bg-purple-500",
        "text-white",
        "rounded-3xl",
        "shadow-lg"
      );
    }
  }

  private setupEventListeners(): void {
    // Ajoutez ici des écouteurs globaux si nécessaire
  }
}
