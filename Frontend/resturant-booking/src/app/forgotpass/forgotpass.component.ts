import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface User {
  email: string;
}
@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css'],
})
export class ForgotpassComponent implements OnInit {
  user: User;
  serverError = '';

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = {
      email : '',
    };
  }

  onSubmit(phone: object): void {
    this.serverError = '';
    this.authService.forgotPassword(phone).subscribe({
      next: (data) => {
        console.log('Data:', data.message);
        alert(data.message);
        this.activeModal.close();
      },
      error: (error) => {
        console.log('There was an error: ', error.error);
        if (error.status === 403) {
          this.serverError = error.error;
        }
      },
    });
  }
}
