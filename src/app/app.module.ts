import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ChatPage } from '../pages/chat/chat';
import { MePage } from '../pages/me/me';
import { HomePage } from '../pages/home/home';
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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    MePage,
    ChatPage,
    HomePage,
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
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true' ,       //隐藏全部子页面tabs
      backButtonText: '返回',
      iconMode: 'ios',
      mode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MePage,
    ChatPage,
    HomePage,
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
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
