import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { RestProvider } from '../../providers/rest/rest';
import { StorageProvider } from '../../providers/storage/storage';

import { Camera, CameraOptions } from '@ionic-native/camera';

import * as _ from 'lodash';


@Component({
  selector: 'page-update-dog',
  templateUrl: 'update-dog.html',
})
export class UpdateDogPage {

	details:any = {};
	loadingIndicator:any;
	img:any = "http://localhost/dogapp-server/images/dog.png";
	newImage:boolean = true;
	user:any;

	options: CameraOptions = {
	    quality: 100,
	    destinationType: this.camera.DestinationType.DATA_URL,
	    encodingType: this.camera.EncodingType.JPEG,
	    mediaType: this.camera.MediaType.PICTURE,
	    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
	    targetHeight: 100,
	    targetWidth: 100
	  }

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
	    private loading: LoadingController,
	    private toast: ToastController,
		private camera: Camera,
		private sharedData: SharedDataProvider,
		private rest: RestProvider,
		private storage: StorageProvider,
		) {
	}

	ionViewDidLoad() {
		this.details = {
			id: this.sharedData.selectedDog.id,
			name: this.sharedData.selectedDog.name,
			breed: this.sharedData.selectedDog.breed,
		}
		let user:any = this.storage.get('dogappuser');
		this.user = JSON.parse(user);
		console.log(this.user)
	}

	update() {
		this.loadingIndicator = this.loading.create();
		this.loadingIndicator.present();
		
		if(this.newImage) {
			this.details.image = this.img;
		}

		this.rest.put('dog', this.details)
		.subscribe((response) => {
			this.presentToast("Dog profile successfully updated");
			this.sharedData.selectedDog.name = this.details.name;
			this.sharedData.selectedDog.breed = this.details.breed;
			this.loadingIndicator.dismiss();
			this.getDOgs();
			console.log(response);
		}, (error) => {
			this.loadingIndicator.dismiss();
			this.presentToast("Unable to update dog profile");
			console.log("Unable to update dog profile", error)
		})
	}

	getDOgs() {
		this.rest.get('dog', '', {userid:this.user.id})
		.subscribe((response) => {
			this.user.dogs = response;
			this.storage.set('dogappuser', JSON.stringify(this.user))
		}, (error) => {
			console.log(error)
		})

	}

	openLibrary() {
		let self = this;
		this.camera.getPicture(this.options).then((imageData) => {
			self.img = 'data:image/jpeg;base64,' + imageData;
			self.newImage = true;
			console.log(self.img)
		}, (err) => {
			console.log("error camera", err);
		});
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
