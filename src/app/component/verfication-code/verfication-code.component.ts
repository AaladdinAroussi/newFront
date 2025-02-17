import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verfication-code',
  templateUrl: './verfication-code.component.html',
  styleUrls: ['./verfication-code.component.css']
})
export class VerficationCodeComponent implements OnInit {
  otpArray: number[] = new Array(6); // Array for 6 OTP input fields
  otpValues: string[] = new Array(6).fill(''); // Initialize with empty strings
  phone!: string; // Use definite assignment assertion
  userId!: string; // Added userId property
  errorMessage: string = ''; // Property to hold error message
  timer: number = 30; // Timer starting value
  timerInterval: any; // Variable to hold the timer interval
  timerExpired: boolean = false; // Flag to check if timer has expired

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Retrieve the phone number and userId from session storage
    const storedPhone = sessionStorage.getItem('phone');
    const storedUserId = sessionStorage.getItem('userId');

    if (storedPhone && storedUserId) {
      this.phone = storedPhone; // Store the phone number
      this.userId = storedUserId; // Store the userId
    } else {
      this.errorMessage = "Phone number or User ID is missing!";
      this.router.navigate(['/signup']); // Redirect to signup or another appropriate page
    }

    // Start the timer
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.timerInterval);
        this.timerExpired = true; // Set the flag to true when timer expires
      }
    }, 1000);
  }

  isOTPComplete(): boolean {
    return this.otpValues.every(value => value.length === 1); // Check if all fields are filled
  }

  validateOTP(): void {
    if (this.otpValues.some(value => value.length === 0)) {
      this.errorMessage = "Please fill all fields."; // Set the error message
    } else {
      this.errorMessage = ''; // Clear the error message if all fields are filled
    }
  }

  moveToNext(index: number, event: any) {
    if (event.target.value.length === 1 && index < this.otpArray.length - 1) {
      document.getElementById(`otp${index + 1}`)?.focus();
    }
  }

  moveToPrev(index: number, event: any) {
    const keyboardEvent = event as KeyboardEvent; // Explicit conversion
    if (!this.otpValues[index] && index > 0 && keyboardEvent.key === "Backspace") {
      document.getElementById(`otp${index - 1}`)?.focus();
    }
  }

  onInputChange(index: number, event: any) {
    const inputValue = event.target.value;

    // Check if the input value is a digit
    if (/^\d*$/.test(inputValue)) {
      // Update the otpValues array only if the input is valid
      this.otpValues[index] = inputValue;

      // Move to the next input if the current input is filled
      if (inputValue.length === 1) {
        this.moveToNext(index, event);
      }
    } else {
      // If the input is invalid, clear the field and do not move to the next input
      event.target.value = ''; // Clear the input field
      this.otpValues[index] = ''; // Clear the corresponding value in otpValues
    }
  }

  submitOTP() {
    this.validateOTP(); // Validate OTP fields before submission
    if (this.errorMessage) {
      return; // Stop submission if there's an error
    }
  
    const otp = this.otpValues.join('');
    console.log('Submitting OTP:', otp);
  
    // Call the verification API
    this.authService.verifyMobileCode(this.phone, otp).subscribe(
      response => {
        console.log('Verification successful:', response);
        this.errorMessage = ''; // Clear any previous error message
  
        // If verification is successful, attempt to log in using phone and password
        const storedPhone = sessionStorage.getItem('phone');
        const storedPassword = sessionStorage.getItem('password'); // Assuming you have the password stored in sessionStorage
        
        if (storedPhone && storedPassword) {
          const loginRequest = {
            login: storedPhone,
            password: storedPassword
          };
  
          // Call signIn method with the phone and password
          this.authService.signIn(loginRequest).subscribe(
            (loginResponse: any) => {
              console.log('Login successful:', loginResponse);
              localStorage.setItem('userconnect', JSON.stringify(loginResponse));
              localStorage.setItem('token', loginResponse.accessToken);
              localStorage.setItem('refreshtoken', loginResponse.refreshToken);
              localStorage.setItem('state', '0');
  
              const userConnect = localStorage.getItem("userconnect");
  
              if (userConnect) {
                const user = JSON.parse(userConnect);
                const roles = user.roles;
                if (roles) {
                  console.log('User roles:', roles);
                  if (roles.includes('ROLE_ADMIN')) {
                    window.location.href = 'http://localhost:4200/home';
                  } else {
                    this.router.navigateByUrl('/home');
                  }
                }
              }
  
              // SweetAlert success message
              Swal.fire({
                title: 'Account Confirmed!',
                text: 'You are successfully logged in.',
                icon: 'success',
                confirmButtonText: 'OK'
              });
  
              this.router.navigate(['/home']); 
            },
            error => {
              console.error('Login failed:', error);
              Swal.fire("Error", error.error || "Invalid credentials", "error");
            }
          );
        } else {
          Swal.fire("Error", "Phone or password not found in session storage.", "error");
        }
      },
      error => {
        console.error('Verification failed:', error);
        this.errorMessage = "Invalid verification code!"; // Set the error message
      }
    );
  }
  
  

  resendCode() {
    this.authService.resendVerificationCode(this.userId).subscribe(
      (response: any) => {
        console.log('Verification code resent:', response.message); // Access the message from the response
        this.errorMessage = ''; // Clear any previous error message
        this.timer = 30; // Reset the timer
        this.startTimer(); // Restart the timer
        this.timerExpired = false; // Reset the timer expired flag
      },
      error => {
        console.error('Error resending verification code:', error);
        this.errorMessage = error.error ? error.error : "Could not resend verification code!"; // Show error message from response
      }
    );
}

}
