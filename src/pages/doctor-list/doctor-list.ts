import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DoctorPage } from '../doctor/doctor';

@Component({
  selector: 'page-doctor-list',
  templateUrl: 'doctor-list.html'
})
export class DoctorListPage {

  constructor(public navCtrl: NavController) {

  }

  startDoctorPage () {
    this.navCtrl.push(DoctorPage);
  }

}
