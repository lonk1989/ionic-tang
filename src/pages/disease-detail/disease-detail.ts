import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DoctorPage } from '../doctor/doctor';
import { CommonService } from "../../service/CommonService";

@Component({
  selector: 'page-disease-detail',
  templateUrl: 'disease-detail.html'
})
export class DiseaseDetailPage {
  doctorList: Array<any>
  constructor(public navCtrl: NavController, public commonService: CommonService) {

  }

  ionViewDidEnter () {
    this.commonService.getDoctorList().subscribe(resp => {
      resp.data.map(o => {
        o.adeptArr = o.adept ? o.adept.split(',') : []
        o.rank = o.rank.toString().replace('0', '').replace('1', '主任医师').replace('2', '副主任医师').replace('3', '主治医师').replace('4', '住院医师').replace('5', '医师')
        o.price = parseFloat(o.price)
      })
      this.doctorList = resp.data
    });
  }

  startDoctorPage (id) {
    this.navCtrl.push(DoctorPage, {id: id});
  }
}
