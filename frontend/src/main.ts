import { NavigationService } from "@infrastructure/navigation/NavigationService.js";
import { Router } from "@infrastructure/router/routeur.js";
import { NotificationManager } from "@ui/components/notifications/NotificationManager.js";
import { showFatalError } from "@ui/errorHandler.js";

/**
 * Initialise l'application
 */
async function bootstrapApp() {
  try {
    NotificationManager.getInstance();
    // Initialise le routeur

    const router = Router.getInstance();
    NavigationService.init(router);
    await router.init();

    // Marquage du chargement réussi (pour analytics)
    document.documentElement.dataset.appStatus = "loaded";
  } catch (error) {
    handleBootstrapError(error);
  }
}

/**
 * Gère les erreurs critiques de démarrage
 */
function handleBootstrapError(error: unknown) {
  console.error("[BOOTSTRAP] Erreur critique:", error);

  showFatalError(`
    <h1>Application indisponible</h1>
    <p>Veuillez rafraîchir la page ou réessayer plus tard.</p>
    <button onclick="window.location.reload()">Recharger</button>
  `);
}

// Configuration des erreurs globales
window.addEventListener("unhandledrejection", (event) => {
  console.error("Erreur non traitée:", event.reason);
});

// Lancement contrôlé après le chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("app")) {
    console.error("Élément #app introuvable");
    return;
  }

  bootstrapApp().catch(handleBootstrapError);
});
