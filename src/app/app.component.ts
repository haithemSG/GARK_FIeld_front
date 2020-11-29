import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { LangService } from './shared/lang.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
@Injectable()
export class AppComponent implements OnInit, AfterViewInit {
  isMultiColorActive = environment.isMultiColorActive;
  constructor(private langService: LangService, private renderer: Renderer2) {}

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
