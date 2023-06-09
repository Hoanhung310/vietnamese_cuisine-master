import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { IUserUpdate } from 'src/app/shared/interfaces/IUserUpdate';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {
  profileForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

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

  submit(){
    this.isSubmitted = true;
    if(this.profileForm.invalid) return;

    const fv= this.profileForm.value;
    const user :IUserUpdate = {
      name: fv.name,
      email: fv.email,
      address: fv.address
    };

    this.userService.update(user).subscribe(_ => {
      this.router.navigateByUrl(this.returnUrl);
    })
  }
}
