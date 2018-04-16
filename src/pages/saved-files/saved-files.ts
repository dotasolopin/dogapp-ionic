import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { RestProvider } from '../../providers/rest/rest';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';

import { ViewLocationPage } from '../view-location/view-location';


@Component({
  selector: 'page-saved-files',
  templateUrl: 'saved-files.html',
})
export class SavedFilesPage {
	temperatures:any = [];
	locations:any = [];
	tabIndex:number = 0;
	busy:boolean = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		private toast: ToastController,
		private rest: RestProvider,
		private sharedData: SharedDataProvider
	) { }

	ionViewDidLoad() {
		this.getLocation();
		this.getTemperature();
		console.log("dogid", this.sharedData.selectedDog.id)

	}

	getTemperature() {
		let self = this;
		this.busy = true;
		this.rest.get('temperature', '', {dogid:this.sharedData.selectedDog.id})
		.subscribe((response) => {
			self.temperatures = response;
			this.busy = false;
		}, (error) => {
			this.busy = false;
			console.log("error getTemperature", error);
		})
	}
	getLocation() {
		let self = this;
		this.busy = true;
		this.rest.get('location', '', {dogid:this.sharedData.selectedDog.id})
		.subscribe((response) => {
			self.locations = response;
			this.busy = false;
		}, (error) => {
			this.busy = false;
			console.log("error getLocation", error);
		})
	}
	getDate(date) {
		let d = date.replace(" ", "T").concat("Z");
		return d;
	}

	getColor(index) {
		if(index == this.tabIndex) return 'primary';
		return 'light';
	}
	changeTab(index) {
		this.getLocation();
		this.getTemperature();
		this.tabIndex = index;
	}

	viewLocation(location) {
		console.log(location)
		this.navCtrl.push(ViewLocationPage, {location:location});
	}

	confirmDelete(id, t) {
		let self = this;
	  let alert = this.alertCtrl.create({
	    title: 'Confirm delete',
	    message: 'Do you want to delete this record?',
	    buttons: [
	      {
	        text: 'Cancel',
	        role: 'cancel',
	        handler: () => {  }
	      },
	      {
	        text: 'Yes',
	        handler: () => { 
	        	if(t == 'location') {
	        		self.removeLocation(id)
	        	}
	        	else if(t == 'temperature') {
	        		self.removeTemperature(id)
	        	}

	        	
	        }
	      }
	    ]
	  });
	  alert.present();
	}

	removeLocation(id) {
		let self = this;
		let loading = this.loadingCtrl.create({
		    content: 'Please wait...'
		  });
		 loading.present();

		this.rest.delete('location/', id)
		.subscribe((response) => {
			loading.dismiss();
			self.presentToast("Location removed");
			self.getLocation();
		}, (error) => {
			loading.dismiss();
			self.presentToast("Unable to removed location");
		})

	}

	removeTemperature(id) {
		let self = this;
		let loading = this.loadingCtrl.create({
		    content: 'Please wait...'
		  });
		 loading.present();

		this.rest.delete('temperature/', id)
		.subscribe((response) => {
			loading.dismiss();
			self.presentToast("Temperature removed");
			self.getTemperature();
		}, (error) => {
			loading.dismiss();
			self.presentToast("Unable to removed temperature");
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
