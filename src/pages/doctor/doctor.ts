import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BuyPage } from '../buy/buy';
import { CommonService } from "../../service/CommonService";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-doctor',
  templateUrl: 'doctor.html'
})
export class DoctorPage {
  id: Number
  doctor: Object
  constructor(public navCtrl: NavController, public params: NavParams, public toastCtrl: ToastController, public commonService: CommonService, private sanitizer: DomSanitizer) {
    this.doctor = {
      name: '',
      avatar: '',
      rank: '',
      hospital: '',
      price: '--',
      consult_price: '--',
      about: '',
      intro: '',
      adeptArr: []
    }
    this.id = this.params.get('id') || 0;
  }

  ionViewDidEnter () {
    this.commonService.getDoctorById(this.id).subscribe(resp => {
      resp.rank = resp.rank.toString().replace('0', '').replace('1', '主任医师').replace('2', '副主任医师').replace('3', '主治医师').replace('4', '住院医师').replace('5', '医师')
      resp.adeptArr = resp.adept.split(',')
      resp.price = parseFloat(resp.price)
      resp.consult_price = parseFloat(resp.consult_price)
      this.doctor = resp
    });
  }

  assembleHTML(strHTML:any) {
    return this.sanitizer.bypassSecurityTrustHtml(strHTML);
  }

  startBuyPage (name, price, avatar) {
    this.navCtrl.push(BuyPage, {name: name, price: price, avatar: avatar});
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
