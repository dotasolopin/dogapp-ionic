var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuController } from 'ionic-angular';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';
import { AddDogPage } from '../pages/add-dog/add-dog';
import { StorageProvider } from '../providers/storage/storage';
import { SharedDataProvider } from '../providers/shared-data/shared-data';
import { RestProvider } from '../providers/rest/rest';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, menuCtrl, events, storage, sharedData, rest, alertCtrl, toast) {
        var _this = this;
        this.menuCtrl = menuCtrl;
        this.events = events;
        this.storage = storage;
        this.sharedData = sharedData;
        this.rest = rest;
        this.alertCtrl = alertCtrl;
        this.toast = toast;
        this.isAddDog = false;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            _this.setRoute();
            events.subscribe('user:setDog', function (dogs) {
                _this.dogs = dogs;
                if (!_this.sharedData.selectedDog) {
                    _this.sharedData.selectedDog = dogs[0];
                }
            });
            events.subscribe('user:addDog', function (dog) {
                _this.dogs.push(dog);
            });
        });
    }
    MyApp.prototype.addDog = function () {
        this.isAddDog = true;
        this.menuCtrl.close();
        this.nav.setRoot(AddDogPage);
    };
    MyApp.prototype.setRoute = function () {
        var user = this.storage.get('dogappuser');
        if (!user)
            return this.nav.setRoot(LoginPage);
        this.user = JSON.parse(user);
        if (this.user.dogs.length == 0)
            this.nav.setRoot(AddDogPage);
        else
            this.nav.setRoot(TabsControllerPage);
        this.dogs = this.user.dogs;
        this.sharedData.selectedDog = this.dogs[0];
    };
    MyApp.prototype.openPage = function (page) {
        this.activePage = page;
        this.nav.setRoot(page.component);
    };
    MyApp.prototype.selectDog = function (dog) {
        if (this.isAddDog) {
            this.nav.setRoot(TabsControllerPage);
        }
        this.sharedData.selectedDog = dog;
        this.isAddDog = false;
    };
    MyApp.prototype.checkSelectedDog = function (dog) {
        return dog === this.sharedData.selectedDog;
    };
    MyApp.prototype.logout = function () {
        this.menuCtrl.close();
        this.storage.remove('dogappuser');
        this.nav.setRoot(LoginPage);
        this.sharedData.selectedDog = null;
    };
    MyApp.prototype.presentToast = function (message) {
        var toast = this.toast.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform,
            StatusBar,
            SplashScreen,
            MenuController,
            Events,
            StorageProvider,
            SharedDataProvider,
            RestProvider,
            AlertController,
            ToastController])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map