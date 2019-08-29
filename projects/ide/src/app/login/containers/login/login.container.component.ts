import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Authenticate } from '../../services/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-container',
  templateUrl: './login.container.component.html',
  styleUrls: ['./login.container.component.css'],
})
export class LoginContainerComponent implements OnInit {
  pending: any;
  error: any;
  @Output() outputValue = new EventEmitter<boolean>();

  constructor(private auth: AuthService, 
    private router: Router
  ) {  }

  ngOnInit() {
  }

  onSubmit(obj: Authenticate) {

    this.pending = true;
    this.error = null;
    this.auth.Login(obj).subscribe(
      res => {
        if (res) {
          this.outputValue.emit(true);
          this.router.navigate(['home']);
        }
      },
      error => {
        this.pending = false;
        this.error = error;
        this.router.navigate(['/login']);
      });
  }

}
