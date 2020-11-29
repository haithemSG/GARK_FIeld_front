import { Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { cellDoubleClick, DayService, EventRenderedArgs, EventSettingsModel, MonthService, ScheduleComponent, TimeScaleModel, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule';
import { Terrain } from 'src/app/shared/models/terrain.model';
import { Reservation } from 'src/app/shared/models/reservation.model';
import { TerrainService } from 'src/app/shared/services/terrain.service';
import { ReservationService } from 'src/app/shared/services/reservation.service';

import { extend } from '@syncfusion/ej2-base';
import { CalendarComponent } from '@syncfusion/ej2-angular-calendars';
import { NotificationsService, NotificationType } from 'angular2-notifications';

import { loadCldr, L10n } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/fr-CH/ca-gregorian.json';
import * as numbers from 'cldr-data/main/fr-CH/numbers.json';
import * as timeZoneNames from 'cldr-data/main/fr-CH/timeZoneNames.json';
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
import { CreateTerrainComponent } from '../boutique/create-terrain-dialog/create-terrain.component';
import { ImageDialogComponent } from '../boutique/show-terrain/image-dialog/image-dialog.component';
import { Title } from '@angular/platform-browser';
import { AddReservationComponent } from '../terrain/add-reservation/add-reservation.component';


@Component({
  selector: 'app-phares',
  templateUrl: './phares.component.html',
  styleUrls: ['./phares.component.scss']
})
export class PharesComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') public calendar: CalendarComponent;
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private terrainService: TerrainService,
    private reservationService: ReservationService,
    private notifications: NotificationsService,
    private modalService: BsModalService,
    private titleService: Title,
    public AddReservationDialog: MatDialog
  ) { }
  ngOnDestroy(): void {
  }

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


  public eventSettings: EventSettingsModel = { dataSource: <Object[]>extend([], null, null, true) };
  public showQuickInfo: boolean = false;
  public statusFields: Object = { text: 'Name', value: 'Name' };

  endTime: Date;
  startTime: Date;
  terrainsColors: Array<any> = new Array<any>();
  ngOnInit(): void {
    this.titleService.setTitle("Mon Agenda");
    this.route.params.subscribe((params) => {
      if (this.terrainService.openedTerrain._id !== params['id']) {
        this.terrainId = params['id'];
        this.fetchData();
      } else {
        this.terrain = this.terrainService.openedTerrain;
      }
      this.terrainService.getAll().subscribe(
        (res) => {
          this.ListTerrain = res["terrain"] as Terrain[];
          this.nomTerrain = this.ListTerrain.map((el: Terrain) => {
            return el.name;
          })
        },
        (err) => { },
        () => {
          this.fetchData();
        }
      )
    })
  }

  currentViewMode = "Week"
  fetchData() {
    this.reservationService.getAll().subscribe((res) => {
      this.reservationList = res["reservations"] as Reservation[];
      this.reservationList = this.reservationList.map((el: Reservation) => {
        el.Subject = el["name"] + "<br/>" + el["num"] || "";
        return el;
      })
      let i = 0;
      // this.reservationList.forEach((el: Reservation) => {

      //   if (this.terrainsColors.length == 0) {
      //     this.terrainsColors.push({ nomTerrain: el.terrain["name"], color: this.colors[0] })
      //   } else {
      //     let terrainExist = this.terrainsColors.find((terrainCouleur) => {
      //       return terrainCouleur["nomTerrain"] == el.terrain["name"];
      //     })
      //     if (!terrainExist) {
      //       i++;
      //       this.terrainsColors.push({ nomTerrain: el.terrain["name"], color: this.colors[i] })
      //     }
      //   }

      //   this.isLoading = false;
      // })

      this.isLoading = false


      if (window.screen.width < 815) {
        this.isMobile = true;
        this.currentViewMode = "Day";
        try{
          (<HTMLElement>document.getElementById('_nav')).style.display = "none";
          (<HTMLElement>document.querySelector(".e-toolbar-right")).style.display = "none";
        }catch(e){
          try{
            (<HTMLElement>document.querySelector(".e-toolbar-right")).style.display = "none";
            setTimeout(()=>{
              (<HTMLElement>document.getElementById('_nav')).style.display = "none";
            }, 200)
          }catch(e){
            setTimeout(()=>{
              (<HTMLElement>document.getElementById('_nav')).style.display = "none";
              (<HTMLElement>document.querySelector(".e-toolbar-right")).style.display = "none";
            }, 200)
          }
        }
      }
      this.eventSettings = { dataSource: <Object[]>extend([], this.reservationList, null, true) };

    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    if (window.screen.width < 815) {
      this.isMobile = true;
      this.currentViewMode = "Day";
      setTimeout(() => {
        (<HTMLElement>document.getElementById('_nav')).style.display = "none";
        (<HTMLElement>document.querySelector(".e-toolbar-right")).style.display = "none";
      }, 20)
    }
  }

  openAddReservationMobile(template?: TemplateRef<any>) {
    // this.reservataionModal = this.modalService.show(template,
    //   {
    //     class: 'modal-dialog-centered'
    //   });
    // const dialog = this.AddReservationDialog.open(AddReservationComponent, {
    //   width: '500px',s
    //   data: {listTerrain: this.nomTerrain, multiple: true}
    // })

    // dialog.afterClosed().subscribe((result)=>{
    //   if(result){
    //     this.fetchData();
    //   }
    // })


    (<HTMLElement>document.querySelector('#main')).style.display = "none";
    (<HTMLElement>document.querySelector('#fixedbutton')).style.display = "none";
    (<HTMLElement>document.querySelector('#add-new-reservation')).style.display = "block";
    this.resMobile.Name = "";
    this.resMobile.num = "";
    this.resMobile.StartTime = new Date(new Date().setHours(new Date().getHours() + 1));
    this.resMobile.EndTime = new Date(new Date().setHours(new Date().getHours() + 2));
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  closeModal(template?: TemplateRef<any>) {
    //this.reservataionModal.hide()
    (<HTMLElement>document.querySelector('#main')).style.display =  "block";
    (<HTMLElement>document.querySelector('#fixedbutton')).style.display = "block";
    (<HTMLElement>document.querySelector('#add-new-reservation')).style.display = "none" ;
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
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.terrain = result as Terrain;
        if (this.terrain.image.indexOf('assets/') == -1) {
          this.image = `${this.backend}images/terrains/${this.terrain.image}`;
        } else {
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
  // colors = ['#05BB99', '#00F75D', '#E6E6E6', '#000', '#01B89A', '#F85F73']
  // colorateTerrains = []
  public onEventRendered(args: EventRenderedArgs): void {

     (args.element as HTMLElement).style.backgroundColor = this.ListTerrain.find((el)=>{
      return el["name"] == (args.data["terrain"]["name"] || args.data["terrain"])
     }).color;
     //this.terrainsColors.find((el) => {
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
            (this.eventSettings.dataSource as Array<any>)[last - 1]["Subject"] = (this.eventSettings.dataSource as Array<any>)[last - 1]["Name"] || (this.eventSettings.dataSource as Array<any>)[last - 1]["name"] + "<br/>" + (this.eventSettings.dataSource as Array<any>)[last - 1]["num"];
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
              if (el["terrain"] instanceof Object) {
                el["terrain"]["name"] = updatedRecord.terrain["name"];
              } else {
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

  openEdit() {
    const dialogRef = this.dialog.open(CreateTerrainComponent, {
      width: '500px',
      data: { terrain: this.terrain, update: true }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  buttonDisabled = false;
  buttonState = "";
  resMobile = {
    Name: "",
    num: "",
    terrain: "",
    frais: "",
    StartTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    EndTime: new Date(new Date().setHours(new Date().getHours() + 2))
  }

  onSubmit() {

    if (this.buttonDisabled || this.resMobile.Name == "" || this.resMobile.num == "" || this.resMobile.StartTime == null || this.resMobile.EndTime == null) {
      return;
    }

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.reservationService.create(this.resMobile).subscribe((res) => {
      console.log(res);

      this.notifications.create('Succès', "Réservation ajoutée avec succès", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
      this.fetchData();
      this.buttonDisabled = true;
      this.buttonState = "",
      
      (<HTMLElement>document.querySelector('#add-new-reservation')).style.display = "none";
      (<HTMLElement>document.querySelector('#main')).style.display = "block";
      (<HTMLElement>document.querySelector('#fixedbutton')).style.display = "block";
        //this.closeModal(null);
    })
  }

  minDate = new Date(new Date().setHours(new Date().getHours() + 1))
}
