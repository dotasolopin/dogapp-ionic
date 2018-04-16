import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { RestProvider } from '../../providers/rest/rest';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';

@Component({
  selector: 'page-dog-temperature',
  templateUrl: 'dog-temperature.html'
})
export class DogTemperaturePage {

  temp:any;
  loadingIndicator:any;


  constructor(
  	private rest:RestProvider,
  	public navCtrl: NavController,
    private loading: LoadingController,
    private toast: ToastController,
  	private sharedData: SharedDataProvider,
    private localNotifications: LocalNotifications
  	) { }

  ionViewDidLoad(){
    this.getTemp();
  }

  getTemp() {
    let self = this;
    this.rest.passData("devices/3","").subscribe(data=>{

      if((parseFloat(data.temp + "") > 37 || parseFloat(data.temp + "") < 27) &&  (this.temp != data.temp)) {

        let dogName = (self.sharedData.selectedDog) ? self.sharedData.selectedDog.name : 'Your dog';

        self.localNotifications.schedule({
          id: 1,
          text: `${dogName}'s temperature is now ${data.temp}` 
        });
      }

      self.temp = data.temp;

      setTimeout(() => {
        self.getTemp();
      }, 5000)
    });
  }

  saveTemperature() {
    if(this.temp == null) return;

    this.loadingIndicator = this.loading.create();
    this.loadingIndicator.present();


    let data = {
      dogid: this.sharedData.selectedDog.id,
      temperature: this.temp
    }

    this.rest.post('temperature', data)
    .subscribe((response) => {
      this.presentToast("Temperature successfully saved");
      this.loadingIndicator.dismiss();
      console.log(response);
    }, (error) => {
      this.loadingIndicator.dismiss();
      this.presentToast("Unable to save temperature");
      console.log("Unable to save temperature", error)
    })
  }

  presentToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  
}
