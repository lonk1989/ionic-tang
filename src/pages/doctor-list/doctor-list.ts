import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DoctorPage } from '../doctor/doctor';
import { CommonService } from "../../service/CommonService";

@Component({
  selector: 'page-doctor-list',
  templateUrl: 'doctor-list.html'
})
export class DoctorListPage {
  doctorList: Array<any>
  title: String
  constructor(public navCtrl: NavController, public params: NavParams, public commonService: CommonService) {
    this.title = this.params.get('name') || '全部医生';
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
