import { IOrderType, IType } from "../IOrderType";

export interface CreateTypeResponse {
	message: string;
	data: IOrderType;
}

export interface UpdateTypeResponse {
	message: string;
	id: number;
	requestedData: IType;
}
