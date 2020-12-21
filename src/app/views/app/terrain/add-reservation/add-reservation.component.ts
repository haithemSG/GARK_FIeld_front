import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Terrain } from 'src/app/shared/models/terrain.model';
import { ReservationService } from 'src/app/shared/services/reservation.service';
import { TerrainService } from 'src/app/shared/services/terrain.service';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss']
})
export class AddReservationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddReservationComponent>,
    private notificationsService: NotificationsService,
    private reservationService: ReservationService,
    @Inject(MAT_DIALOG_DATA) public data: Object
  ) {

  }

  uniqueTerrain: boolean = false;
  nomTerrain: Array<any> = new Array<any>();
  listTerrain: Array<Terrain> = new Array<Terrain>();
  buttonDisabled = false;
  buttonState = "";
  monTerrain: string = ""
  terrain: Terrain;

  resMobile = {
    Name: "",
    num: "",
    terrain: "",
    frais: "",
    StartTime: new Date(new Date().setHours(new Date().getHours() + 1, 0, 0)),
    EndTime: new Date(new Date().setHours(new Date().getHours() + 2, 0, 0))
  }
  public format = 'dd/MM/yyyy HH:mm';
  ngOnInit(): void {
    if (!this.data["multiple"]) {
      this.uniqueTerrain = true;
      this.monTerrain = this.data["terrain"]
      this.resMobile.terrain = this.data["terrain"];
    } else {
      this.nomTerrain = this.data["listTerrain"] as Array<any>;
      this.listTerrain = this.data["list"] as Array<Terrain>;
    }
  }

  already: boolean = false;
  onSubmit() {

    if (this.buttonDisabled || this.resMobile.Name == "" || this.resMobile.num == "" || this.resMobile.StartTime == null || this.resMobile.EndTime == null) {
      return;
    }

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.reservationService.create(this.resMobile).subscribe((res) => {

      console.log(res)
      if (res["error"] == true) {
        this.already = true;
        this.buttonDisabled = false;
        this.buttonState = "";
      } else {
        this.notificationsService.create('Succès', "Réservation ajoutée avec succès", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
        this.already = false;
        this.buttonDisabled = false;
        this.buttonState = "";
        setTimeout(() => {
          this.dialogRef.close("refresh")
        }, 600)
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  validateNumber() {
    const regex = /\s/gi;
    let a = this.resMobile.num;
    a = a.replace(regex, '');

    return !isNaN(+a) && a.length == 8;
  }

  selectedTerrain: Terrain;
  terrainHasChanged(event) {
    this.already = false;
    const selectedStaduim = event["value"];
    this.selectedTerrain = this.listTerrain.find((t: Terrain) => {
      return selectedStaduim == t.name;
    })
    this.resMobile.EndTime = this.resMobile.StartTime.addMinutes(this.selectedTerrain.duration);
    this.resMobile.frais = "90";
  }

  startTimeHasChanged(event) {
    this.already = false;
    this.resMobile.StartTime = event as Date;
    if (this.selectedTerrain) {
      this.resMobile.EndTime = this.resMobile.StartTime.addMinutes(this.selectedTerrain.duration);
    } else {
      this.resMobile.EndTime = this.resMobile.StartTime.addMinutes(90);
    }
  }
}
