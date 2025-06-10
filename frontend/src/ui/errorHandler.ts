export function showFatalError(content: string): void {
  const appContainer = document.getElementById("app") || document.body;
  appContainer.innerHTML = `
    <div class="fatal-error">
      ${content}
    </div>
  `;
}
