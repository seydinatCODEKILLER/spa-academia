// @ui/components/notifications/NotificationManager.ts
import { notificationStore } from "@infrastructure/store/NotificationStore.js";
import { showNotification } from "./Notification.js";

export class NotificationManager {
  private static instance: NotificationManager;
  private unsubscribeTransient?: () => void;
  private unsubscribePersistent?: () => void;

  private constructor() {
    this.init();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private init(): void {
    // Affiche d'abord les notifications persistantes stockées
    notificationStore.displayStoredNotifications();

    // Abonnement aux notifications transitoires (immédiates)
    this.unsubscribeTransient = notificationStore.subscribeTransient(
      (notification) => {
        showNotification(notification.message, notification.type);
      }
    );

    // Abonnement aux notifications persistantes (après redirection)
    this.unsubscribePersistent = notificationStore.subscribePersistent(
      (notification) => {
        showNotification(notification.message, notification.type);
      }
    );
  }

  public destroy(): void {
    this.unsubscribeTransient?.();
    this.unsubscribePersistent?.();
  }
}
