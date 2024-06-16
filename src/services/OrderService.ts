import $api from "../http";
import { Order } from "../models/IOrder";
import { AddOrderResponse } from "../models/response/AddOrderResponse";

export class OrderService {
  static async addOrder(id: number, formData: FormData) {
    return $api.post<Order>(`/user/addOrder/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async fetchOrders(id: number) {
    return $api.get<Order[]>(`/user/getOrder/${id}`);
  }

  static async fetchAllOrders() {
    return $api.get<Order[]>(`/user/getOrder`);
  }

  static async updateDescr(id: number, description: string) {
    return $api.patch<AddOrderResponse>("/user/updateDescription", {
      id,
      description,
    });
  }
  //operator id
}
