import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { LangService } from './shared/lang.service';
import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
@Injectable()
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private langService: LangService, 
    private renderer: Renderer2,
    private router : Router,
    private loaderService : NgxUiLoaderService
    ) {}

  ngOnInit() {
    this.langService.init();
    let lang = localStorage.getItem('lang'); 
    let defaultLang = localStorage.getItem('defaultLang');
    if (!lang) {
      localStorage.setItem('lang', 'fr-fr');
    }
    if (!defaultLang) {
      localStorage.setItem('defaultLang', 'fr');
    }

    this.router.events.subscribe(val => {
      if(val instanceof NavigationStart){
        this.loaderService.start();
      }
      if(val instanceof NavigationEnd){
        this.loaderService.stop();
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.addClass(document.body, 'show');
    }, 1000);
    setTimeout(() => {
      this.renderer.addClass(document.body, 'default-transition');
    }, 1500);
  }
}
