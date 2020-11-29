import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() options = {};
  player;
  constructor() { }

  ngAfterContentInit() {
   
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

  ngOnInit() {
  }

}
