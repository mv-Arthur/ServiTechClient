import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = "https://servitechapi-production.up.railway.app";

const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
	return config;
});

$api.interceptors.response.use(
	(config) => {
		return config;
	},
	async (err) => {
		const originalRequest = err.config;
		if (err.response.status === 401 && err.config && !err.config._isRetry) {
			originalRequest._isRetry = true;
			try {
				const response = await axios.get<AuthResponse>(`${API_URL}/user/refresh`, {
					withCredentials: true,
				});
				localStorage.setItem("token", response.data.accessToken);
				return $api.request(originalRequest);
			} catch (err) {
				console.log("НЕ Авторизован");
			}
		}
		throw err;
	}
);

export default $api;
