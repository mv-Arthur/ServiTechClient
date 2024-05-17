import { RoleType } from "./RoleType";

export interface IUser {
	email: string;
	isActivated: boolean;
	id: number;
	role: RoleType;
}
