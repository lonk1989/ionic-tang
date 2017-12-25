import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DiseaseDetailPage } from '../disease-detail/disease-detail';
import { DoctorPage } from '../doctor/doctor';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  search () {
    console.log('search')
  }

  startPage () {
    this.navCtrl.push(DiseaseDetailPage);
  }

  startDoctorPage () {
    this.navCtrl.push(DoctorPage);
  }
}
