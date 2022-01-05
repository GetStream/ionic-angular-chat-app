import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { FormsModule } from '@angular/forms'
import { HomePage } from './home.page'

import { HomePageRoutingModule } from './home-routing.module'

import {
  StreamChatModule,
  StreamAutocompleteTextareaModule,
} from 'stream-chat-angular'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    StreamChatModule,
    StreamAutocompleteTextareaModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
