import { makeAutoObservable } from "mobx";
import { Order } from "../models/IOrder";
import { OrderService } from "../services/OrderService";
import { AsyncActionReturnType } from "../models/asynActionsReturnType";
import { AxiosError } from "axios";

class OrderStore {
	orders = [] as Order[];

	constructor() {
		makeAutoObservable(this, {}, { deep: true });
	}

	addOrder(order: Order) {
		this.orders.push(order);
	}

	addFetchedOrders(orders: Order[]) {
		this.orders = [...orders];
	}

	editOrderDescr(orderId: number, descr: string) {
		this.orders.forEach((order) => {
			if (order.id === orderId) order.description = descr;
		});
	}

	async fetchOrders(userId: number) {
		try {
			const orders = await OrderService.fetchOrders(userId);
			this.addFetchedOrders(orders.data);
		} catch (err) {
			console.log(err);
		}
	}

	async fetchAddOrder(userId: number, formData: FormData): Promise<AsyncActionReturnType> {
		try {
			const response = await OrderService.addOrder(userId, formData);
			this.addOrder(response.data);
			const result: AsyncActionReturnType = {
				message: "заказ успешно отправлен",
				variant: "success",
			};
			return result;
		} catch (err: any) {
			console.log(err);
			const result: AsyncActionReturnType = {
				message: err.response.data.message,
				variant: "error",
			};
			return result;
		}
	}

	async fetchUpdateDescr(id: number, description: string) {
		try {
			const response = await OrderService.updateDescr(id, description);
			this.editOrderDescr(id, description);
		} catch (err) {
			console.log(err);
		}
	}
}

export const orderStore = new OrderStore();
