import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ICredentails } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  emailModel = 'stayassine3@gmail.com';
  passwordModel = 'azertysta';

  buttonDisabled = false;
  buttonState = '';

  constructor(
    private notifications: NotificationsService,
    private router: Router,
    private _auth: AuthenticationService
  ) { }

  ngOnInit() {
  }

  userCredentials: ICredentails = {
    email: "",
    password: "",
  }

  onSubmit() {
    if (!this.loginForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
  
    
    this.userCredentials.email = this.emailModel;
    this.userCredentials.password = this.passwordModel;

    this._auth.logIn(this.userCredentials).subscribe(
      (res) => {
          if(res["success"] == true){
            this._auth.saveToken(res["token"]);
            this.router.navigateByUrl(`${environment.adminRoot}/dashboards/analytics`);
          }
      },
      (err) => {
         //res == { message : "system error" }
        this.buttonDisabled = false;
        this.buttonState = '';
        this.notifications.create('Erreur', "Données invalide!", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
      })
      
  }
}
