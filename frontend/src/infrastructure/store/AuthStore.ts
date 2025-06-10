import { IUser } from "@core/interface/IUser.js";

class AuthStore {
  private static instance: AuthStore;
  private currentUser: IUser | null = null;

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  private loadFromStorage(): void {
    const user = localStorage.getItem("currentUser");
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  setCurrentUser(user: IUser): void {
    this.currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  clearCurrentUser(): void {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
  }

  getCurrentUser(): IUser | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}

export const authStore = AuthStore.getInstance();
