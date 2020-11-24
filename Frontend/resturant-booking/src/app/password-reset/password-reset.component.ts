import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface User {
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent implements OnInit {
  user: User;
  serverError = '';
  resetToken = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.resetToken = params.token;
      console.log(this.resetToken);
    });
  }

  ngOnInit(): void {
    this.user = {
      password: '',
      confirmPassword: '',
    };
  }

  onSubmit(user): void {
    this.serverError = '';
    const reqBody = {
      resetToken: this.resetToken,
      newPassword: user.password,
    };
    this.authService.newPassword(reqBody).subscribe({
      next: (data) => {
        console.log('Data: ', data);
        this.router.navigate(['home']);
      },
      error: (error) => {
        console.log('There was an error', error.error);
        if (error.status === 400) {
          this.serverError = error.error;
        }
      },
    });
  }
}
