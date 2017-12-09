import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DoctorListPage } from '../doctor-list/doctor-list';

@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html'
})
export class ChatListPage {

  constructor(public navCtrl: NavController) {

  }
  
  startPage() {
    this.navCtrl.push(DoctorListPage);
  }

}
