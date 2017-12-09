import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ChatListPage } from '../chat-list/chat-list';
import { OrderListPage } from '../order-list/order-list';
import { BuyListPage } from '../buy-list/buy-list';
import { CollectPage } from '../collect/collect';
import { SettingsPage } from '../settings/settings';
import { MeSettingsPage } from '../me-settings/me-settings';

@Component({
  selector: 'page-me',
  templateUrl: 'me.html'
})
export class MePage {

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

  }

  startMeSettingsPage () {
    this.navCtrl.push(MeSettingsPage);
  }

  startChatListPage () {
    this.navCtrl.push(ChatListPage);
  }

  startPlanPage () {
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

  startCollectPage () {
    this.navCtrl.push(CollectPage);
  }

  startOrderListPage () {
    this.navCtrl.push(OrderListPage);
  }

  startBuyListPage () {
    this.navCtrl.push(BuyListPage);
  }

  startSettingsPage () {
    this.navCtrl.push(SettingsPage);
  }
}
