import { UserRole } from "@core/types/User.js";

export interface IUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  id_role: UserRole;
  avatar: string;
  telephone: string;
  adresse: string;
  state: "disponible" | "indisponible";
}

export interface IResponsableUser extends IUser {
  id_rol: "1";
}

export interface IProfessorUser extends IUser {
  id_role: "2";
  specialite?: string;
  grade?: string;
}

export interface IAttacheUser extends IUser {
  id_role: "3";
}

export interface IStudentUser extends IUser {
  id_role: "4";
  matricule?: string;
  id_classe?: string;
}
