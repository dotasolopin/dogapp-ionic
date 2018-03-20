import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
@Component({
  selector: 'page-dog-temperature',
  templateUrl: 'dog-temperature.html'
})
export class DogTemperaturePage {
  temp:any;
  constructor(private rest:RestProvider,public navCtrl: NavController) {
    this.rest.passData("devices/3","").subscribe(data=>{
      this.temp = data.temp;
    });
  }
  
}
