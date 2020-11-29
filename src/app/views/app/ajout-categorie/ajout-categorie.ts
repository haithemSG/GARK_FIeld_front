import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AddNewProductModalComponent } from 'src/app/containers/pages/add-new-product-modal/add-new-product-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Category } from 'src/app/shared/models/category.model';
import { Item } from 'src/app/shared/models/item.model';
import { SubCategory } from 'src/app/shared/models/subCategory.model';
import { SizeItem } from 'src/app/shared/models/sizeItem.model';
import { Price } from 'src/app/shared/models/price.model';


export interface subCaterory {
  name: string;
  dose: Array<''>;
  description: string;
  id: number;
}

export interface product {
  productName: string;
  description: string;
  priceList: Array<''>;
}
@Component({
  selector: 'app-ajout-categorie',
  templateUrl: './ajout-categorie.html',
})
export class AjoutCategorie implements OnInit {
  // itemsRow = [1, 2, 3, 4];
  // itemsBasic = [1, 2, 3, 4];
  // itemsHandles = [1, 2, 3, 4];

  // itemsUpdates = [1, 2, 3, 4];
  optionsUpdates = {};
  optionsUpdatesSub = {};
  updates = [];
  public categorie = '';
  public categorieList = [];
  public error = false;
  public openCtx;
  public openCtxSub;
  public openCtxProd;
  public modalData;
  public showModal = false;
  public edit = false;
  public editThis = [];
  public showModalAdd = false;
  public showModalAddSub = false;
  public addProductCategories = [];
  public addSubCategorie: subCaterory;
  public productName = '';
  public doses = [];
  public singleDose = '';
  public indexAdd;
  public indexSub;
  public newProd: product;
  public subCategoryList = [];
  public toggler;
  public productDescription = '';
  public addDoses = false;
  public catName = '';
  public itemDel = '';
  public indexDelCat;
  public type;
  public sousCatSelected;
  public editParams;
  public showModalEditCat = false;
  public indexCat;
  @ViewChildren('toggle') toggle;
  @ViewChildren('toggleProd') toggleProd;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  message: string;

  constructor(private modalService: BsModalService) {
    this.optionsUpdates = {
      onUpdate: (event: any) => {
        this.updates.push(this.categorieList.slice());
        localStorage.setItem('categories', JSON.stringify(this.categorieList));
      },
    };
    this.optionsUpdatesSub = {
      onUpdate: (event: any) => {
        this.updates.push(this.categorieList.slice());
        localStorage.setItem('categories', JSON.stringify(this.categorieList));
      },
    };
  }

  addCategories() {
    if (this.categorie == '') {
      this.error = true;
    } else {
      this.error = false;
      this.categorieList.push({
        id: this.categorieList.length + 1,
        name: this.categorie,
        editThis: false,
      });
      this.categorie = '';
    }
    this.editThis.push(false);
    localStorage.setItem('categories', JSON.stringify(this.categorieList));
  }
  ngOnInit() {
    if (localStorage.getItem('categories')) {
      this.categorieList = JSON.parse(localStorage.getItem('categories'));
      for (let i = 0; i < this.categorieList.length; i++) {
        this.editThis.push(false);
        if (this.categorieList[i]) {
          //if (this.subCategoryList && this.subCategoryList[i]) {
            this.subCategoryList.push(this.categorieList[i].subCategoryName);
          // } else {
          //   this.subCategoryList = this.categorieList[i].subCategoryName;
          // }
        }
      }
      console.log(this.subCategoryList)
      console.log(this.categorieList)
    }
    /*this.doses = [
      {
        id: this.doses.length + 1,
        value: '',
        dose: '',
      },
    ];*/
  }
  addDose() {

    this.doses.push({
      id: this.doses.length + 1,
      value: '',
      dose: '',
    });
  }
  openContextMenu(i, j?, k?) {
    console.log(i);
    this.openCtx = i;
    this.openCtxSub = j;
    this.openCtxProd = k;
  }
  closeCtx() {
    this.openCtx = null;
    this.openCtxSub = null;
    this.openCtxProd = null;
  }

  openModal(i) {
    this.openCtx = null;
    this.showModal = true;
    this.modalData = i;
  }
  modalHide() {
    this.showModal = false;
  }
  del(i) {
    let index = this.categorieList.findIndex((x) => x === i);
    this.categorieList.slice(index, 1);
  }
  func2(i, k?, j?) {
    console.log(j);
    this.editParams = [
      {
        i: i,
        k: k,
        j: j,
      },
    ];
    if (j != undefined) {
      this.showAddNewModal(i, k, j, 'edit');
    } else if (k != undefined) {
      this.showAddSubCategorieNewModal(i, k, 'edit');
    } else {
      this.showCatModal(i);
    }
    this.closeCtx();
  }

  saveCatModif(i) {
    this.categorieList[i].editThis = false;
    localStorage.setItem('categories', JSON.stringify(this.categorieList));
    this.showModalEditCat = false;
    this.indexCat = null;
  }
  showAddNewModal(i, k?, j?, type?) {
    console.log("showAdd new Modal", i, type, "k =", k)
    this.errorAdding = false;
    if (type) {
      this.type = 'edit';
      this.productName = this.categorieList[i].subCategoryName[k].product[
        j
      ].productName;
      this.productDescription = this.categorieList[i].subCategoryName[
        k
      ].product[j].description;
      this.doses = this.categorieList[i].subCategoryName[k].product[
        j
      ].priceList;
      if(!Array.isArray(this.doses)){
        this.singleDose = this.doses;
        this.doses= [];
      }
      console.log()
      this.sousCatSelected = this.categorieList[i].subCategoryName[k].id;
    }else{
      if(k != undefined){
        this.sousCatSelected = this.categorieList[i].subCategoryName[k].id;
        console.log("sou cat selected", this.sousCatSelected)
      }
    }
    this.showModalAdd = true;
    this.addProductCategories = this.categorieList[i];
    this.closeCtx();
    this.indexAdd = i;
  }
  closeAddCategorie() {
    this.showModalAdd = false;
    this.addProductCategories = [];
    this.productName = '';
    this.doses = [];
    this.productDescription = '';
  }
  closeAddSubCategorie() {
    this.addDoses = false;
    this.addSubCategorie = {
      name: '',
      dose: [],
      description: '',
      id: null,
    };
    this.doses = [];
    this.showModalAddSub = false;
    this.type = null;
  }
  toggleProduit(i, k) {
    let id = this.categorieList[i].subCategoryName[k].name;
    let elements = document.getElementById(id);
    console.log(elements);
    if (elements.style.height == '0px') {
      elements.style.height = 'auto';
      elements.style.opacity = '1';
    } else {
      elements.style.height = '0';
      elements.style.opacity = '0';
    }
  }
  toggleSub(i) {
    this.toggler = i;
    let elements = this.toggle.toArray().map((x) => x.nativeElement);
    console.log(elements[i].style.height);
    if (elements[i].style.height == '0px') {
      elements[i].style.height = 'auto';
      elements[i].style.opacity = 1;
    } else {
      elements[i].style.height = 0;
      elements[i].style.opacity = 0;
    }
  }
  showCatModal(i) {
    this.closeCtx();
    this.showModalEditCat = true;
    this.catName = this.categorieList[i].name;
    this.indexCat = i;
  }
  closeModalEditCat() {
    this.showModalEditCat = false;
  }
  showAddSubCategorieNewModal(i, k?, type?) {
    this.closeCtx();
    this.indexAdd = i;
    if (k != undefined) {
      this.addSubCategorie = {
        name: this.categorieList[i].subCategoryName[k].name,
        dose: this.categorieList[i].subCategoryName[k].dose,
        description: this.categorieList[i].subCategoryName[k].description,
        id: null,
      };
      this.addDoses = true;
      this.doses = this.addSubCategorie.dose;
      if (type) {
        this.type = 'edit';
      }
    } else {
      this.addDoses = false;
      
      this.addSubCategorie = {
        name: '',
        dose: [],
        description: '',
        id: null,
      };

      
    }

    this.showModalAddSub = true;
    this.catName = this.categorieList[i].name;
  }
  /***********************************a */
  submitAddCategorie(type?) {
    this.addSubCategorie.dose = this.doses;
    if (type == 'edit') {
      this.categorieList[this.editParams[0].i].subCategoryName[
        this.editParams[0].k
      ].description = this.addSubCategorie.description;
      this.categorieList[this.editParams[0].i].subCategoryName[
        this.editParams[0].k
      ].dose = this.addSubCategorie.dose;
      this.categorieList[this.editParams[0].i].subCategoryName[
        this.editParams[0].k
      ].name = this.addSubCategorie.name;
    } else {
      // this.type = null;
      if (!this.categorieList[this.indexAdd]['subCategoryName']) {
        this.categorieList[this.indexAdd]['subCategoryName'] = [];
        this.addSubCategorie.id = 1;
      } else {
        this.addSubCategorie.id =
          this.categorieList[this.indexAdd]['subCategoryName'].length + 1;
      }
      this.categorieList[this.indexAdd]['subCategoryName'].push(
        this.addSubCategorie
      );
    }
    localStorage.setItem('categories', JSON.stringify(this.categorieList));
    this.closeAddSubCategorie();
    this.type = null;
  }
  submitAddProduct(type?) {
    console.log(type);
    let dose;
    console.log("single ??", this.singleDose)
    if (this.singleDose) {
      dose = this.singleDose;
    } else {
      dose = this.doses;
    }
    let errDose = true;
    for (let i = 0; i < dose.length; i++) {
      if (dose[i].value != '') {
        errDose = false;
        i = dose.length;
      }
    }
    if (this.productName != '' && !errDose) {
      this.newProd = {
        productName: this.productName,
        description: this.productDescription,
        priceList: dose,
      };
      if (type == 'edit') {
        this.categorieList[this.editParams[0].i].subCategoryName[
          this.editParams[0].k
        ].product[this.editParams[0].j] = this.newProd;
      } else {
        if (
          !this.categorieList[this.indexAdd].subCategoryName[this.indexSub][
          'product'
          ]
        ) {
          this.categorieList[this.indexAdd].subCategoryName[this.indexSub][
            'product'
          ] = [];
        }
        this.categorieList[this.indexAdd].subCategoryName[this.indexSub][
          'product'
        ].push(this.newProd);
      }
      this.errorAdding= false;
      this.closeAddCategorie();
      localStorage.setItem('categories', JSON.stringify(this.categorieList));
    } else {
      this.errorAdding = true;
      console.log('error', this.productName, errDose);
    }
  }
  errorAdding: boolean = false;
  changeSub($event) {
    for (let i = 0; i < this.categorieList[this.indexAdd].subCategoryName.length; i++) {
      if (this.categorieList[this.indexAdd].subCategoryName[i].id == $event.target.value) {
        this.indexSub = i;
      }
    }
    this.singleDose = '';
    this.doses = this.categorieList[this.indexAdd].subCategoryName[
      this.indexSub
    ].dose;
  }
  changeDose($event, data) {
    console.log($event);
  }
  openModalDel(template: TemplateRef<any>, i, type, j?, k?) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    if (type == 'categorie') {
      this.modalRef.content = { i, type };
      this.itemDel = this.categorieList[i].name;
    }
    if (type == 'sousCategorie') {
      this.modalRef.content = { i, j, type };
      this.itemDel = this.categorieList[i].subCategoryName[j].name;
    }
    if (type == 'produit') {
      console.log(this.categorieList[i]);
      this.itemDel = this.categorieList[i].subCategoryName[j].product[
        k
      ].productName;
      this.modalRef.content = { i, j, k, type };
    }
    this.closeCtx();
  }
  openModalLang(template) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  openModalLangDupli(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'second' });
  }
  confirm(): void {
    this.message = 'Confirmed!';
    console.log(this.modalRef.content);
    this.categorieList = JSON.parse(localStorage.getItem('categories'));
    if (this.modalRef.content.type == 'categorie') {
      this.categorieList.splice(this.modalRef.content.i, 1);
    } else if (this.modalRef.content.type == 'sousCategorie') {
      this.categorieList[this.modalRef.content.i].subCategoryName.splice(
        this.modalRef.content.j, 1 );
    } else if (this.modalRef.content.type == 'produit') {
      this.categorieList[this.modalRef.content.i].subCategoryName[this.modalRef.content.j]
        .product.splice(this.modalRef.content.k, 1);
    }
    this.modalRef.hide();
    console.log(this.categorieList)
    localStorage.setItem('categories', JSON.stringify(this.categorieList));
  }
  confirmNested() {
    this.modalRef2.hide();
    this.modalRef.hide();
  }
  declineNested() {
    this.modalRef2.hide();
  }
  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }
  delDosage(i) {
    console.log("deleting ", i)
    this.doses.splice(i, 1);
    for (
      let h = 0;
      h <
      this.categorieList[this.editParams[0].i].subCategoryName[
        this.editParams[0].k
      ].product.length;
      h++
    ) {
      this.categorieList[this.editParams[0].i].subCategoryName[
        this.editParams[0].k
      ].product[h].priceList.splice(i, 1);
    }
  }


  List: Array<Category> = new Array<Category>();
  ProductList: Array<Item> = new Array<Item>();
  SubCategoryList: Array<SubCategory> = new Array<SubCategory>();

  submitMenu() {
    var list = JSON.parse(localStorage.getItem('categories'));
    console.log(list)
    list.forEach((el) => {
      if (el["name"]) {
        let category = { categoryName: el.name, subCategoryList: new Array<SubCategory>() } as Category;
        if (el["subCategoryName"]) {
          let sub = el["subCategoryName"] as []; //array

          sub.forEach((subEl) => {
            let subCategory = {
              subCategoryName: subEl["name"],
              description: subEl["description"],
              items: new Array<Item>(),
              sizeItemList: new Array<SizeItem>()
            } as SubCategory;
            //Porudct List
            if (subEl["product"]) {
              let prodArray = subEl["product"] as [];
              prodArray.forEach((prodEl) => {
                let prod = {
                  description: prodEl["description"],
                  name: prodEl["productName"],
                  priceList: new Array<Price>()
                } as Item;
                if (prodEl["priceList"]) {
                  if(this.isString(prodEl["priceList"] )){
                    let price = {
                      price: prodEl["priceList"] 
                    } as Price;
                    prod.priceList.push(price)
                  }else{
                    let priceArray = prodEl["priceList"] as [];
                    priceArray.forEach((priceEl) => {
                      let price = {
                        price: priceEl["price"]
                      } as Price;
                      prod.priceList.push(price);
                    })
                  }
                 
                }
                subCategory.items.push(prod)
              });
            }
            //Doses List
            if (subEl["dose"]) {
              let doseArray = subEl["dose"] as [];
              doseArray.forEach((doseEl) => {
                let dose = {
                  size: `${doseEl["value"]}${doseEl["dose"]}`
                } as SizeItem;
                subCategory.sizeItemList.push(dose);
              })
            }
            category.subCategoryList.push(subCategory);
          })
        }
        this.List.push(category)
      }
    })
    console.log(this.List)
  }


  isString(val): boolean {
    return typeof val === "string";
  }

  bool1 : boolean = true;
  bool2 : boolean = false;
  checkSelection(event) {
    if(this.addDoses == true){
      this.addDoses = true;
      this.addDose();
    }else{
      this.doses = [];
    }
  }
}
