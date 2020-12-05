import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { ViewsModule } from './views/views.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { LayoutContainersModule } from './containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { HomePageComponent } from './home-page/home-page.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ComponentsStateButtonModule } from './components/state-button/components.state-button.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ViewsModule,
    AppRoutingModule,
    LayoutContainersModule,
    BrowserAnimationsModule, 
    HttpClientModule,
    NgxUiLoaderModule,
    ScrollToModule.forRoot(),
    ComponentsStateButtonModule
  ],
  declarations: [AppComponent, HomePageComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
