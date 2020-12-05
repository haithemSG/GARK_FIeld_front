import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService, NotificationType } from 'angular2-notifications';
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
    @Inject(MAT_DIALOG_DATA) public data: Object,
  ) { }

  uniqueTerrain: boolean = false;
  nomTerrain : Array<any> = new Array<any>();
  listTerrain : Array<Terrain> = new Array<Terrain>();
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
  
  ngOnInit(): void {
    if(!this.data["multiple"]){
      this.uniqueTerrain = true;
    }else{
      this.nomTerrain = this.data["listTerrain"] as Array<any>;
      this.listTerrain = this.data["list"] as Array<Terrain>;
    }
  }

  onSubmit() {

    if (this.buttonDisabled || this.resMobile.Name == "" || this.resMobile.num == "" || this.resMobile.StartTime == null || this.resMobile.EndTime == null) {
      return;
    }

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.reservationService.create(this.resMobile).subscribe((res) => {

      this.notificationsService.create('Succès', "Réservation ajoutée avec succès", NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

      this.buttonDisabled = true;
      this.buttonState = "";


      setTimeout(()=>{ 
        this.dialogRef.close("refresh")
       }, 600)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedTerrain : Terrain;
  terrainHasChanged(event){
    const selectedStaduim = event["value"];
    this.selectedTerrain = this.listTerrain.find((t : Terrain)=>{
      return selectedStaduim == t.name;
    })
    this.resMobile.EndTime = this.resMobile.StartTime.addMinutes(this.selectedTerrain.duration);
    this.resMobile.frais = "90";
  }

  startTimeHasChanged(event){
    if(this.selectedTerrain){
      console.log(this.selectedTerrain.duration);
      
      this.resMobile.EndTime = this.resMobile.StartTime.addMinutes(this.selectedTerrain.duration);
    }
  }
}
