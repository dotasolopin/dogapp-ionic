import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { StorageProvider } from '../../providers/storage/storage';
import { RestProvider } from '../../providers/rest/rest';

import { Camera, CameraOptions } from '@ionic-native/camera';

import * as _ from 'lodash';


@Component({
  selector: 'page-update-profile',
  templateUrl: 'update-profile.html',
})
export class UpdateProfilePage {

	details:any = {};
	loadingIndicator:any;
	img:any = "http://localhost/dogapp-server/images/dog.png";
	newImage:boolean = true;

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
		private storage: StorageProvider,
		private camera: Camera,
		private rest: RestProvider
		) {
	}

	ionViewDidLoad() {
		let user:any = this.storage.get('dogappuser');
			user = JSON.parse(user);
		this.img = user.image;
		this.details = {
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			address: user.address,
			status: user.status
		}
		console.log('ionViewDidLoad UpdateProfilePage');
	}

	update() {
		this.loadingIndicator = this.loading.create();
		this.loadingIndicator.present();

		if(this.newImage) {
			this.details.image = this.img;
		}

		this.rest.put('user', this.details)
		.subscribe((response) => {
			this.presentToast("Profile successfully updated");
			this.newImage = false;
			this.loadingIndicator.dismiss();
			this.getUser();
			console.log(response);
		}, (error) => {
			this.loadingIndicator.dismiss();
			this.presentToast("Unable to update profile");
			console.log("Unable to update profile", error)
		})
	}

	getUser() {
		this.rest.get('user', '', {id:this.details.id})
		.subscribe((response) => {
			this.storage.set('dogappuser', JSON.stringify(response))
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
