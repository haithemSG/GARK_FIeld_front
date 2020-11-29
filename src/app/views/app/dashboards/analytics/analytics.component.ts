import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit {

  constructor(
    private titleService: Title
  ) { }

  options = {
    backgroundColor : "#00f85c"
  };
  ngOnInit() {
    this.titleService.setTitle('Tableau de bord | GARK')
  }

}
