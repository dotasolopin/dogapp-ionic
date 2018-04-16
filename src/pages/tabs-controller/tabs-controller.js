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
import { DogLocationPage } from '../dog-location/dog-location';
import { DogTemperaturePage } from '../dog-temperature/dog-temperature';
import { OptionsPage } from '../options/options';
var TabsControllerPage = /** @class */ (function () {
    function TabsControllerPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.tab1Root = DogLocationPage;
        this.tab2Root = DogTemperaturePage;
        this.tab3Root = OptionsPage;
    }
    TabsControllerPage.prototype.tempClick = function () {
        console.log("Click! temp");
    };
    TabsControllerPage = __decorate([
        Component({
            selector: 'page-tabs-controller',
            templateUrl: 'tabs-controller.html'
        }),
        __metadata("design:paramtypes", [NavController])
    ], TabsControllerPage);
    return TabsControllerPage;
}());
export { TabsControllerPage };
//# sourceMappingURL=tabs-controller.js.map