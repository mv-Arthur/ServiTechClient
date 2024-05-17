import { makeAutoObservable, runInAction } from "mobx";
import { IOrderType } from "../models/IOrderType";
import { OrderTypeService } from "../services/OrderTypeService";
import { AsyncActionReturnType } from "../models/asynActionsReturnType";

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

	async fetchToDelete(id: number): Promise<AsyncActionReturnType> {
		try {
			const response = await OrderTypeService.deleteById(id);
			this.deleteTypeById(response.data.deletedTypeId);
			const result: AsyncActionReturnType = {
				message: "Успешно удален",
				variant: "success",
			};
			return result;
		} catch (err: any) {
			const result: AsyncActionReturnType = {
				message: "непредвиденная ошибка, попробуйте повторить запрос позже",
				variant: "error",
			};

			return result;
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
