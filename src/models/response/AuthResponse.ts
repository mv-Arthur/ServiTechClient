import { IUser } from "../IUser";

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: IUser;
	personal: Personal;
}

export interface Personal {
	name: string;
	surname: string;
	patronymic: string;
	phoneNumber: string;
	avatar: string;
}
