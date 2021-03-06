import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { ToastController } from 'ionic-angular'
// import { Http, Response } from '@angular/http'
// import { AppConfig } from './../../app/app.config'
import { CommonService } from '../../service/CommonService'

@Component({
  selector: 'page-reg',
  templateUrl: 'reg.html'
})
export class RegPage {
  phone:string = ''
  password:string = ''
  confirmPassword:string = ''
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public commonService: CommonService) {

  }

  submitReg () {
    if (this.phone.trim() === '') {
      const toast = this.toastCtrl.create({
        message: '手机号不能为空',
        duration: 1200
      })
      toast.present();
    } else if (!(/^1[34578]\d{9}$/.test(this.phone))) {
      const toast = this.toastCtrl.create({
        message: '手机号格式不正确',
        duration: 1200
      })
      toast.present();
    } else if (this.password.trim() === '') {
      const toast = this.toastCtrl.create({
        message: '密码不能为空',
        duration: 1200
      })
      toast.present();
    } else if (this.password.trim().length < 6) {
      const toast = this.toastCtrl.create({
        message: '密码不能长度不能小于6位',
        duration: 1200
      })
      toast.present();
    } else if (this.confirmPassword !== this.password) {
      const toast = this.toastCtrl.create({
        message: '两次密码输入不一致',
        duration: 1200
      })
      toast.present();
    } else {
      this.commonService.patientRegister({
        phone: this.phone,
        password: this.password
      }).subscribe(res => {
        const toast = this.toastCtrl.create({
          message: '注册成功！',
          duration: 1200
        })
        toast.present();
        this.navCtrl.pop()
      })
    }
  }
}
