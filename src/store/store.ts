import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import { AuthService } from "../services/AuthService";
import axios from "axios";
import { AuthResponse, Personal } from "../models/response/AuthResponse";
import { API_URL } from "../http";
export const CookiesDelete = () => {
	let cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		let cookie = cookies[i];
		let eqPos = cookie.indexOf("=");
		let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
		document.cookie = name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	}
};
export default class Store {
	user = {} as IUser;
	isAuth = false;
	isLoading = false;
	publicKey = "";
	subscription = {} as any;
	personal = {} as Personal;

	constructor() {
		makeAutoObservable(this, {}, { deep: true });
	}

	setIsLoading(bool: boolean) {
		this.isLoading = bool;
	}

	setAuth(bool: boolean) {
		this.isAuth = bool;
	}

	setUser(user: IUser) {
		this.user = user;
	}

	setPersonal(personal: Personal) {
		this.personal = personal;
	}

	setName(name: string) {
		this.personal.name = name;
	}

	setSurname(surname: string) {
		this.personal.surname = surname;
	}

	setPatronymic(patronymic: string) {
		this.personal.patronymic = patronymic;
	}

	setPhoneNumber(phoneNumber: string) {
		this.personal.phoneNumber = phoneNumber;
	}

	setAvatar(avatar: string) {
		this.personal.avatar = avatar;
	}

	async editSurname(userId: number, surname: string) {
		const response = await AuthService.setSurname(userId, surname);
		this.setSurname(response.data);
	}

	async editName(userId: number, name: string) {
		const response = await AuthService.setName(userId, name);
		this.setName(response.data);
	}

	async editPatronymic(userId: number, patronymic: string) {
		const response = await AuthService.setPatronymic(userId, patronymic);
		this.setPatronymic(response.data);
	}

	async editPhoneNumber(userId: number, phoneNumber: string) {
		const response = await AuthService.setPhoneNumber(userId, phoneNumber);
		this.setPhoneNumber(response.data);
	}

	async editAvatar(formData: FormData) {
		const response = await AuthService.setAvatar(formData);
		this.setAvatar(response.data);
	}

	setSubscription() {}

	async login(email: string, password: string) {
		try {
			const response = await AuthService.login(email, password);
			const keyRes = await AuthService.getPublicKey(response.data.user.id);
			console.log(response.data);
			localStorage.setItem("token", response.data.accessToken);

			this.setAuth(true);
			this.setUser(response.data.user);
			this.setPersonal(response.data.personal);
			console.log(this.user.id);
			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.ready
					.then(async function (registration) {
						if (keyRes.data.publicKey) {
							const pushServerPublicKey = keyRes.data.publicKey;

							const subscription = await registration.pushManager.subscribe({
								userVisibleOnly: true,
								applicationServerKey: pushServerPublicKey,
							});
							console.log(subscription);
							try {
								if (response.data.user.id) {
									const resq = await AuthService.resubscribe(
										subscription,
										response.data.user.id
									);
								}
							} catch (err) {
								console.log(err);
							}
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}

			return {
				status: true,
				message: "ok",
			};
		} catch (err: any) {
			return {
				status: false,
				message: err.response.data.length ? err.response.data[0] : err.response.data.message,
			};
		}
	}

	async registration(email: string, password: string) {
		try {
			const response = await AuthService.registration(email, password);
			const keyRes = await AuthService.getPublicKey(response.data.user.id);
			console.log(response);
			localStorage.setItem("token", response.data.accessToken);

			this.setAuth(true);
			this.setUser(response.data.user);
			this.setPersonal(response.data.personal);
			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.ready
					.then(async function (registration) {
						if (keyRes.data.publicKey) {
							const pushServerPublicKey = keyRes.data.publicKey;

							const subscription = await registration.pushManager.subscribe({
								userVisibleOnly: true,
								applicationServerKey: pushServerPublicKey,
							});

							try {
								const resq = await AuthService.subscription(
									subscription,
									response.data.user.id
								);
								console.log(resq);
							} catch (err) {
								console.log(err);
							}
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}
			return {
				status: true,
				message: "ok",
			};
		} catch (err: any) {
			let erformat = err;

			console.log(err?.response?.data);
			return {
				status: false,
				message: err.response.data.length ? err.response.data[0] : err.response.data.message,
			};
		}
	}

	async logout() {
		try {
			const response = await AuthService.logout();
			console.log(response);
			localStorage.removeItem("token");

			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.ready.then(async (registration) => {
					const sub = await registration.pushManager.getSubscription();
					if (sub) {
						await sub.unsubscribe();
					}
				});
			}

			this.setAuth(false);
			this.setUser({} as IUser);
			this.setPersonal({} as Personal);

			CookiesDelete();
		} catch (err: any) {
			console.log(err?.response?.data);
		}
	}

	async checkAuth() {
		this.setIsLoading(true);
		try {
			const response = await axios.get<AuthResponse>(`${API_URL}/user/refresh`, {
				withCredentials: true,
			});
			const keyRes = await AuthService.getPublicKey(response.data.user.id);

			localStorage.setItem("token", response.data.accessToken);

			this.setAuth(true);
			this.setUser(response.data.user);
			this.setPersonal(response.data.personal);
			return true;
		} catch (err: any) {
			console.log(err?.response?.data);
			return false;
		} finally {
			this.setIsLoading(false);
		}
	}
}
