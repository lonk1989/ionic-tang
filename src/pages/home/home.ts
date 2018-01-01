import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { DiseaseDetailPage } from '../disease-detail/disease-detail';
import {CommonService} from "../../service/CommonService";
import { DoctorPage } from '../doctor/doctor';
import {GlobalData} from "../../providers/GlobalData";
import { Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { DoctorListPage } from '../doctor-list/doctor-list';
import { DepartmentPage } from '../department/department';
import {Utils} from "../../providers/Utils";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private sicknessList: Array<any>
  private settings: Object
  private doctorList: Array<any>
  private sicknessFirstLine: Array<any>
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public commonService: CommonService, private events: Events, public globalData: GlobalData, private sanitizer: DomSanitizer ) {
    this.events.subscribe('user:login', (userInfo) => {
      this.commonService.getSettings().subscribe(resp => {
        Utils.sessionStorageSetItem('settings', resp);
      });
      this.commonService.getSicknessList().subscribe(resp => {
        this.sicknessList = resp.data
        this.sicknessFirstLine = resp.data.slice(0,7)
      });
      this.commonService.getDoctorList().subscribe(resp => {
        resp.data.map(o => {
          o.rank = o.rank.toString().replace('0', '').replace('1', '主任医师').replace('2', '副主任医师').replace('3', '主治医师').replace('4', '住院医师').replace('5', '医师')
        })
        this.doctorList = resp.data.slice(0,6)
      });
    });
  }

  assembleHTML(strHTML:any) {
    return this.sanitizer.bypassSecurityTrustHtml(strHTML);
  }

  search () {
    console.log('search')
  }

  startModalPage () {

  }

  startPage (sickName) {
    this.navCtrl.push(DiseaseDetailPage, sickName);
  }

  startDoctorPage (id) {
    this.navCtrl.push(DoctorPage, {id: id});
  }

  startDoctorListPage () {
    this.navCtrl.push(DoctorListPage);
  }

  startSicknessPage () {
    this.navCtrl.push(MoreModal, {arrList: this.sicknessList});
  }

  startDepartmentPage () {
    this.navCtrl.push(DepartmentPage);
  }

  startMoreModal () {
    let modal = this.modalCtrl.create(MoreModal, {arrList: this.sicknessList});
    modal.present();
  }
}

@Component({
  selector: 'page-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <ion-icon name="md-close"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid class="home-menu">
        <ion-row>
          <ion-col col-3 *ngFor="let item of sicknessList" (click)="startPage(item.name)">
            <img [src]="item.icon" />
            <p>{{item.name}}</p>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    `
})

export class MoreModal {
  sicknessList:any;
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public navCtrl: NavController
  ) {
    this.sicknessList = this.params.get('arrList');
  }

  startPage (sickName) {
    this.navCtrl.push(DiseaseDetailPage, sickName);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
