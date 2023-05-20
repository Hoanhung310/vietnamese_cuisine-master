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
  orders: Order[] = [];
  userName = "";
  userId = "";

  // constructor(private formBuilder: FormBuilder,
  //   private userService: UserService,
  //   private toastrService: ToastrService,
  //   private router: Router) {
  // }

  constructor(private orderService: OrderService,
    private userService: UserService,
    activatedRoute: ActivatedRoute) {
    let ordersObservable: Observable<Order[]>;
    // activatedRoute.params.subscribe((params) => {
      ordersObservable = orderService.getAllOrders();
      // ordersObservable = orderService.getAllOrdersByUserName(this.userName);

      ordersObservable.subscribe((serverOrders) => {
        this.orders = serverOrders;
      })

    // })
    
  }

  ngOnInit(): void {
    let { name, id } = this.userService.currentUser;
    name = this.userName;
    id = this.userId;
  }
}
