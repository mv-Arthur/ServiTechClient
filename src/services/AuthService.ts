import $api from "../http/index";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { KeyResponse } from "../models/response/KeyResponse";
import { AddOrderResponse } from "../models/response/AddOrderResponse";

export class AuthService {
	static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>("/user/login", { email, password });
	}

	static async registration(
		email: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>("/user/registration", { email, password });
	}

	static async logout(): Promise<void> {
		return $api.post("/user/logout");
	}

	static async sendResetMail(email: string) {
		return $api.post("/user/reset", {
			email,
		});
	}

	static async resetPass(
		password: string,
		link: string
	): Promise<AxiosResponse<AddOrderResponse>> {
		return $api.post(`user/reset/${link}`, {
			newPassword: password,
		});
	}

	static async getPublicKey(id: number): Promise<AxiosResponse<KeyResponse>> {
		return $api.get(`/user/pushKey/${id}`);
	}

	static async subscription(
		subscription: PushSubscription,
		id: number
	): Promise<AxiosResponse<AddOrderResponse>> {
		return $api.post("/user/subscription", { subscription: subscription, id: id });
	}

	static async resubscribe(
		subscription: PushSubscription,
		id: number
	): Promise<AxiosResponse<AddOrderResponse>> {
		return $api.post("/user/resubscribe", { subscription: subscription, id: id });
	}

	static async setName(userId: number, name: string) {
		return $api.patch("/user/name", { userId, name });
	}

	static async setSurname(userId: number, surname: string) {
		return $api.patch("/user/surname", {
			userId,
			surname,
		});
	}

	static async setPatronymic(userId: number, patronymic: string) {
		return $api.patch("user/patronymic", {
			userId,
			patronymic,
		});
	}

	static async setPhoneNumber(userId: number, phoneNumber: string) {
		return $api.patch("/user/phoneNumber", {
			userId,
			phoneNumber,
		});
	}

	static async setAvatar(formData: FormData) {
		return $api.patch("user/avatar", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
}
