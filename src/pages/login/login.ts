import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { RegPage } from '../reg/reg';
import {FormBuilder, Validators} from '@angular/forms';
import {Storage} from '@ionic/storage';
import {GlobalData} from "../../providers/GlobalData";
import {CommonService} from "../../service/CommonService";
import {Helper} from "../../providers/Helper";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  submitted: boolean = false;
  loginForm: any;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public globalData: GlobalData,
              public storage: Storage,
              public formBuilder: FormBuilder,
              public helper: Helper,
              public commonService: CommonService) {
    this.loginForm = this.formBuilder.group({
        phone: [this.globalData.phone || '', [Validators.required, Validators.minLength(2)]],// 第一个参数是默认值
        password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  startRegPage () {
    this.navCtrl.push(RegPage);
  }

  login (user) {
    this.submitted = true;
    this.commonService.patientLogin({phone:user.phone, password:user.password}).subscribe(resp => {
      this.globalData.token = resp.token;
      this.storage.set('token', resp.token);
      this.submitted = false;
      this.helper.loginSuccessHandle(resp.userInfo);
      this.viewCtrl.dismiss();
    }, () => {
      this.submitted = false;
    });
  }
}
