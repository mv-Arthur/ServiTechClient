export interface AddOrderResponse {
	message: string;
}

export interface UnattachType extends AddOrderResponse {
	id: number;
}

export interface UpdatePicture extends UnattachType {
	fileName: string;
}
