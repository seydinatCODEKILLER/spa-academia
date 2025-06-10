// src/pages/rp/DashboardPage.ts
import { IBasePage } from "@core/interface/IBasePage.js";

export default class DashboardPage implements IBasePage {
  private contentElement: HTMLElement;

  constructor(private container: HTMLElement) {
    // Crée un élément spécifique pour le contenu
    this.contentElement = document.createElement("div");
    this.contentElement.className = "dashboard-content";
  }

  async render() {
    // Ne pas écraser le container parent
    this.contentElement.innerHTML = this.createDashboardContent();
    this.container.appendChild(this.contentElement);
    this.setupEventListeners();
  }

  private createDashboardContent(): string {
    return `
      <div class="dashboard-container p-6">
        <h1 class="text-2xl font-bold mb-6">Tableau de bord</h1>
        

        <!-- Ajoutez ici les autres éléments du dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Cartes de statistiques -->
          <div class="stats-card bg-white p-4 rounded-lg shadow">
            <h3 class="font-medium mb-2">Étudiants inscrits</h3>
            <p class="text-3xl font-bold">245</p>
          </div>
          
          <!-- ... autres cartes -->
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    // Ajoutez ici les écouteurs d'événements si nécessaire
  }

  cleanUp() {
    // Nettoyage si nécessaire
  }
}
