import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { AjoutCategorie } from './ajout-categorie/ajout-categorie';
import { SortablejsModule } from 'ngx-sortablejs';
import { FormsModule } from '@angular/forms';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PharesComponent } from './phares/phares.component';
import { BoutiqueComponent } from './boutique/boutique.component';
import { CreateTerrainComponent } from './boutique/create-terrain-dialog/create-terrain.component';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';

import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ShowTerrainComponent } from './boutique/show-terrain/show-terrain.component';
import { ImageDialogComponent } from './boutique/show-terrain/image-dialog/image-dialog.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


import { 
  AgendaService, 
  DayService, 
  MonthAgendaService, 
  MonthService, 
  ScheduleModule, 
  TimelineMonthService, 
  TimelineViewsService, 
  WeekService, 
  WorkWeekService ,
  RecurrenceEditorModule
} from '@syncfusion/ej2-angular-schedule';

import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule, CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CompteComponent } from './compte/compte.component';
import { DeleteDialogComponent } from './boutique/delete-dialog/delete-dialog.component';
import { AddReservationComponent } from './terrain/add-reservation/add-reservation.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [
    BlankPageComponent, 
    AppComponent, 
    AjoutCategorie, 
    PharesComponent, 
    BoutiqueComponent, 
    CreateTerrainComponent, 
    ShowTerrainComponent, 
    ImageDialogComponent, 
    CompteComponent, 
    DeleteDialogComponent, 
    AddReservationComponent,
    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    LayoutContainersModule,
    ComponentsStateButtonModule,
    SortablejsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatMenuModule,
    MatCardModule,
    CalendarModule,
    ScheduleModule,
    RecurrenceEditorModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    MatButtonModule,
    BsDropdownModule.forRoot(),
    TimepickerModule.forRoot(),
    ProgressbarModule.forRoot(),
    BootstrapModule,
    DatePickerAllModule, 
    TimePickerAllModule, 
    DateTimePickerAllModule,
    DropDownListAllModule,
    PagesContainersModule,
    SimpleNotificationsModule.forRoot(),
  ],
  entryComponents: [
    CreateTerrainComponent,
    ImageDialogComponent,
    DeleteDialogComponent,
    AddReservationComponent
  ],
  providers: [
    DayService, 
    WeekService, 
    WorkWeekService, 
    MonthService, 
    AgendaService, 
    MonthAgendaService, 
    TimelineViewsService, 
    TimelineMonthService
  ]
})
export class AppModule { }
