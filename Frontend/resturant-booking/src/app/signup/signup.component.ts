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
  user: User = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

  @ViewChild('userForm') form: any;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  log(x: object): any {
    console.log(x);
  }

  onSubmit(): void {
    console.log(this.user);
    this.resetForm();
  }

  resetForm(): void{
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
