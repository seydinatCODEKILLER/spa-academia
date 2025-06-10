// src/ui/notifications/Notification.ts
export function showNotification(
  message: string,
  type: "success" | "error" | "warning" | "info" = "success"
): void {
  const notificationsContainer =
    document.getElementById("notifications") || createNotificationsContainer();

  const notification = document.createElement("div");
  notification.className = `p-3 text-white rounded shadow ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  } transition transform duration-300 opacity-0 translate-y-2`;
  notification.textContent = message;

  notificationsContainer.appendChild(notification);

  setTimeout(
    () => notification.classList.remove("opacity-0", "translate-y-2"),
    10
  );

  setTimeout(() => {
    notification.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function createNotificationsContainer(): HTMLElement {
  const container = document.createElement("div");
  container.id = "notifications";
  container.className = "fixed top-4 right-4 space-y-2";
  document.body.appendChild(container);
  return container;
}
