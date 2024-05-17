import $api from "../http";
import { AddOrderResponse } from "../models/response/AddOrderResponse";
import { GetAllOrdersResponse } from "../models/response/GetAllOrdersResponse";
import { RoleType } from "../models/RoleType";

export class OrderAdminService {
	static async getAllOrders() {
		return $api.get<GetAllOrdersResponse[]>("/user/getOrder");
	}

	static async setStatus(id: number, status: string) {
		return $api.patch<AddOrderResponse>("/user/setStatus", { id, status });
	}

	static async setPrice(id: number, price: string) {
		return $api.patch<AddOrderResponse>("/user/setPrice", { id, price });
	}

	static async setReport() {
		return $api.post<AddOrderResponse>("/user/acc");
	}

	static async switchRole(id: number, role: RoleType) {
		return $api.post<AddOrderResponse>("/user/switchRole", { role, id });
	}
}
