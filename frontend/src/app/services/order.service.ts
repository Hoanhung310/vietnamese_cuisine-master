import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ORDERS_OF_USER_URL, ORDERS_URL, ORDER_CREATE_URL, ORDER_NEW_FOR_CURRENT_USER_URL, ORDER_PAY_URL, ORDER_TRACK_URL } from '../shared/constants/urls';
import { Order } from '../shared/models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(ORDERS_URL);
  }

  // testing
  getAllOrdersByUserName(userName: string): Observable<Order[]> {
    return this.http.get<Order[]>(ORDERS_OF_USER_URL + userName);
  }

  // testing
  // getAllOrdersByUserId(userId: number): Observable<Order[]> {
  //   return this.http.get<Order[]>(ORDERS_URL + userId);
  // }

  create(order:Order){
    return this.http.post<Order>(ORDER_CREATE_URL, order);
  }

  // static _orderId:number = 0;
  _orderId:number = 0;

  // public static set orderId(id: number) {
  setOrderId(id: number) {
    this._orderId = id;
  }

  // public static get orderId(): number {
  getOrderId(): number {
    return this._orderId;
  }

  getNewOrderForCurrentUser(orderId: number):Observable<Order>{
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL + orderId);
  }

  pay(order:Order):Observable<string>{
    return this.http.post<string>(ORDER_PAY_URL, order);
  }

  trackOrderById(id:number): Observable<Order>{
    return this.http.get<Order>(ORDER_TRACK_URL + id);
  }

}
