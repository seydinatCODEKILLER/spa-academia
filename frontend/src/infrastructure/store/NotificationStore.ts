// @infrastructure/store/NotificationStore.ts
type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  message: string;
  type: NotificationType;
  duration?: number;
}

class NotificationStore {
  private static instance: NotificationStore;
  private transientListeners: Array<(n: Notification) => void> = [];
  private persistentListeners: Array<(n: Notification) => void> = [];

  private constructor() {}

  public static getInstance(): NotificationStore {
    if (!NotificationStore.instance) {
      NotificationStore.instance = new NotificationStore();
    }
    return NotificationStore.instance;
  }

  // Pour les notifications immédiates (non persistantes)
  public showTransientNotification(notification: Notification): void {
    this.emitTransient(notification);
  }

  // Pour les notifications persistantes
  public showPersistentNotification(notification: Notification): void {
    localStorage.setItem("pendingNotification", JSON.stringify(notification));
    this.emitPersistent(notification);
  }

  public displayStoredNotifications(): void {
    const stored = localStorage.getItem("pendingNotification");
    if (stored) {
      const notification = JSON.parse(stored) as Notification;
      this.emitPersistent(notification);
      localStorage.removeItem("pendingNotification");
    }
  }

  public subscribeTransient(listener: (n: Notification) => void): () => void {
    this.transientListeners.push(listener);
    return () => {
      this.transientListeners = this.transientListeners.filter(
        (l) => l !== listener
      );
    };
  }

  public subscribePersistent(listener: (n: Notification) => void): () => void {
    this.persistentListeners.push(listener);
    return () => {
      this.persistentListeners = this.persistentListeners.filter(
        (l) => l !== listener
      );
    };
  }

  private emitTransient(notification: Notification): void {
    this.transientListeners.forEach((listener) => listener(notification));
  }

  private emitPersistent(notification: Notification): void {
    this.persistentListeners.forEach((listener) => listener(notification));
  }
}

export const notificationStore = NotificationStore.getInstance();
