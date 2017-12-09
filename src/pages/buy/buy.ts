import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-buy',
  templateUrl: 'buy.html'
})
export class BuyPage {

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

  }

  tel () {
    const toast = this.toastCtrl.create({
      message: '拨打客服电话',
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss( () => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }

  startPayPage () {
    const toast = this.toastCtrl.create({
      message: '支付开发中',
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss( () => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }
}
