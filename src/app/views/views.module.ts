import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewRoutingModule } from './views.routing';
import { SharedModule } from '../shared/shared.module';
import { ComponentsCarouselModule } from 'src/app/components/carousel/components.carousel.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { HeadroomModule } from '@ctrl/ngx-headroom';
import { HomeComponent } from './home/home.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { ComponentsStateButtonModule } from '../components/state-button/components.state-button.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    ComponentsStateButtonModule,
    ViewRoutingModule,
    SharedModule,
    ComponentsCarouselModule,
    MatButtonModule,
    TabsModule.forRoot(),
    HeadroomModule,
    MatProgressBarModule,
    ScrollToModule.forRoot()
  ]
})
export class ViewsModule { }
