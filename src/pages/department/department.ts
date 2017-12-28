import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DoctorListPage } from '../doctor-list/doctor-list';
import {CommonService} from "../../service/CommonService";

@Component({
  selector: 'page-department',
  templateUrl: 'department.html'
})
export class DepartmentPage {
  departmentList: Array<any>
  constructor(public navCtrl: NavController, public commonService: CommonService) {

  }

  ionViewDidEnter () {
    this.commonService.getDepartmentList().subscribe(resp => {
      this.departmentList = resp.data
    });
  }

  startDoctorPage (name) {
    this.navCtrl.push(DoctorListPage, {name: name});
  }
}
