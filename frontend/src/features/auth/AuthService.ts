import { IUser } from "@core/interface/IUser.js";
import { HttpClient } from "@infrastructure/http/httpClient.js";

export class AuthService {
  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<IUser> {
    const users = await this.http.get<IUser[]>("utilisateurs");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Identifiants incorrects");
    }

    return user;
  }
}

export const authService = new AuthService(new HttpClient());
