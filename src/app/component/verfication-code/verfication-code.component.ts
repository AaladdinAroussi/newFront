import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verfication-code',
  templateUrl: './verfication-code.component.html',
  styleUrls: ['./verfication-code.component.css']
})
export class VerficationCodeComponent implements OnInit {
  
  ngOnInit(): void {
  }
  otpArray = new Array(6); // Tableau pour 6 cases OTP
  otpValues: string[] = new Array(6).fill('');

  moveToNext(index: number, event: any) {
    if (event.target.value.length === 1 && index < this.otpArray.length - 1) {
      document.getElementById(`otp${index + 1}`)?.focus();
    }
  }

  moveToPrev(index: number, event: any) {
    const keyboardEvent = event as KeyboardEvent; // Conversion explicite
    if (!this.otpValues[index] && index > 0 && keyboardEvent.key === "Backspace") {
      document.getElementById(`otp${index - 1}`)?.focus();
    }
  }
  

  submitOTP() {
    const otp = this.otpValues.join('');
    console.log(otp);
  }
  resendCode() {

  }
}
