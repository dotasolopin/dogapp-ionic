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
import { Nav, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { RestProvider } from '../../providers/rest/rest';
import { StorageProvider } from '../../providers/storage/storage';
import { TabsControllerPage } from '../../pages/tabs-controller/tabs-controller';
import * as _ from 'lodash';
/**
 * Generated class for the AddDogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AddDogPage = /** @class */ (function () {
    function AddDogPage(nav, navCtrl, navParams, datePicker, loading, toast, events, rest, storage) {
        this.nav = nav;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.datePicker = datePicker;
        this.loading = loading;
        this.toast = toast;
        this.events = events;
        this.rest = rest;
        this.storage = storage;
        this.showHeader = false;
        this.details = {
            userid: '',
            name: '',
            breed: '',
            birthdate: new Date(),
            gender: ''
        };
        this.displayDate = new Date();
        var user = this.storage.get('dogappuser');
        this.user = JSON.parse(user);
        if (this.user.dogs.length > 0)
            this.showHeader = true;
        this.details.userid = this.user.id;
    }
    AddDogPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AddDogPage');
    };
    AddDogPage.prototype.openDatepicker = function () {
        var _this = this;
        console.log("asd");
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(function (date) {
            if (date) {
                _this.details.birthdate = date;
                _this.displayDate = date;
            }
        }, function (err) { return console.log('Error occurred while getting date: ', err); });
    };
    AddDogPage.prototype.addDog = function () {
        var _this = this;
        this.loadingIndicator = this.loading.create();
        this.loadingIndicator.present();
        this.details.birthdate = new Date(this.details.birthdate);
        this.rest.post('dog', this.details)
            .subscribe(function (response) {
            _this.loadingIndicator.dismiss();
            console.log(response);
            _this.user.dogs.push(response);
            if (_this.user.dogs.length > 1) {
                _this.events.publish('user:addDog', response);
            }
            else {
                _this.events.publish('user:setDog', _this.user.dogs);
            }
            _this.storage.set('dogappuser', JSON.stringify(_this.user));
            _this.presentToast(_this.details.name + " successfully added");
            _this.nav.setRoot(TabsControllerPage);
        }, function (error) {
            _this.loadingIndicator.dismiss();
            _this.presentToast("Unable to add dog");
            console.log("Unable to add dog", error);
        });
    };
    AddDogPage.prototype.ready = function () {
        if (_.values(this.details).indexOf('') >= 0)
            return false;
        return true;
    };
    AddDogPage.prototype.presentToast = function (message) {
        var toast = this.toast.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    AddDogPage = __decorate([
        Component({
            selector: 'page-add-dog',
            templateUrl: 'add-dog.html',
        }),
        __metadata("design:paramtypes", [Nav,
            NavController,
            NavParams,
            DatePicker,
            LoadingController,
            ToastController,
            Events,
            RestProvider,
            StorageProvider])
    ], AddDogPage);
    return AddDogPage;
}());
export { AddDogPage };
//# sourceMappingURL=add-dog.js.map