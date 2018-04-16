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
import { LoadingController, ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import * as _ from 'lodash';
var SignupPage = /** @class */ (function () {
    function SignupPage(navCtrl, loading, toast, rest) {
        this.navCtrl = navCtrl;
        this.loading = loading;
        this.toast = toast;
        this.rest = rest;
        this.details = {
            firstname: '',
            lastname: '',
            address: '',
            gender: '',
            status: '',
            username: '',
            password: ''
        };
    }
    SignupPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LoginPage');
    };
    SignupPage.prototype.signup = function () {
        var _this = this;
        this.loadingIndicator = this.loading.create();
        this.loadingIndicator.present();
        this.rest.post('user', this.details)
            .subscribe(function (response) {
            _this.loadingIndicator.dismiss();
            console.log(response);
            _this.presentToast(response.message);
            _this.navCtrl.pop();
        }, function (error) {
            _this.loadingIndicator.dismiss();
            _this.presentToast("Unable to create user");
            console.log("Unable to create user", error);
        });
    };
    SignupPage.prototype.gotoLogin = function () {
        this.navCtrl.pop();
    };
    SignupPage.prototype.ready = function () {
        if (_.values(this.details).indexOf('') >= 0)
            return false;
        return true;
    };
    SignupPage.prototype.presentToast = function (message) {
        var toast = this.toast.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    SignupPage = __decorate([
        Component({
            selector: 'page-signup',
            templateUrl: 'signup.html'
        }),
        __metadata("design:paramtypes", [NavController,
            LoadingController,
            ToastController,
            RestProvider])
    ], SignupPage);
    return SignupPage;
}());
export { SignupPage };
//# sourceMappingURL=signup.js.map