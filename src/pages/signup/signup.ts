import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController, ToastController } from 'ionic-angular';

import { RestProvider } from '../../providers/rest/rest';

import * as _ from 'lodash';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

	loadingIndicator:any;
	details:any = {
		firstname: '',
		lastname: '',
		address: '',
		gender: '',
		status: '',
		username: '',
		password: ''
	}

	constructor(
		public navCtrl: NavController,
    	private loading: LoadingController,
    	private toast: ToastController,
		public rest: RestProvider
	) { }

	ionViewDidLoad() {
	    console.log('ionViewDidLoad LoginPage');
	  }

	signup() {
		this.loadingIndicator = this.loading.create();
		this.loadingIndicator.present();

		this.rest.post('user', this.details)
		.subscribe((response) => {
			this.loadingIndicator.dismiss();
			console.log(response);
			this.presentToast(response.message);
			this.navCtrl.pop();
		}, (error) => {
			this.loadingIndicator.dismiss();
			this.presentToast("Unable to create user");
			console.log("Unable to create user", error)
		})

	}

	gotoLogin() {
		this.navCtrl.pop();
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
