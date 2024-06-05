import { Order } from "../IOrder";

export interface GetAllOrdersResponse {
	id: number;
	email: string;
	role: string;
	typeId: number | null;
	order: Order[];
	personal: Personal;
	operatorSettings: Settings | null;
}

export interface Settings extends setTypeSettingsBody {
	id: number;
	totalEarnings: number;
}

export interface setTypeSettingsResponse {
	message: string;
	operatorSettings: Settings;
}

export interface setTypeSettingsBody {
	fulfillmentTime: string;
	dealPercent: number;
	fineTardiness: number;
	retentionRejection: number;
	userId: number;
}

interface Personal {
	name: string;
	surname: string;
	patronymic: string;
	phoneNumber: string;
	avatar: string;
}

export interface AttachResponse {
	typeId: number;
	userId: number;
}
