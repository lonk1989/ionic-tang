import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DiseaseDetailPage } from '../disease-detail/disease-detail';
import {CommonService} from "../../service/CommonService";
import { DoctorPage } from '../doctor/doctor';
import {GlobalData} from "../../providers/GlobalData";
import { Events } from 'ionic-angular';
// import { DomSanitizer } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { DomSanitizer } from '@angular/platform-browser';
import { DoctorListPage } from '../doctor-list/doctor-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private sicknessList: Array<any>
  private doctorList: Array<any>
  private sicknessFirstLine: Array<any>
  private sicknessSecondLine: Array<any>
  constructor(public navCtrl: NavController, public commonService: CommonService, private events: Events, public globalData: GlobalData, private sanitizer: DomSanitizer ) {
    this.events.subscribe('user:login', (userInfo) => {
      this.commonService.getSicknessList().subscribe(resp => {
        this.sicknessList = resp.data
        this.sicknessFirstLine = resp.data.slice(0,4)
        this.sicknessSecondLine = resp.data.slice(4,7)
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

  startPage () {
    this.navCtrl.push(DiseaseDetailPage);
  }

  startDoctorPage () {
    this.navCtrl.push(DoctorPage);
  }

  startDoctorListPage() {
    this.navCtrl.push(DoctorListPage);
  }
}
