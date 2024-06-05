import { makeAutoObservable } from "mobx";
import {
	GetAllOrdersResponse,
	Settings,
	setTypeSettingsBody,
} from "../models/response/GetAllOrdersResponse";
import { OrderAdminService } from "../services/OrderAdminService";
import { RoleType } from "../models/RoleType";
import { isAxiosError } from "axios";
import { AlertProps } from "@mui/material/Alert";

export interface ErrorModel {
	message: string;
	statusCode: string;
}

class OrderAdminStore {
	ordersForUsers = [] as GetAllOrdersResponse[];
	snackbar: Pick<AlertProps, "children" | "severity"> | null = null;

	constructor() {
		makeAutoObservable(this, {}, { deep: true });
	}

	addMany(orders: GetAllOrdersResponse[]) {
		this.ordersForUsers = [...orders];
	}

	deleteFullfiled() {
		this.ordersForUsers = this.ordersForUsers.map((user) => {
			return {
				...user,
				order: user.order.filter((order) => {
					return order.status === "pending" || order.status === "job";
				}),
			};
		});
	}

	setSnackBar(data: Pick<AlertProps, "children" | "severity"> | null) {
		this.snackbar = data;
	}

	attachType(userId: number, typeId: number) {
		this.ordersForUsers = this.ordersForUsers.map((user) => {
			if (user.id === userId) return { ...user, typeId: typeId };
			return user;
		});
	}

	//typeid is require in param
	unattachType(id: number) {
		this.ordersForUsers = this.ordersForUsers.map((user) => {
			if (user.typeId === id) return { ...user, typeId: null };
			return user;
		});
	}

	selectRole(role: RoleType, id: number) {
		this.ordersForUsers.forEach((user) => {
			if (user.id === id) user.role = role;
		});
	}

	setStatus(id: number, status: string) {
		this.ordersForUsers = this.ordersForUsers.map((user) => {
			return {
				...user,
				order: user.order.map((order) => {
					if (order.id === id) return { ...order, status: status };
					return order;
				}),
			};
		});
	}

	setPice(id: number, price: string) {
		this.ordersForUsers = this.ordersForUsers.map((user) => {
			return {
				...user,
				order: user.order.map((order) => {
					if (order.id === id) return { ...order, price: price };
					return order;
				}),
			};
		});
	}

	setSettings(body: Settings) {
		this.ordersForUsers = this.ordersForUsers.map((user) => {
			if (user.id === body.userId) {
				return { ...user, operatorSettings: body };
			}

			return user;
		});
	}

	async fetchToSetSettings(body: setTypeSettingsBody) {
		try {
			const response = await OrderAdminService.setTypesSetting(body);
			this.setSettings(response.data.operatorSettings);
			this.setSnackBar({ children: response.data.message, severity: "success" });
		} catch (err) {
			if (isAxiosError<ErrorModel>(err)) {
				this.setSnackBar({ children: err.response?.data.message, severity: "error" });
			}
		}
	}

	async fetchToUpdateSettings(body: setTypeSettingsBody) {
		try {
			const response = await OrderAdminService.updateTypesSettings(body);
			this.setSettings(response.data.operatorSettings);
			this.setSnackBar({ children: response.data.message, severity: "success" });
		} catch (err) {
			if (isAxiosError<ErrorModel>(err)) {
				this.setSnackBar({ children: err.response?.data.message, severity: "error" });
			}
		}
	}

	//typeid is require in param
	async fetchToUnattach(id: number) {
		try {
			const response = await OrderAdminService.unattachType(id);
			this.unattachType(response.data.id);
			this.setSnackBar({ children: response.data.message, severity: "success" });
		} catch (err) {
			if (isAxiosError<ErrorModel>(err)) {
				this.setSnackBar({ children: err.response?.data.message, severity: "error" });
			}
		}
	}

	async fetchToAttach(userId: number, typeId: number) {
		try {
			const response = await OrderAdminService.attachType(userId, typeId);

			this.attachType(response.data.userId, response.data.typeId);
			this.setSnackBar({ children: "успешно прикреплен", severity: "success" });
		} catch (err) {
			if (isAxiosError<ErrorModel>(err)) {
				this.setSnackBar({ children: err.response?.data.message, severity: "error" });
			}
		}
	}

	async fetchToSelectRole(role: RoleType, id: number) {
		try {
			const response = await OrderAdminService.switchRole(id, role);
			this.selectRole(role, id);
		} catch (err) {
			console.log(err);
		}
	}

	async fetchToSetStatus(id: number, status: string) {
		try {
			const response = await OrderAdminService.setStatus(id, status);
			this.setStatus(id, status);
		} catch (err) {
			console.log(err);
		}
	}

	async fetchToSetPrice(id: number, price: string) {
		try {
			const response = await OrderAdminService.setPrice(id, price);
			this.setPice(id, price);
		} catch (err) {
			console.log(err);
		}
	}

	async fetchingOrders() {
		try {
			const response = await OrderAdminService.getAllOrders();
			this.addMany(response.data);

			return response;
		} catch (err) {
			console.log(err);
		}
	}

	async setReport() {
		try {
			await OrderAdminService.setReport();
			this.deleteFullfiled();
		} catch (err) {
			console.log(err);
		}
	}
}

export const orderAdminStore = new OrderAdminStore();
