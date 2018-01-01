import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormBuilder} from "@angular/forms";
import {Validators} from "../../providers/Validators";

@Component({
  selector: 'page-diagnosis',
  templateUrl: 'diagnosis.html'
})
export class DiagnosisPage {
  state: any = 1
  times: Number
  countDown: String = '00:00'
  countDownTxt: String = '开始计时'
  restartBtnShow: boolean = false
  form: any;
  verifyMessages = {
    'title': {
      'errorMsg': '',
      'required': '标题为必填项',
      'minlength': '标题最少4个字符',
      'maxlength': '标题最大20个字符'
    },
    'content': {
      'errorMsg': '',
      'required': '内容为必填项',
      'minlength': '内容最少4个字符',
      'maxlength': '内容最大500个字符'
    }
  };

  constructor(public navCtrl: NavController,
              private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],// 第一个参数是默认值
      symptom: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(500)]],
      type: ['1'],//1:BUG;2:需求；3：问题；
      state: ['1'],//1:未回复；2:已回复；3:补充待回复;8：已关闭;9重新打开；
      pulse: [1]//1:现场作业app；2:精准营销app；3:web
    });
    this.form.valueChanges
      .subscribe(data => {
        const verifyMessages = this.verifyMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
      });
  }

  statePlus () {
    this.state += 1
  }

  stateMinus () {
    this.state -= 1
  }

  startCountDown () {
    this.countDownTxt = '倒计时'
    this.restartBtnShow = true
    setTimeout(() => { this.countDownTxt = '5' }, 1000)
    setTimeout(() => { this.countDownTxt = '4' }, 2000)
    setTimeout(() => { this.countDownTxt = '3' }, 3000)
    setTimeout(() => { this.countDownTxt = '2' }, 4000)
    setTimeout(() => { this.countDownTxt = '1' }, 5000)
    setTimeout(() => { this.countDownTxt = '重新计时' }, 6000)
  }

  restartCountDown () {
      this.restartBtnShow = false
  }
}
