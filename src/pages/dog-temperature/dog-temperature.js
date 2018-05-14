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
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { RestProvider } from '../../providers/rest/rest';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
var DogTemperaturePage = /** @class */ (function () {
    function DogTemperaturePage(rest, navCtrl, loading, toast, sharedData, localNotifications) {
        this.rest = rest;
        this.navCtrl = navCtrl;
        this.loading = loading;
        this.toast = toast;
        this.sharedData = sharedData;
        this.localNotifications = localNotifications;
    }
    DogTemperaturePage.prototype.ionViewDidLoad = function () {
        this.getTemp();
    };
    DogTemperaturePage.prototype.getTemp = function () {
        var _this = this;
        var self = this;
        this.rest.passData("devices/3", "").subscribe(function (data) {
            if ((parseFloat(data.temp + "") > 37 || parseFloat(data.temp + "") < 27) && (_this.temp != data.temp)) {
                var dogName = (self.sharedData.selectedDog) ? self.sharedData.selectedDog.name : 'Your dog';
                self.localNotifications.schedule({
                    id: 1,
                    text: dogName + "'s temperature is now " + data.temp
                });
            }
            self.temp = data.temp;
            setTimeout(function () {
                self.getTemp();
            }, 5000);
        });
    };
    DogTemperaturePage.prototype.saveTemperature = function () {
        var _this = this;
        if (this.temp == null)
            return;
        this.loadingIndicator = this.loading.create();
        this.loadingIndicator.present();
        var data = {
            dogid: this.sharedData.selectedDog.id,
            temperature: this.temp
        };
        this.rest.post('temperature', data)
            .subscribe(function (response) {
            _this.presentToast("Temperature successfully saved");
            _this.loadingIndicator.dismiss();
            console.log(response);
        }, function (error) {
            _this.loadingIndicator.dismiss();
            _this.presentToast("Unable to save temperature");
            console.log("Unable to save temperature", error);
        });
    };
    DogTemperaturePage.prototype.presentToast = function (message) {
        var toast = this.toast.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    DogTemperaturePage = __decorate([
        Component({
            selector: 'page-dog-temperature',
            templateUrl: 'dog-temperature.html'
        }),
        __metadata("design:paramtypes", [RestProvider,
            NavController,
            LoadingController,
            ToastController,
            SharedDataProvider,
            LocalNotifications])
    ], DogTemperaturePage);
    return DogTemperaturePage;
}());
export { DogTemperaturePage };
//# sourceMappingURL=dog-temperature.js.map