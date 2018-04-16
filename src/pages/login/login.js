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
import { NavController } from 'ionic-angular';
import { LoadingController, ToastController, Nav, Events } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { RestProvider } from '../../providers/rest/rest';
import { StorageProvider } from '../../providers/storage/storage';
import { SignupPage } from '../signup/signup';
import { AddDogPage } from '../add-dog/add-dog';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import * as _ from 'lodash';
var LoginPage = /** @class */ (function () {
    function LoginPage(nav, navCtrl, loading, toast, datePicker, events, rest, storage) {
        this.nav = nav;
        this.navCtrl = navCtrl;
        this.loading = loading;
        this.toast = toast;
        this.datePicker = datePicker;
        this.events = events;
        this.rest = rest;
        this.storage = storage;
        this.auth = {
            username: '',
            password: ''
        };
    }
    LoginPage.prototype.ionViewDidLoad = function () {
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        this.loadingIndicator = this.loading.create();
        this.loadingIndicator.present();
        this.rest.post('auth', this.auth)
            .subscribe(function (response) {
            _this.loadingIndicator.dismiss();
            console.log(response);
            _this.storage.set('dogappuser', JSON.stringify(response));
            if (!response.dogs.length) {
                _this.nav.setRoot(AddDogPage);
                return;
            }
            _this.events.publish('user:setDog', response.dogs);
            _this.nav.setRoot(TabsControllerPage);
        }, function (error) {
            _this.loadingIndicator.dismiss();
            _this.presentToast("Invalid credentials");
            console.log("Invalid credentials", error);
        });
    };
    LoginPage.prototype.gotoSignup = function () {
        this.navCtrl.push(SignupPage);
    };
    LoginPage.prototype.ready = function () {
        if (_.values(this.auth).indexOf('') >= 0)
            return false;
        return true;
    };
    LoginPage.prototype.presentToast = function (message) {
        var toast = this.toast.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    LoginPage = __decorate([
        Component({
            selector: 'page-login',
            templateUrl: 'login.html'
        }),
        __metadata("design:paramtypes", [Nav,
            NavController,
            LoadingController,
            ToastController,
            DatePicker,
            Events,
            RestProvider,
            StorageProvider])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map