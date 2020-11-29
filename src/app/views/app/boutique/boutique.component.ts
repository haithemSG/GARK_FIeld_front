import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { CreateTerrainComponent } from './create-terrain-dialog/create-terrain.component';
import { Terrain} from "src/app/shared/models/terrain.model";
import { TerrainService } from 'src/app/shared/services/terrain.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
@Component({
  selector: 'app-boutique',
  templateUrl: './boutique.component.html',
  styleUrls: ['./boutique.component.scss']
})
export class BoutiqueComponent implements OnInit {

  constructor(
    private titleService: Title,
    private terrainService: TerrainService,
    private router: Router,
    public dialog: MatDialog) { }

  loading : boolean = true;

  ngOnInit(): void {
    this.titleService.setTitle("Mes terrains | GARK");
    this.collectMesTerrains();
  }
  OnError(){
    console.log("error");
    
  }
  adminRoot = environment.adminRoot;
  mesTerrains : Array<Terrain> = new Array<Terrain>();
  
  images : Array<any> = [
    { src : "assets/imgs/GarkBanner1.png" },
    { src : "assets/imgs/GarkBanner2.png" },
    { src : "assets/imgs/GarkBanner3.png" },
    { src : "assets/imgs/GarkBanner4.png" },
    { src : "assets/imgs/GarkBanner5.png" },
    { src : "assets/imgs/GarkBanner6.png" },
    { src : "assets/imgs/GarkBanner7.png" },
    { src : "assets/imgs/GarkBanner8.png" },
    { src : "assets/imgs/GarkBanner9.png" },
    { src : "assets/imgs/GarkBanner10.png" },
  ]

  collectMesTerrains(){
    this.terrainService.getAll().subscribe((res)=>{
      this.loading = false;
      if(res["terrain"]){
        this.mesTerrains = res["terrain"] as Terrain[];

        this.mesTerrains.forEach((el: Terrain)=>{
          el.image = this.adjustImage(el);
        })
      }
    })
  }

  backend = environment.backend;
  
  adjustImage(terrain: Terrain){    
    if(!terrain.image){
      let i = Math.floor(Math.random() * 10);
      return this.images[i].src;
    }else if(terrain.image.indexOf("assets") == -1){
      return `${this.backend}/images/terrains/${terrain.image}`;
    }

   
    return`${terrain.image}`;
    
  }

  open(terrain : Terrain){
    this.terrainService.openedTerrain =terrain;
    this.router.navigateByUrl( `${this.adminRoot}/terrains/view/${terrain._id}` );

  }

  newTerrain: Terrain;

  createNew(){
    const dialogRef = this.dialog.open(CreateTerrainComponent, {
      width: '500px',
      data: {terrain: Terrain, update: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.newTerrain = result;
        this.collectMesTerrains();
      }
    });
  }

  update(terrain : Terrain){
    const dialogRef = this.dialog.open(CreateTerrainComponent, {
      width: '500px',
      data: {terrain: terrain, update: true}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.collectMesTerrains();
      }
    });
  }

  delete(terrain: Terrain){
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px',
      data: {terrain: terrain}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.collectMesTerrains();
      }
    });
  }

}
