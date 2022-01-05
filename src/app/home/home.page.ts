import { Component, OnInit } from '@angular/core'
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
  ThemeService,
} from 'stream-chat-angular'

const USER_ID = 'id of a user in your app'
const API_KEY = 'api key of your app'
const USER_TOKEN =
  'enter user token here'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private themeService: ThemeService
  ) {
    const apiKey = API_KEY
    const userId = USER_ID
    const userToken = USER_TOKEN
    this.chatService.init(apiKey, userId, userToken)
    this.streamI18nService.setTranslation()
    this.themeService.theme$.next('dark')
  }

  async ngOnInit() {
    const channel = this.chatService.chatClient.channel(
      'messaging',
      'talking-about-angular',
      {
        // add as many custom fields as you'd like
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/2048px-Angular_full_color_logo.svg.png',
        name: 'Talking about Angular',
        members: [USER_ID],
      }
    )
    await channel.create()
    this.channelService.init({
      type: 'messaging',
      id: { $eq: 'talking-about-angular' },
    })
  }
}
