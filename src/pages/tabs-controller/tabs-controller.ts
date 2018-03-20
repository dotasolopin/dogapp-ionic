import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DogLocationPage } from '../dog-location/dog-location';
import { DogTemperaturePage } from '../dog-temperature/dog-temperature';
import { OptionsPage } from '../options/options';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  tab1Root: any = DogLocationPage;
  tab2Root: any = DogTemperaturePage;
  tab3Root: any = OptionsPage;
  constructor(public navCtrl: NavController) {
  }
  tempClick(){
    console.log("Click! temp");
  }
}
