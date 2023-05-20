import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {
  profileForm!: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router) {
  }

  ngOnInit(): void {
    let { name, email, address } = this.userService.currentUser;
    this.profileForm = this.formBuilder.group({
      name: [name, Validators.required],
      email: [email, Validators.required],
      address: [address, Validators.required]
    });
  }

  get fc() {
    return this.profileForm.controls;
  }
}
