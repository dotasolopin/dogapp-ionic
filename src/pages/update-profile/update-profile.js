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
import { StorageProvider } from '../../providers/storage/storage';
import { RestProvider } from '../../providers/rest/rest';
import { Camera } from '@ionic-native/camera';
import * as _ from 'lodash';
var UpdateProfilePage = /** @class */ (function () {
    function UpdateProfilePage(navCtrl, navParams, loading, toast, storage, camera, rest) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loading = loading;
        this.toast = toast;
        this.storage = storage;
        this.camera = camera;
        this.rest = rest;
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
    UpdateProfilePage.prototype.ionViewDidLoad = function () {
        var user = this.storage.get('dogappuser');
        user = JSON.parse(user);
        this.img = user.image;
        this.details = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            address: user.address,
            status: user.status
        };
        console.log('ionViewDidLoad UpdateProfilePage');
    };
    UpdateProfilePage.prototype.update = function () {
        var _this = this;
        this.loadingIndicator = this.loading.create();
        this.loadingIndicator.present();
        if (this.newImage) {
            this.details.image = this.img;
        }
        this.rest.put('user', this.details)
            .subscribe(function (response) {
            _this.presentToast("Profile successfully updated");
            _this.newImage = false;
            _this.loadingIndicator.dismiss();
            _this.getUser();
            console.log(response);
        }, function (error) {
            _this.loadingIndicator.dismiss();
            _this.presentToast("Unable to update profile");
            console.log("Unable to update profile", error);
        });
    };
    UpdateProfilePage.prototype.getUser = function () {
        var _this = this;
        this.rest.get('user', '', { id: this.details.id })
            .subscribe(function (response) {
            _this.storage.set('dogappuser', JSON.stringify(response));
        }, function (error) {
            console.log(error);
        });
    };
    UpdateProfilePage.prototype.openLibrary = function () {
        var self = this;
        this.camera.getPicture(this.options).then(function (imageData) {
            self.img = 'data:image/jpeg;base64,' + imageData;
            self.newImage = true;
            console.log(self.img);
        }, function (err) {
            console.log("error camera", err);
        });
    };
    UpdateProfilePage.prototype.ready = function () {
        if (_.values(this.details).indexOf('') >= 0)
            return false;
        return true;
    };
    UpdateProfilePage.prototype.presentToast = function (message) {
        var toast = this.toast.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    UpdateProfilePage = __decorate([
        Component({
            selector: 'page-update-profile',
            templateUrl: 'update-profile.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            ToastController,
            StorageProvider,
            Camera,
            RestProvider])
    ], UpdateProfilePage);
    return UpdateProfilePage;
}());
export { UpdateProfilePage };
//# sourceMappingURL=update-profile.js.map