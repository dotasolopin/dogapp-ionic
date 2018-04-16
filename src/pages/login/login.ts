import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController, ToastController, Nav, Events } from 'ionic-angular';

import { DatePicker } from '@ionic-native/date-picker';

import { RestProvider } from '../../providers/rest/rest';
import { StorageProvider } from '../../providers/storage/storage';

import { SignupPage } from '../signup/signup';
import { AddDogPage } from '../add-dog/add-dog';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';

import * as _ from 'lodash';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loadingIndicator:any;
  auth:any = {
      username: '',
      password: ''
    }

  constructor(
    private nav: Nav,
  	private navCtrl: NavController,
    private loading: LoadingController,
    private toast: ToastController,
    private datePicker: DatePicker,
    private events: Events,
  	private rest: RestProvider,
    private storage: StorageProvider
  	) { }

  ionViewDidLoad() {
    
  }

  login() {
    this.loadingIndicator = this.loading.create();
    this.loadingIndicator.present();

    this.rest.post('auth', this.auth)
    .subscribe((response) => {
      this.loadingIndicator.dismiss();
      console.log(response);
      this.storage.set('dogappuser', JSON.stringify(response));
      if(!response.dogs.length) {
        this.nav.setRoot(AddDogPage);
        return;
      }
      this.events.publish('user:setDog', response.dogs);
      this.nav.setRoot(TabsControllerPage);
    }, (error) => {
      this.loadingIndicator.dismiss();
      this.presentToast("Invalid credentials");
      console.log("Invalid credentials", error)
    })
  }

  gotoSignup() {
    this.navCtrl.push(SignupPage);
  }

  ready() {
    if(_.values(this.auth).indexOf('') >= 0) return false;
    return true;
  }

  presentToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  
}
