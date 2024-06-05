import { AxiosResponse } from "axios";
import $api, { API_URL } from "../http";
import { GetOrders } from "../models/response/OperatorResponse";

export type roleForGetOrdersToOperator = "operator" | "user";

export class OperatorService {
	//operatorId is require in params
	static getOrdersForOperator(
		id: number,
		role: roleForGetOrdersToOperator
	): Promise<AxiosResponse<GetOrders[]>> {
		return $api.get<GetOrders[]>(`/user/orders/?userId=${id}&role=${role}`);
	}
}
