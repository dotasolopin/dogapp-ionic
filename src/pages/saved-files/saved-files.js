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
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ViewLocationPage } from '../view-location/view-location';
var SavedFilesPage = /** @class */ (function () {
    function SavedFilesPage(navCtrl, navParams, alertCtrl, loadingCtrl, toast, rest, sharedData) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toast = toast;
        this.rest = rest;
        this.sharedData = sharedData;
        this.temperatures = [];
        this.locations = [];
        this.tabIndex = 0;
        this.busy = false;
    }
    SavedFilesPage.prototype.ionViewDidLoad = function () {
        this.getLocation();
        this.getTemperature();
        console.log("dogid", this.sharedData.selectedDog.id);
    };
    SavedFilesPage.prototype.getTemperature = function () {
        var _this = this;
        var self = this;
        this.busy = true;
        this.rest.get('temperature', '', { dogid: this.sharedData.selectedDog.id })
            .subscribe(function (response) {
            self.temperatures = response;
            _this.busy = false;
        }, function (error) {
            _this.busy = false;
            console.log("error getTemperature", error);
        });
    };
    SavedFilesPage.prototype.getLocation = function () {
        var _this = this;
        var self = this;
        this.busy = true;
        this.rest.get('location', '', { dogid: this.sharedData.selectedDog.id })
            .subscribe(function (response) {
            self.locations = response;
            _this.busy = false;
        }, function (error) {
            _this.busy = false;
            console.log("error getLocation", error);
        });
    };
    SavedFilesPage.prototype.getDate = function (date) {
        var d = date.replace(" ", "T").concat("Z");
        return d;
    };
    SavedFilesPage.prototype.getColor = function (index) {
        if (index == this.tabIndex)
            return 'primary';
        return 'light';
    };
    SavedFilesPage.prototype.changeTab = function (index) {
        this.getLocation();
        this.getTemperature();
        this.tabIndex = index;
    };
    SavedFilesPage.prototype.viewLocation = function (location) {
        console.log(location);
        this.navCtrl.push(ViewLocationPage, { location: location });
    };
    SavedFilesPage.prototype.confirmDelete = function (id, t) {
        var self = this;
        var alert = this.alertCtrl.create({
            title: 'Confirm delete',
            message: 'Do you want to delete this record?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () { }
                },
                {
                    text: 'Yes',
                    handler: function () {
                        if (t == 'location') {
                            self.removeLocation(id);
                        }
                        else if (t == 'temperature') {
                            self.removeTemperature(id);
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    SavedFilesPage.prototype.removeLocation = function (id) {
        var self = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.rest.delete('location/', id)
            .subscribe(function (response) {
            loading.dismiss();
            self.presentToast("Location removed");
            self.getLocation();
        }, function (error) {
            loading.dismiss();
            self.presentToast("Unable to removed location");
        });
    };
    SavedFilesPage.prototype.removeTemperature = function (id) {
        var self = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.rest.delete('temperature/', id)
            .subscribe(function (response) {
            loading.dismiss();
            self.presentToast("Temperature removed");
            self.getTemperature();
        }, function (error) {
            loading.dismiss();
            self.presentToast("Unable to removed temperature");
        });
    };
    SavedFilesPage.prototype.presentToast = function (message) {
        var toast = this.toast.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    SavedFilesPage = __decorate([
        Component({
            selector: 'page-saved-files',
            templateUrl: 'saved-files.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AlertController,
            LoadingController,
            ToastController,
            RestProvider,
            SharedDataProvider])
    ], SavedFilesPage);
    return SavedFilesPage;
}());
export { SavedFilesPage };
//# sourceMappingURL=saved-files.js.map