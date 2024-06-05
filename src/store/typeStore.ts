import { makeAutoObservable, runInAction } from "mobx";
import { IOrderType, IType } from "../models/IOrderType";
import { OrderTypeService } from "../services/OrderTypeService";
import { AsyncActionReturnType } from "../models/asynActionsReturnType";
import { OrderAdminService } from "../services/OrderAdminService";
import { ErrorModel, orderAdminStore } from "./orderAdminStore";
import { isAxiosError } from "axios";

class TypeStore {
	types = [] as IOrderType[];
	current = {} as IOrderType;
	constructor() {
		makeAutoObservable(this, {}, { deep: true });
	}

	addNewType(type: IOrderType) {
		this.types.push(type);
	}

	firstStepRender(data: IOrderType[]) {
		this.types = [...data];
	}

	deleteTypeById(id: number) {
		this.types = this.types.filter((el) => el.id !== id);
	}

	setCurrent(type: string) {
		const founded = this.types.find((el) => el.type === type);
		if (founded) {
			this.current = founded;
		}
	}

	updateType(id: number, updated: IType) {
		this.types = this.types.map((type) => {
			if (type.id === id) return { ...type, ...updated };
			return type;
		});
	}

	updateTypePicture(id: number, fileName: string) {
		this.types = this.types.map((type) => {
			if (type.id === id) return { ...type, fileName };
			return type;
		});
	}

	async fetchToUpdatePicture(id: number, formData: FormData) {
		try {
			const response = await OrderAdminService.updateTypePicture(id, formData);
			this.updateTypePicture(response.data.id, response.data.fileName);
			orderAdminStore.setSnackBar({ children: response.data.message, severity: "success" });
		} catch (err) {
			if (isAxiosError<ErrorModel>(err)) {
				orderAdminStore.setSnackBar({
					children: err.response?.data.message,
					severity: "error",
				});
			}
		}
	}

	async fetchToUpdateType(id: number, updated: IType) {
		try {
			const response = await OrderAdminService.updateType(id, updated);
			this.updateType(response.data.id, response.data.requestedData);
			orderAdminStore.setSnackBar({ children: response.data.message, severity: "success" });
		} catch (err) {
			if (isAxiosError<ErrorModel>(err)) {
				orderAdminStore.setSnackBar({
					children: err.response?.data.message,
					severity: "error",
				});
			}
		}
	}

	async fetchToDelete(id: number) {
		try {
			const response = await OrderTypeService.deleteById(id);
			this.deleteTypeById(response.data.deletedTypeId);
			orderAdminStore.setSnackBar({ children: response.data.message, severity: "success" });
		} catch (err) {
			if (isAxiosError<ErrorModel>(err)) {
				orderAdminStore.setSnackBar({
					children: err.response?.data.message,
					severity: "error",
				});
			}
		}
	}

	async addNewFetch(formData: FormData): Promise<AsyncActionReturnType> {
		try {
			const response = await OrderTypeService.addType(formData);
			this.addNewType(response.data.data);

			const result: AsyncActionReturnType = {
				message: "Успешно добавлен",
				variant: "success",
			};

			return result;
		} catch (err: any) {
			console.log(err.response.data.message);
			const result: AsyncActionReturnType = {
				message: "непредвиденная ошибка, попробуйте повторить запрос позже",
				variant: "error",
			};

			return result;
		}
	}

	async fetchTypes() {
		try {
			const response = await OrderTypeService.getAll();
			this.firstStepRender(response.data);
		} catch (err: any) {
			console.log(err.response.data.message);
		}
	}
}

export const typeStore = new TypeStore();
