import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-collect',
  templateUrl: 'collect.html'
})
export class CollectPage {
  status = 1;
  constructor(public navCtrl: NavController) {
  }

  collectTab (i) {
    console.log(i)
  }
}
