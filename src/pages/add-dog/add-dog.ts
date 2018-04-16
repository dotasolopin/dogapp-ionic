import { Component } from '@angular/core';
import { Nav, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';

import { DatePicker } from '@ionic-native/date-picker';

import { RestProvider } from '../../providers/rest/rest';
import { StorageProvider } from '../../providers/storage/storage';

import { TabsControllerPage } from '../../pages/tabs-controller/tabs-controller';

import * as _ from 'lodash';

/**
 * Generated class for the AddDogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-dog',
  templateUrl: 'add-dog.html',
})
export class AddDogPage {

	showHeader:boolean = false;
	loadingIndicator:any;
	details:any = {
		userid: '',
		name: '',
		breed: '',
		birthdate: new Date(),
		gender: ''
	}
	displayDate:any = new Date();
	user:any;

	constructor(
		public nav: Nav,
		public navCtrl: NavController,
		public navParams: NavParams,
		private datePicker: DatePicker,
		private loading: LoadingController,
		private toast: ToastController,
		private events: Events,
		public rest: RestProvider,
		public storage: StorageProvider
	) {
		let user:any = this.storage.get('dogappuser');
		this.user = JSON.parse(user);
		if(this.user.dogs.length > 0) this.showHeader = true;
		this.details.userid = this.user.id;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddDogPage');
	}

	openDatepicker() {
		console.log("asd")
		this.datePicker.show({
			date: new Date(),
			mode: 'date',
			androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
		}).then( (date) => {
			if(date) {
				this.details.birthdate = date;
				this.displayDate = date;
			}
		}, err => console.log('Error occurred while getting date: ', err)
		);
	}

	addDog() {
		this.loadingIndicator = this.loading.create();
		this.loadingIndicator.present();

		this.details.birthdate = new Date(this.details.birthdate);
		this.rest.post('dog', this.details)
		.subscribe((response) => {
			this.loadingIndicator.dismiss();
			console.log(response);
			this.user.dogs.push(response);

			if(this.user.dogs.length > 1) {
				this.events.publish('user:addDog', response)
			}
			else {
				this.events.publish('user:setDog', this.user.dogs)
			}
			
			this.storage.set('dogappuser', JSON.stringify(this.user));

			this.presentToast(`${this.details.name} successfully added`);
			this.nav.setRoot(TabsControllerPage);

		}, (error) => {
			this.loadingIndicator.dismiss();
			this.presentToast("Unable to add dog");
			console.log("Unable to add dog", error)
		})
	}

	ready() {
		if(_.values(this.details).indexOf('') >= 0) return false;
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
