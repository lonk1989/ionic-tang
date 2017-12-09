import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DoctorPage } from '../doctor/doctor';

@Component({
  selector: 'page-disease-detail',
  templateUrl: 'disease-detail.html'
})
export class DiseaseDetailPage {

  constructor(public navCtrl: NavController) {

  }

  startDoctorPage () {
    this.navCtrl.push(DoctorPage);
  }
}
