import { Injectable } from '@angular/core';
import { Order } from '../models/orders.models';

@Injectable({
  providedIn: 'root',
})

export class OrdersService {
    private readonly allOrders = 'allOrders';
    private userOrders = (userId: number) => `userOrders:${userId}`;

    getAllOrders(): Order[] {
        const all = localStorage.getItem(this.allOrders);
        return all ? JSON.parse(all) as Order[] : [];
    }

    getAllOrdersByUserId(userId: number): Order[] {
        const all = localStorage.getItem(this.userOrders(userId));
        return all ? JSON.parse(all) as Order[] : [];
    }
}