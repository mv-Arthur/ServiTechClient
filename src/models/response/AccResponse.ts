export interface GetAllAccResponse {
	id: number;
	revenue: string;
	date: string;
	rejectedQty: string;
	fullfiledQty: string;
	report: AccItem[];
}

export interface AccItem {
	id: number;
	orderId: number;
	name: string;
	surname: string;
	patronymic: string;
	phoneNumber: string;
	orderType: string;
	orderPrice: string;
	userEmail: string;
	orderDescription: string;
	status: string;
	dateUId: number;
}
