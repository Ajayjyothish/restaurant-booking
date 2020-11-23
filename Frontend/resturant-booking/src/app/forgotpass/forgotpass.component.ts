import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent implements OnInit {

  phone: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.phone = '';
  }

  onSubmit(phone: string): void {
    console.log(phone);
  }
}
