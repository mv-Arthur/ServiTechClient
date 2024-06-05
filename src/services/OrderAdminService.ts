import $api from "../http";
import { AddOrderResponse, UnattachType, UpdatePicture } from "../models/response/AddOrderResponse";
import {
	AttachResponse,
	GetAllOrdersResponse,
	Settings,
	setTypeSettingsBody,
	setTypeSettingsResponse,
} from "../models/response/GetAllOrdersResponse";
import { RoleType } from "../models/RoleType";
import { IType } from "../models/IOrderType";
import { UpdateTypeResponse } from "../models/response/CreateTypeResponse";

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

	static async attachType(userId: number, typeId: number) {
		return $api.post<AttachResponse>("/user/attachType", {
			typeId: typeId,
			userId: userId,
		});
	}

	//typeid is require in param
	static async unattachType(id: number) {
		return $api.delete<UnattachType>(`/user/attachType/${id}`);
	}

	static async updateType(id: number, type: IType) {
		return $api.patch<UpdateTypeResponse>(`/user/types/${id}`, type);
	}

	static async updateTypePicture(id: number, formData: FormData) {
		return $api.patch<UpdatePicture>(`user/typesPciture/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	static async setTypesSetting(body: setTypeSettingsBody) {
		return $api.post<setTypeSettingsResponse>("/user/types/setting", body);
	}

	static async updateTypesSettings(body: setTypeSettingsBody) {
		return $api.patch<setTypeSettingsResponse>("/user/typesSettings", body);
	}
}
