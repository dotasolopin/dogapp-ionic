var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { RestProvider } from '../../providers/rest/rest';
import { StorageProvider } from '../../providers/storage/storage';
import { Camera } from '@ionic-native/camera';
import * as _ from 'lodash';
var UpdateDogPage = /** @class */ (function () {
    function UpdateDogPage(navCtrl, navParams, loading, toast, camera, sharedData, rest, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loading = loading;
        this.toast = toast;
        this.camera = camera;
        this.sharedData = sharedData;
        this.rest = rest;
        this.storage = storage;
        this.details = {};
        this.img = "http://localhost/dogapp-server/images/dog.png";
        this.newImage = true;
        this.options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            targetHeight: 100,
            targetWidth: 100
        };
    }
    UpdateDogPage.prototype.ionViewDidLoad = function () {
        this.details = {
            id: this.sharedData.selectedDog.id,
            name: this.sharedData.selectedDog.name,
            breed: this.sharedData.selectedDog.breed,
        };
        var user = this.storage.get('dogappuser');
        this.user = JSON.parse(user);
        console.log(this.user);
    };
    UpdateDogPage.prototype.update = function () {
        var _this = this;
        this.loadingIndicator = this.loading.create();
        this.loadingIndicator.present();
        if (this.newImage) {
            this.details.image = this.img;
        }
        this.rest.put('dog', this.details)
            .subscribe(function (response) {
            _this.presentToast("Dog profile successfully updated");
            _this.sharedData.selectedDog.name = _this.details.name;
            _this.sharedData.selectedDog.breed = _this.details.breed;
            _this.loadingIndicator.dismiss();
            _this.getDOgs();
            console.log(response);
        }, function (error) {
            _this.loadingIndicator.dismiss();
            _this.presentToast("Unable to update dog profile");
            console.log("Unable to update dog profile", error);
        });
    };
    UpdateDogPage.prototype.getDOgs = function () {
        var _this = this;
        this.rest.get('dog', '', { userid: this.user.id })
            .subscribe(function (response) {
            _this.user.dogs = response;
            _this.storage.set('dogappuser', JSON.stringify(_this.user));
        }, function (error) {
            console.log(error);
        });
    };
    UpdateDogPage.prototype.openLibrary = function () {
        var self = this;
        this.camera.getPicture(this.options).then(function (imageData) {
            self.img = 'data:image/jpeg;base64,' + imageData;
            self.newImage = true;
            console.log(self.img);
        }, function (err) {
            console.log("error camera", err);
        });
    };
    UpdateDogPage.prototype.ready = function () {
        if (_.values(this.details).indexOf('') >= 0)
            return false;
        return true;
    };
    UpdateDogPage.prototype.presentToast = function (message) {
        var toast = this.toast.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    UpdateDogPage = __decorate([
        Component({
            selector: 'page-update-dog',
            templateUrl: 'update-dog.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            ToastController,
            Camera,
            SharedDataProvider,
            RestProvider,
            StorageProvider])
    ], UpdateDogPage);
    return UpdateDogPage;
}());
export { UpdateDogPage };
//# sourceMappingURL=update-dog.js.map