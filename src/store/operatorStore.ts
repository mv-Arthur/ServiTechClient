import { makeAutoObservable } from "mobx";
import {
  Chat,
  GetOrders,
  StatusType,
} from "../models/response/OperatorResponse";
import {
  OperatorService,
  roleForGetOrdersToOperator,
} from "../services/OperatorService";
import { AlertProps } from "@mui/material/Alert";
import { isAxiosError } from "axios";
import { ErrorModel } from "./orderAdminStore";
import { Socket } from "socket.io-client";
class OperatorStore {
  orders = [] as GetOrders[];
  snackbar: Pick<AlertProps, "children" | "severity"> | null = null;
  socket: Socket | null = null;
  constructor() {
    makeAutoObservable(this, {}, { deep: true });
  }
  setSocket(socket: Socket) {
    this.socket = socket;
  }
  setSnackBar(data: Pick<AlertProps, "children" | "severity"> | null) {
    this.snackbar = data;
  }

  setOrders(orders: GetOrders[]) {
    this.orders = orders;
  }

  setStatus(orderId: number, status: string, message: string) {
    this.orders = this.orders.map((order) => {
      if (order.id === orderId) {
        const obj = {
          ...order,
          status: status as StatusType,
          message: message,
        };
        return obj;
      }
      return order;
    });
  }

  setTime(orderId: number, countvalue: string) {
    this.orders.forEach((order) => {
      if (orderId === order.id) {
        order.operatorSettings.fulfillmentTime = countvalue;
      }
    });
  }

  setPrice(orderId: number, price: string) {
    this.orders = this.orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, price: price };
      }
      return order;
    });
  }

  addMessage(orderId: number, message: Chat) {
    this.orders.forEach((order) => {
      if (order.id === orderId) {
        order.chat.push(message);
      }
    });
  }

  clear() {
    this.orders = this.orders.filter((order) => {
      return order.status !== "rejected" && order.status !== "resolved";
    });
  }

  //operatorId in params is require
  async fetchToSetOrders(id: number, role: roleForGetOrdersToOperator) {
    try {
      const response = await OperatorService.getOrdersForOperator(id, role);
      this.setOrders(response.data);
    } catch (err) {
      if (isAxiosError<ErrorModel>(err)) {
        this.setSnackBar({
          children: err.response?.data.message,
          severity: "error",
        });
      }
    }
  }

  async fetchToReport(operatorId: number) {
    try {
      const response = await OperatorService.fetchToReport(operatorId);
      this.clear();
      this.setSnackBar({
        children: response.data.message,
        severity: "success",
      });
    } catch (err) {
      if (isAxiosError<ErrorModel>(err)) {
        this.setSnackBar({
          children: err.response?.data.message,
          severity: "error",
        });
      }
    }
  }
}

export const operatorStore = new OperatorStore();
