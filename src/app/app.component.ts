import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController, Events, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuController } from 'ionic-angular';

import { AboutPage } from '../pages/about/about';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';
import { DogTemperaturePage } from '../pages/dog-temperature/dog-temperature';
import { AddDogPage } from '../pages/add-dog/add-dog';

import { StorageProvider } from '../providers/storage/storage';
import { SharedDataProvider } from '../providers/shared-data/shared-data';
import { RestProvider } from '../providers/rest/rest';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any;
  activePage: any;

  user:any;
  dogs: Array<any>;
  selectedDog:any;

  isAddDog:boolean = false;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public events: Events,
    private storage: StorageProvider,
    private sharedData: SharedDataProvider,
    private rest: RestProvider,
    public alertCtrl: AlertController,
    private toast: ToastController,
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.setRoute();

      events.subscribe('user:setDog', (dogs) => {
        this.dogs = dogs;
        if(!this.sharedData.selectedDog) {
          this.sharedData.selectedDog = dogs[0];
        }
      })

      events.subscribe('user:addDog', (dog) => {
        this.dogs.push(dog);
      })

    });
  }

  addDog() {
    this.isAddDog = true;
    this.menuCtrl.close();
    this.nav.setRoot(AddDogPage);
  }

  setRoute() {
    let user:any = this.storage.get('dogappuser');
    if(!user) return this.nav.setRoot(LoginPage)
    this.user = JSON.parse(user);
    if(this.user.dogs.length == 0) this.nav.setRoot(AddDogPage)
    else this.nav.setRoot(TabsControllerPage)

    this.dogs = this.user.dogs;
    this.sharedData.selectedDog = this.dogs[0];
  }

  openPage(page) {
    this.activePage = page;
    this.nav.setRoot(page.component);
  }

  selectDog(dog) {
    if(this.isAddDog) {
      this.nav.setRoot(TabsControllerPage)
    }
    this.sharedData.selectedDog = dog;
    this.isAddDog = false;
  }

  checkSelectedDog(dog): boolean{
    return dog === this.sharedData.selectedDog;
  }

  logout() {
    this.menuCtrl.close();
    this.storage.remove('dogappuser');
    this.nav.setRoot(LoginPage);
    this.sharedData.selectedDog = null;
  }


  presentToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
