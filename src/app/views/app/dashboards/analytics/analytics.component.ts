import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { MessagingService } from 'src/app/shared/services/messaging.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  constructor(
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
  ) { }


  options = {
    backgroundColor: "#00f85c"
  };

  notificationProfileSubscribtion: Subscription;

  ngOnInit() {
    this.titleService.setTitle('Tableau de bord | GARK');
    this.notificationProfileSubscribtion = this.authenticationService.getNotificationToken().subscribe((res) => {
      if (res["token"] == "") {
        this.managePushNotificationToken();
      } else {
        const myToken = res["token"];
        this.messagingService.checkTokenisValid(myToken).subscribe(
          (res) => {
            if (res["failure"] == 1) {
              //refresh token in backend
              this.managePushNotificationToken();
            }else{
              console.log("awesome all is good")
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.notificationProfileSubscribtion.unsubscribe();
  }

  private managePushNotificationToken() {
    this.messagingService.requestPermission().subscribe(res => {
      if (res) {
        this.authenticationService.assignNotificationToken(res as string).subscribe(
          (token) => {
          });
      }
    })
  }

}
