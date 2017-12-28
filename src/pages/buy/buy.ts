import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-buy',
  templateUrl: 'buy.html'
})
export class BuyPage {
  name: String
  price: String
  avatar: String

  constructor(public navCtrl: NavController, public params: NavParams, public toastCtrl: ToastController) {
    this.name = this.params.get('name');
    this.price = this.params.get('price');
    this.avatar = this.params.get('avatar');
    console.log(this.params)
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
