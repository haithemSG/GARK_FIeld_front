import {
  Component,
  OnInit,
  Renderer2,
  OnDestroy,
  HostListener,
  ElementRef,
} from "@angular/core";
import { Router } from '@angular/router';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private renderer: Renderer2, 
    private elRef: ElementRef,
    private scrollToService: ScrollToService,
    public auth: AuthenticationService,
    private router: Router
    ) {}

  showMobileMenu = false;
  year : number = 2020;
  userRoot = '/user/login';
  adminRoot = environment.adminRoot;
  
  ngOnInit() {
    // this.renderer.addClass(document.body, "no-footer");
    this.year = new Date().getFullYear();
   this.isMobile= window.screen.width < 527 ? true : false;
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, "no-footer");
  }

  isMobile: boolean = false;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.isMobile= window.screen.width < 527 ? true : false;
    // const homeRect = this.elRef.nativeElement
    //   .querySelector(".home-row")
    //   .getBoundingClientRect();

    // const homeSection = this.elRef.nativeElement.querySelector(
    //   ".landing-page .section.home"
    // );
    // homeSection.style.backgroundPositionX = homeRect.x - 580 + "px";

    // const footerSection = this.elRef.nativeElement.querySelector(
    //   ".landing-page .section.footer"
    // );
    // footerSection.style.backgroundPositionX = event.target.innerWidth - homeRect.x - 1920 + "px";

    // if (event.target.innerWidth >= 992) {
    //   this.renderer.removeClass(
    //     this.elRef.nativeElement.querySelector(".landing-page"),
    //     "show-mobile-menu"
    //   );
    // }
  }

  @HostListener("window:click", ["$event"])
  onClick(event) {
    this.showMobileMenu = false;
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event) {
    this.showMobileMenu = false;
  }

  buttonDisabled = false;
  buttonState = '';

  goLogin(){
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    if(this.auth.isAuthenticated){
      this.router.navigateByUrl(this.adminRoot)
    }else{
      this.router.navigateByUrl('/user/login')
    }
    
  }

  scrollTo(target) {
    const config: ScrollToConfigOptions = {
      target,
      offset: -150
    };

    this.scrollToService.scrollTo(config);
  }
}
