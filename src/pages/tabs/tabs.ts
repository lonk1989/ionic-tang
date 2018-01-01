import { Component } from '@angular/core';

import { ChatPage } from '../chat/chat';
import { MePage } from '../me/me';
import { HomePage } from '../home/home';
import { DiagnosisPage } from '../diagnosis/diagnosis';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // tab1Root = HomePage;
  tab1Root = DiagnosisPage;
  tab2Root = ChatPage;
  tab3Root = MePage;

  constructor() {

  }
}
