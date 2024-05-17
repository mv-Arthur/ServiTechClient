export interface AddOrder {
	file: string;
	description: string;
	type: string;
}

export interface Order {
	id: number;
	description: string;
	price: string;
	status: string;
	message: string;
	file: string;
	type: string;
	name: string;
	imgName: string;
}
