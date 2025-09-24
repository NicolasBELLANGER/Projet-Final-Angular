import { Injectable } from '@angular/core';
import { Order } from '../models/orders.models';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly allOrders = 'allOrders';
  private userOrders = (userId: number) => `userOrders:${userId}`;

  addOrder(order: Order): void {
    const all = this.getAllOrders();
    all.push(order);
    localStorage.setItem(this.allOrders, JSON.stringify(all));

    const mine = this.getAllOrdersByUserId(order.userId);
    mine.push(order);
    localStorage.setItem(this.userOrders(order.userId), JSON.stringify(mine));
  }

  getAllOrders(): Order[] {
    const all = localStorage.getItem(this.allOrders);
    return all ? (JSON.parse(all) as Order[]) : [];
  }

  getAllOrdersByUserId(userId: number): Order[] {
    const all = localStorage.getItem(this.userOrders(userId));
    return all ? (JSON.parse(all) as Order[]) : [];
  }
}
