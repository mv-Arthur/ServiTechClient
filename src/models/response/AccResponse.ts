import { Customer, Order } from "./OperatorResponse";

export interface GetAllAccResponse {
  id: number;
  operator: Customer;
  totalEarnings: number;
  date: string;
  orders: OrdersForAccTwin[];
}

export interface OrdersForAccTwin {
  order: Order;
  customer: Customer;
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
