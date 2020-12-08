import { RestaurantsService } from './../restaurants.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


interface SignupUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  user: SignupUser;
  serverError = '';

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private restaurantService: RestaurantsService
  ) {}

  ngOnInit(): void {
    this.user = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };
  }

  log(x: object): any {
    console.log(x);
  }

  onSubmit(newUser: SignupUser, valid: boolean): void {
    console.log(newUser, 'valid: ', valid);
    this.serverError = '';
    this.restaurantService.postUser(newUser).subscribe({
      next: (data) => {
        this.resetForm();

        console.log('This is next: ', data);
      },
      error: (error) => {
        console.error('There was an error: ', error.error);
        if (error.status === 403) {
          this.serverError = error.error;
        }
      },
    });
  }

  resetForm(): void {
    this.modalService.dismissAll();
    setTimeout(() => {
      this.user = {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      };
    }, 1000);
  }

  open(content: any): any {
    this.modalService.open(content, { windowClass: 'my-class', size: 'xl'});
  }
}
