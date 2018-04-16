import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SharedDataProvider } from '../../providers/shared-data/shared-data';

import { UpdateProfilePage } from '../update-profile/update-profile';
import { UpdateDogPage } from '../update-dog/update-dog';
import { SavedFilesPage } from '../saved-files/saved-files';


@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {

	pages:any = {
		'user': UpdateProfilePage,
		'dog': UpdateDogPage,
		'file': SavedFilesPage
	}

	constructor(
		public navCtrl: NavController,
		private sharedData: SharedDataProvider
	) { }

	gotoPage(key) {
		this.navCtrl.push(this.pages[key]);
	}
  
}
