import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RegPage } from '../reg/reg';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {

  }

  startRegPage () {
    this.navCtrl.push(RegPage);
  }
}
