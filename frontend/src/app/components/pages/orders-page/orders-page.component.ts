import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent {
  orders!: Order[];

  constructor(private orderService: OrderService,
    private userService: UserService,
    activatedRoute: ActivatedRoute) {
    let ordersObservable: Observable<Order[]>;
    activatedRoute.params.subscribe((params) => {
      //get all orders
      // ordersObservable = orderService.getAllOrders();

      // ordersObservable.subscribe((serverOrders) => {
      //   this.orders = serverOrders;
      // })
      //get all orders of user
      if(params.userName){
          ordersObservable = orderService.getAllOrdersByUserName(params.userName);

          ordersObservable.subscribe((serverOrders) => {
          this.orders = serverOrders;
        })
      }

    })
    
  }
}
