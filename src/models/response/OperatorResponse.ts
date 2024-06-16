import { RoleType } from "../RoleType";

export type StatusType = "pending" | "job" | "resolved" | "rejected";
export interface Order {
  id: number;
  description: string;
  price: string;
  status: StatusType;
  message: string;
  file: string;
  type: string;
  name: string;
  imgName: string;
}

export interface GetOrders extends Order {
  customer: Customer;
  operator: Customer;
  chat: Chat[];
  operatorSettings: OperatorSettings;
}

export interface OperatorSettings {
  fulfillmentTime: string;
  dealPercent: number;
  fineTardiness: number;
  retentionRejection: number;
  totalEarnings: number;
}

export interface Chat {
  id: number;
  time: string;
  text: string;
  type: "action" | "message";
  senderRole: RoleType;
  orderId: number;
}

export interface Customer {
  email: string;
  name: string;
  surname: string;
  patronymic: string;
  phoneNumber: string;
  avatar: string;
}
