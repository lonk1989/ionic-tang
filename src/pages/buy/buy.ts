import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {CallNumber} from "@ionic-native/call-number";
import {NativeService} from "../../providers/NativeService";
import {Utils} from "../../providers/Utils";

@Component({
  selector: 'page-buy',
  templateUrl: 'buy.html'
})
export class BuyPage {
  name: String
  price: String
  avatar: String

  constructor(public navCtrl: NavController,
              public nativeService: NativeService,
              public params: NavParams, 
              public toastCtrl: ToastController) {
    this.name = this.params.get('name');
    this.price = this.params.get('price');
    this.avatar = this.params.get('avatar');
    console.log(this.params)
  }

  tel () {
    const settings = Utils.sessionStorageGetItem('settings')
    this.nativeService.isMobile() && this.nativeService.callNumber(settings.tel);
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
