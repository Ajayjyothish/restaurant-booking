import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface User {
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
  user: User;

  constructor(private modalService: NgbModal) {}

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

  onSubmit(newUser: User, valid: boolean): void {
    console.log(newUser, 'valid: ', valid);
    this.resetForm();
  }

  resetForm(): void {
    this.user = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };
  }

  open(content: any): any {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
