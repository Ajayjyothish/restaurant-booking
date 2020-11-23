import { ForgotpassComponent } from './../forgotpass/forgotpass.component';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from '../signup/signup.component';

interface SigninUser {
  email: string;

  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: SigninUser;
  serverError = '';

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.user = {
      email: '',
      password: '',
    };
  }

  log(x: object): any {
    console.log(x);
  }

  onSubmit(signinUser: SigninUser, valid: boolean): void {
    this.serverError = '';
    this.authService.login(signinUser).subscribe({
      next: (res) => {
        this.authService.setSession(res);
        this.resetForm();
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
        email: '',
        password: '',
      };
    }, 1000);
  }

  open(content: any): any {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  signup(): void {
    this.modalService.dismissAll();
    this.modalService.open(SignupComponent);
  }

  forgot(): void{
    this.modalService.dismissAll();
    this.modalService.open(ForgotpassComponent);
  }

}
