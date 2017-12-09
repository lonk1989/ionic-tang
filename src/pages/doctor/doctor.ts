import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BuyPage } from '../buy/buy';

@Component({
  selector: 'page-doctor',
  templateUrl: 'doctor.html'
})
export class DoctorPage {

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

  }

  startBuyPage () {
    this.navCtrl.push(BuyPage);
  }
  
  startVisitPage() {
    const toast = this.toastCtrl.create({
      message: '诊后咨询只向复诊患者开放',
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss( () => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }
  
  startOfflinePage() {
    const toast = this.toastCtrl.create({
      message: '尚未开放',
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss( () => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }
  
  startNoticePage() {
    const toast = this.toastCtrl.create({
      message: '医生尚未发布公告',
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss( () => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }

}
