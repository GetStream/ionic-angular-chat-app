import { Component, OnInit } from '@angular/core'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { Platform } from '@ionic/angular'
import { environment } from 'src/environments/environment'
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
  ThemeService,
} from 'stream-chat-angular'

const USER_ID = environment.userId
const API_KEY = environment.apiKey
const USER_TOKEN =
  environment.userToken;

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
    private themeService: ThemeService,
    private platform: Platform
  ) {
    const apiKey = API_KEY
    const userId = USER_ID
    const userToken = USER_TOKEN
    this.chatService.init(apiKey, userId, userToken)
    this.streamI18nService.setTranslation()
    this.themeService.theme$.next('dark')
  }

  async ngOnInit() {
    await this.channelService.init({
      type: 'messaging',
    })

    const platform = Capacitor.getPlatform();
    const isAndroid = platform === 'android'
    if (isAndroid) {
      await this.registerNotifications();
      await this.addListeners();
      await this.getDeliveredNotifications();
    }
    // Notifications only delivered if user doesn't have an active WebSocket connection, so we disconnect on pause, and reconnect on resume
    await this.platform.ready();
    this.platform.pause.subscribe(async () => {
      await this.chatService.disconnectUser();
      this.channelService.reset();
    });
    this.platform.resume.subscribe(() => {
      this.chatService.init(API_KEY, USER_ID, USER_TOKEN);
      this.channelService.init({
        type: 'messaging',
      })
    });
  }

  async addListeners () {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
      this.chatService.chatClient.addDevice(token.value, 'firebase', USER_ID);
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', async notification => {
      console.log('Push notification received: ', JSON.stringify(notification, null, 2));
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }
}
