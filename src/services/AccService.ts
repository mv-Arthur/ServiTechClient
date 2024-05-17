import { AxiosResponse } from "axios";
import $api from "../http";
import { GetAllAccResponse } from "../models/response/AccResponse";
import { OrgResponse } from "../models/response/OrgResponse";
import { AddOrderResponse } from "../models/response/AddOrderResponse";

export class AccService {
	static async getAllAcc(): Promise<AxiosResponse<GetAllAccResponse[]>> {
		return $api.get("/user/acc");
	}

	static async getOrg(id: number): Promise<AxiosResponse<OrgResponse>> {
		return $api.get(`/user/setOrganization/${id}`);
	}

	static async editOrg(orgData: OrgResponse): Promise<AxiosResponse<OrgResponse>> {
		return $api.patch("/user/setOrganization", { ...orgData });
	}

	static async editAvatar(fromData: FormData): Promise<AxiosResponse<string>> {
		return $api.patch("/user/setOrgAvatar", fromData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
}
