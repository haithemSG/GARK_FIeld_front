import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { cellDoubleClick, DayService, EventRenderedArgs, EventSettingsModel, MonthService, ScheduleComponent, TimeScaleModel, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule';
import { Terrain } from 'src/app/shared/models/terrain.model';
import { Reservation } from 'src/app/shared/models/reservation.model';
import { TerrainService } from 'src/app/shared/services/terrain.service';
import { ReservationService } from 'src/app/shared/services/reservation.service';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { extend } from '@syncfusion/ej2-base';
import { CalendarComponent } from '@syncfusion/ej2-angular-calendars';
import { NotificationsService, NotificationType } from 'angular2-notifications';

import { loadCldr, L10n } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/fr-CH/ca-gregorian.json';
import * as numbers from 'cldr-data/main/fr-CH/numbers.json';
import * as timeZoneNames from 'cldr-data/main/fr-CH/timeZoneNames.json';
import { CreateTerrainComponent } from '../create-terrain-dialog/create-terrain.component';
import { environment } from 'src/environments/environment';

// Angular CLI 8.0 and above versions
loadCldr(numberingSystems['default'], gregorian['default'], numbers['default'], timeZoneNames['default']);

L10n.load({
  'fr-CH': {
    'schedule': {
      'day': 'journée',
      'week': 'semaine',
      'workWeek': 'Semaine de travail',
      'month': 'Mois',
      'today': 'Aujourd`hui',
      "saveButton": "Sauvgarder",
      "cancelButton": "Annuler",
      "deleteButton": "Supprimer",
      "newEvent": "Nouvelle réseration",
      "editEvent": "Modifier réservation",
      "deleteContent": "Vous êtes sure de vouloir supprimer cette réservation?",
      "deleteEvent": "Supprimer réservation?",
      "cancel": "Annuler",
      "delete": "Supprimer",
    },
    'calendar': {
      'today': 'Aujourd`hui'
    },
  }
});

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Title } from '@angular/platform-browser';
import { isNumeric } from 'rxjs/util/isNumeric';


@Component({
  selector: 'app-show-terrain',
  providers: [DayService, WeekService, WorkWeekService, MonthService, { provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }],
  templateUrl: './show-terrain.component.html',
  styleUrls: ['./show-terrain.component.scss'],
})
export class ShowTerrainComponent implements OnInit {

  @ViewChild('calendar') public calendar: CalendarComponent;
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private terrainService: TerrainService,
    private reservationService: ReservationService,
    private notifications: NotificationsService,
    private modalService: BsModalService,
    private titleService: Title
  ) { }

  isMobile: boolean = false;
  reservataionModal: BsModalRef;
  backend = environment.backend;
  terrainId: string;
  terrain: Terrain;
  isLoading: boolean = true;
  ListTerrain: Terrain[] = new Array<Terrain>();
  nomTerrain: Array<String>;
  terrainSelected;
  reservationList: Array<Reservation> = new Array<Reservation>();

  isNumber: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
    return !isNaN(Number(args['value']));
  };

  public eventSettings: EventSettingsModel = { dataSource: <Object[]>extend([], null, null, true)/*, fields : { 
    subject: { name: 'Name', validation: { required: true } },
    location: { name: 'num', validation: { required: true } },
    startTime: { name: 'StartTime', validation: { required: true } },
    endTime: { name: 'EndTime', validation: { required: true } }
   }  */};

  public showQuickInfo: boolean = false;
  public statusFields: Object = { text: 'Name', value: 'Name' };

  endTime: Date;
  startTime: Date;
  terrainsColors: Array<any> = new Array<any>();
  adminRoot = environment.adminRoot;
  ngOnInit(): void {
    this.titleService.setTitle("Mon terrain | GARK")
    this.route.params.subscribe((params) => {
      if (this.terrainService.openedTerrain._id !== params['id']) {
        this.terrainId = params['id'];
        this.terrainService.findOne(this.terrainId).subscribe((res) => {
          this.terrain = res["terrain"] as Terrain;
          this.terrainSelected = this.terrain.name
          this.titleService.setTitle(this.terrainSelected + " | GARK")
          this.isLoading = false;
          this.adjustImage();
          this.fetchReservationData();
        })
      } else {
        this.terrain = this.terrainService.openedTerrain;
        this.terrainSelected = this.terrain.name;
        this.titleService.setTitle(this.terrainSelected + " | Mon terrain")
        this.adjustImage();
        this.isLoading = false;
        this.fetchReservationData();
      }
      this.terrainService.getAll().subscribe((res)=>{
       
        this.ListTerrain = new Array<Terrain>();
        this.ListTerrain = res["terrain"] as Array<Terrain>;
        console.log(this.ListTerrain);
        
      })
    })
  }

  currentViewMode = "Week"

  adjustImage(){    
    if(!this.terrain.image){
      this.image = "assets/imgs/GarkBanner1.png";
    }else if(this.terrain.image.indexOf("assets") == -1 && this.terrain.image.indexOf(this.backend) == -1){
      this.image  = `${this.backend}/images/terrains/${this.terrain.image}`;
    }else{
      this.image  = `${this.terrain.image}`;
    } 
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    
    if(window.screen.width < 815){
      this.isMobile = true;
    this.currentViewMode = "Day";
    setTimeout(()=>{
      (<HTMLElement> document.getElementById('_nav')).style.display = "none";
      (<HTMLElement>document.querySelector(".e-toolbar-right")).style.display = "none";
    }, 20)
    }
  }

  fetchReservationData(){
    this.reservationService.getTerrainReservations(this.terrain._id).subscribe((res)=>{
      this.reservationList = res["reservations"] as Reservation[];
         
          if(window.screen.width < 815){
            this.currentViewMode = "Day";
            this.isMobile = true;
            // (<HTMLButtonElement> document.getElementById('e-tbr-btn_16')).click();

            try{
              (<HTMLElement> document.getElementById('_nav')).style.display = "none";
              (<HTMLElement>document.querySelector(".e-toolbar-right")).style.display = "none";
            }catch(e){
              setTimeout(()=>{
                (<HTMLElement> document.getElementById('_nav')).style.display = "none";
                (<HTMLElement>document.querySelector(".e-toolbar-right")).style.display = "none";
              }, 20)
            }
            
            this.reservationList = this.reservationList.map((el: Reservation) => {
              el.Subject = el["name"] + " : " + el["num"] || "";
              return el;
            })
            this.timeScale.slotCount = 2;
          }else{
            this.reservationList = this.reservationList.map((el: Reservation) => {
              el.Subject = el["name"] + "<br/>" + el["num"] || "";
              return el;
            })
          }
          this.eventSettings = { dataSource: <Object[]>extend([], this.reservationList, null, true) }; 
    })
  }

  openAddReservationMobile(template?: TemplateRef<any>) {
    (<HTMLElement>document.querySelector('#add-new-reservation')).style.display = "block";
    (<HTMLElement>document.querySelector('#main')).style.display = "none";
    (<HTMLElement>document.querySelector('#fixedbutton')).style.display = "none";
    this.resMobile.Name = "";
    this.resMobile.num = "";
    this.resMobile.frais = 0;
    this.resMobile.StartTime = new Date(new Date().setHours(new Date().getHours() + 1));
    this.resMobile.EndTime = new Date(new Date().setHours(new Date().getHours() + 2));
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  closeModal(template?: TemplateRef<any>){
    // this.reservataionModal.hide()
    (<HTMLElement>document.querySelector('#add-new-reservation')).style.display = "none";
    (<HTMLElement>document.querySelector('#main')).style.display = "block";
    (<HTMLElement>document.querySelector('#fixedbutton')).style.display = "block";
  }
  

  public selectedDate: Object = new Date();

  deposit() {
    this.selectedDate = this.calendar.value;
  }

  image = "";
  openDialog(type: string) {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '800px',
      data: { data: { type, id: this.terrain._id, image: this.terrain.image || "" } }
    });
    dialogRef.afterClosed().subscribe((result : Terrain) => {
      if (result) {
        //console.log("result", result)
        this.terrain.image = result.image;
        if(this.terrain.image.indexOf('assets/') == -1){
          this.image  = `${this.backend}images/terrains/${this.terrain.image}`;
        }else{
          this.image = this.terrain.image;
        }
      }
    });
  }


  public StatusData: Object[] = [
    { StatusText: 'New', Id: 1 },
    { StatusText: 'Requested', Id: 2 },
    { StatusText: 'Confirmed', Id: 3 }
  ];

  public timeScale: TimeScaleModel = { enable: true, interval: 60, slotCount: 1 };

  public dateParser(data: string) {
    return new Date(data);
  }
  // colorsIndex = 0;
  // colors = ['#05BB99','#00F75D', '#01B89A', '#243FDA' ,'#7F38F7', '#F85F73', '#E6E6E6']
  // colorateTerrains = []
  public onEventRendered(args: EventRenderedArgs): void {
    (args.element as HTMLElement).style.backgroundColor = this.terrain.color;
    
    // (args.element as HTMLElement).style.backgroundColor = this.terrainsColors.find((el) => {
    //   return el["nomTerrain"] == (args.data["terrain"]["name"] || args.data["terrain"])
    // })["color"] 
  }

  public onActionBegin(args: { [key: string]: Object }): void {

    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange' || args.requestType === 'eventRemove') {
      let data: any;
      if (args.requestType === 'eventCreate') {

        let reservation = {
          Name: (<any>args.data[0])["Name"],
          num: (<any>args.data[0])["num"],
          frais: (<any>args.data[0])["frais"],
          StartTime: (<any>args.data[0])["StartTime"] as Date,
          EndTime: (<any>args.data[0])["EndTime"] as Date,
          terrain: (<any>args.data[0])["terrain"],
        } as Reservation;

        this.reservationService.create(reservation).subscribe(
          (res) => {
            this.notifications.create('Succès', "Réservation ajoutée avec succès", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
            data = <any>args.data[0];
            if (this.reservationList.length == 0) {
              this.reservationList = new Array<Reservation>();
            }
            let myReservation = res["reservation"] as Reservation;
            myReservation.Subject = myReservation.Name;
            this.reservationList.push(myReservation);


            let last = (this.eventSettings.dataSource as Array<any>).length;
            (this.eventSettings.dataSource as Array<any>)[last - 1]["_id"] = myReservation._id;
            (this.eventSettings.dataSource as Array<any>)[last - 1]["Subject"] = (this.eventSettings.dataSource as Array<any>)[last - 1]["Name"] || (this.eventSettings.dataSource as Array<any>)[last - 1]["name"] + "<br/>" +(this.eventSettings.dataSource as Array<any>)[last - 1]["num"];
            (this.eventSettings.dataSource as Array<any>)[last - 1]["terrain"] = null;
            (this.eventSettings.dataSource as Array<any>)[last - 1]["terrain"] = myReservation.terrain

            this.scheduleObj.eventSettings = this.eventSettings;
            this.scheduleObj.refreshLayout;
            this.scheduleObj.refresh();

          },
          (err) => {
            this.notifications.create('Erreur', "Une erreur a survenue lors de l'ajour", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
          }
        )

      } else if (args.requestType === 'eventChange') {
        data = <any>args.data;
        let reservation = {
          Name: (<any>args.data)["Name"],
          num: (<any>args.data)["num"],
          frais: (<any>args.data)["frais"],
          StartTime: (<any>args.data)["StartTime"] as Date,
          EndTime: (<any>args.data)["EndTime"] as Date,
          terrain: (<any>args.data)["terrain"],
          _id: (<any>args.data)["_id"],
        } as Reservation;
        this.reservationService.updateOne(reservation._id, reservation).subscribe((res) => {
          let updatedRecord = res as Reservation;
          this.reservationList = this.reservationList.filter((el) => {
            if (el["_id"] == updatedRecord["_id"]) {
              el = updatedRecord;
            }
            return el;
          });

          (this.eventSettings.dataSource as Array<any>) = (this.eventSettings.dataSource as Array<any>).filter((el) => {
            if (el["_id"] == updatedRecord["_id"]) {
              el["EndTime"] = updatedRecord.EndTime;
              el["num"] = updatedRecord.num;
              el["frais"] = updatedRecord.frais;
              el["StartTime"] = updatedRecord.StartTime;
              el["Subject"] = updatedRecord["name"] + "<br/>" + updatedRecord["num"] || "";
              if(el["terrain"] instanceof Object){
                el["terrain"]["name"] = updatedRecord.terrain["name"];
              }else{
                el["terrain"] = updatedRecord.terrain["name"];
              }
              
            }
            return el;
          })

          this.notifications.create('Succès', "Réservation mis à jour avec succès", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
          this.scheduleObj.eventSettings = this.eventSettings;
          this.scheduleObj.refreshLayout;
          this.scheduleObj.refresh();
        },
          (err) => {
            this.notifications.create('Erreur', "Une erreur a survenue lors de la mise à jour de la réseravtion", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
          }
        )
      } else if (args.requestType === 'eventRemove') {
        let id = args.deletedRecords[0]["_id"];
        this.reservationService.deleteOne(id).subscribe((res) => {
          (this.eventSettings.dataSource as Array<any>) = (this.eventSettings.dataSource as Array<any>).filter((el) => {
            return el["_id"] != id;
          })
          this.notifications.create('Succès', "Réservation suprimée avec succès", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
        },
          (err) => {
            this.notifications.create('Erreur', "Une erreur a survenue lors de la suppression de la réseravtion", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
          });
        this.scheduleObj.eventSettings = this.eventSettings;
        this.scheduleObj.refreshLayout;
        this.scheduleObj.refresh();
      }
      if (!this.scheduleObj.isSlotAvailable(data.StartTime as Date, data.EndTime as Date) && args.requestType !== 'eventRemove') {
        args.cancel = true;
      }
    }
  }

  openEdit(){
    const dialogRef = this.dialog.open(CreateTerrainComponent, {
      width: '500px',
      data: {terrain: this.terrain, update : true}
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  buttonDisabled = false;
  buttonState = "";
  resMobile = {
    Name: "",
    num : "",
    frais: 0,
    terrain: "",
    StartTime: new Date(new Date().setHours(new Date().getHours() +1)),
    EndTime: new Date(new Date().setHours(new Date().getHours() +2))
  }

  onSubmit(){
    
    if( this.buttonDisabled || this.resMobile.Name == "" || this.resMobile.num == "" || this.resMobile.StartTime == null || this.resMobile.EndTime ==  null){
      return ;
    }
    this.resMobile.terrain = this.terrain.name;
    // console.log(this.resMobile);
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.reservationService.create(this.resMobile).subscribe((res)=>{
      
      this.notifications.create('Succès', "Réservation ajoutée avec succès", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
      this.fetchReservationData();
      this.buttonDisabled = true;
      this.buttonState = "",
      (<HTMLElement>document.querySelector('#add-new-reservation')).style.display = "none";
      (<HTMLElement>document.querySelector('#main')).style.display = "block";
      (<HTMLElement>document.querySelector('#fixedbutton')).style.display = "block";
    })
  }

  minDate = new Date(new Date().setHours(new Date().getHours() +1))
}