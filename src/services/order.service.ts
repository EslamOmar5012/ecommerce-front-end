import { axiosClient } from "../core/api/axiosClient";
import {
  CashOrderResponse,
  CreateOrderDto,
  Order,
  OrderStatus,
  PaymobOrderResponse,
} from "../domain/order.types";

export const orderService = {
  async createCashOrder(data: CreateOrderDto): Promise<CashOrderResponse> {
    const res = await axiosClient.post<CashOrderResponse>("/orders/cash", data);
    return res.data;
  },

  async createPaymobOrder(data: CreateOrderDto): Promise<PaymobOrderResponse> {
    const res = await axiosClient.post<PaymobOrderResponse>(
      "/orders/paymob",
      data,
    );
    return res.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await axiosClient.get("/orders/my-orders");
    const raw = res.data;
    // Backend returns { message, orders: [...] }
    return Array.isArray(raw) ? raw : raw.orders || raw.data || [];
  },

  async getAllOrders(): Promise<Order[]> {
    const res = await axiosClient.get("/orders/admin/all");
    const raw = res.data;
    return Array.isArray(raw) ? raw : raw.orders || raw.data || [];
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await axiosClient.get(`/orders/${id}`);
    // Backend returns { message, order }
    return res.data.order || res.data.data || res.data;
  },

  async cancelOrder(id: string): Promise<{ message: string }> {
    const res = await axiosClient.post(`/orders/${id}/cancel`);
    return res.data;
  },

  async refundOrder(
    id: string,
    refundReason?: string,
  ): Promise<{ message: string }> {
    const res = await axiosClient.post(`/orders/${id}/refund`, {
      refundReason,
    });
    return res.data;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await axiosClient.patch(`/orders/${id}/status`, { status });
    // Backend returns { message, order }
    return res.data.order || res.data.data || res.data;
  },
};
