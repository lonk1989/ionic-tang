import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, Config } from 'ionic-angular';
import {IonicStorageModule} from "@ionic/storage";
import { MyApp } from './app.component';

import { ChatPage } from '../pages/chat/chat';
import { MePage } from '../pages/me/me';
import { HomePage } from '../pages/home/home';
import { MoreModal } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { DoctorPage } from '../pages/doctor/doctor';
import { BuyPage } from '../pages/buy/buy';
import { ChatListPage } from '../pages/chat-list/chat-list';
import { OrderListPage } from '../pages/order-list/order-list';
import { BuyListPage } from '../pages/buy-list/buy-list';
import { CollectPage } from '../pages/collect/collect';
import { DoctorListPage } from '../pages/doctor-list/doctor-list';
import { DiseaseDetailPage } from '../pages/disease-detail/disease-detail';
import { MeSettingsPage } from '../pages/me-settings/me-settings';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { RegPage } from '../pages/reg/reg';
import { DepartmentPage } from '../pages/department/department';
import { DiagnosisPage } from '../pages/diagnosis/diagnosis';

import {AppVersion} from "@ionic-native/app-version";
import {Camera} from "@ionic-native/camera";
import {Toast} from "@ionic-native/toast";
import {File} from "@ionic-native/file";
import {FileTransfer} from "@ionic-native/file-transfer";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ImagePicker} from "@ionic-native/image-picker";
import {Network} from "@ionic-native/network";
import {AppMinimize} from "@ionic-native/app-minimize";
import {JPush} from "../../typings/modules/jpush/index";
import {CodePush} from "@ionic-native/code-push";
import {CallNumber} from "@ionic-native/call-number";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {NativeService} from "../providers/NativeService";
import {HttpService} from "../providers/HttpService";
import {FileService} from "../providers/FileService";
import {Helper} from "../providers/Helper";
import {Utils} from "../providers/Utils";
import {GlobalData} from "../providers/GlobalData";
import {IS_DEBUG, FUNDEBUG_API_KEY} from "../providers/Constants";
import {Logger} from "../providers/Logger";
import {ModalFromRightEnter, ModalFromRightLeave, ModalScaleEnter, ModalScaleLeave} from "./modal-transitions";
import {Diagnostic} from "@ionic-native/diagnostic";
import {CommonService} from "../service/CommonService";
import {VersionService} from "../providers/VersionService";
import {CalendarModule} from "ion2-calendar";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//参考文档:https://docs.fundebug.com/notifier/javascript/framework/ionic2.html
import * as fundebug from "fundebug-javascript";

fundebug.apikey = FUNDEBUG_API_KEY;
fundebug.releasestage = IS_DEBUG ? 'development' : 'production';//应用开发阶段，development:开发;production:生产
fundebug.silent = !IS_DEBUG;//如果暂时不需要使用Fundebug，将silent属性设为true

export class FunDebugErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    fundebug.notifyError(err);
    console.error(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    MePage,
    ChatPage,
    HomePage,
    MoreModal,
    TabsPage,
    DoctorPage,
    BuyPage,
    ChatListPage,
    OrderListPage,
    BuyListPage,
    CollectPage,
    DiseaseDetailPage,
    DoctorListPage,
    MeSettingsPage,
    SettingsPage,
    LoginPage,
    RegPage,
    DepartmentPage,
    DiagnosisPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true' ,       //隐藏全部子页面tabs
      backButtonText: '返回',
      iconMode: 'ios',
      mode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
    }),
    IonicStorageModule.forRoot(),
    CalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MePage,
    ChatPage,
    HomePage,
    MoreModal,
    TabsPage,
    DoctorPage,
    BuyPage,
    ChatListPage,
    OrderListPage,
    BuyListPage,
    CollectPage,
    DiseaseDetailPage,
    DoctorListPage,
    MeSettingsPage,
    SettingsPage,
    LoginPage,
    RegPage,
    DepartmentPage,
    DiagnosisPage
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "zh-CN"},
    StatusBar,
    SplashScreen,
    AppVersion,
    Camera,
    Toast,
    File,
    FileTransfer,
    InAppBrowser,
    ImagePicker,
    Network,
    AppMinimize,
    Diagnostic,
    JPush,
    CodePush,
    CallNumber,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: FunDebugErrorHandler},
    NativeService,
    HttpService,
    FileService,
    Helper,
    Utils,
    GlobalData,
    Logger,
    CommonService,
    VersionService
  ]
})
// export class AppModule {}
export class AppModule {
  constructor(public config: Config) {
    this.setCustomTransitions();
  }

  private setCustomTransitions() {
    this.config.setTransition('modal-from-right-enter', ModalFromRightEnter);
    this.config.setTransition('modal-from-right-leave', ModalFromRightLeave);
    this.config.setTransition('modal-scale-enter', ModalScaleEnter);
    this.config.setTransition('modal-scale-leave', ModalScaleLeave);
  }
}
