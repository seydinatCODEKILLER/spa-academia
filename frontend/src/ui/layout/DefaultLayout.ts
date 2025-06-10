import { ILayoutPage } from "@core/interface/ILayout.js";
import { IUser } from "@core/interface/IUser.js";

export class DefaultLayout implements ILayoutPage {
  constructor(private container: HTMLElement, private user: IUser) {}

  render(): void {
    this.container.innerHTML = `
      <div id="main-content" class="p-4">
        <!-- Le contenu sera injecté ici -->
      </div>
    `;
  }

  update(content: HTMLElement, title?: string): void {
    const mainContent = this.container.querySelector("#main-content");
    if (mainContent) {
      mainContent.innerHTML = "";
      mainContent.appendChild(content);
    }
  }

  getContentContainer(): HTMLElement {
    return this.container.querySelector("#main-content") as HTMLElement;
  }

  cleanUp(): void {
    this.container.innerHTML = "";
  }
}
