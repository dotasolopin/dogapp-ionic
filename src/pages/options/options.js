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
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { UpdateProfilePage } from '../update-profile/update-profile';
import { UpdateDogPage } from '../update-dog/update-dog';
import { SavedFilesPage } from '../saved-files/saved-files';
var OptionsPage = /** @class */ (function () {
    function OptionsPage(navCtrl, sharedData) {
        this.navCtrl = navCtrl;
        this.sharedData = sharedData;
        this.pages = {
            'user': UpdateProfilePage,
            'dog': UpdateDogPage,
            'file': SavedFilesPage
        };
    }
    OptionsPage.prototype.gotoPage = function (key) {
        this.navCtrl.push(this.pages[key]);
    };
    OptionsPage = __decorate([
        Component({
            selector: 'page-options',
            templateUrl: 'options.html'
        }),
        __metadata("design:paramtypes", [NavController,
            SharedDataProvider])
    ], OptionsPage);
    return OptionsPage;
}());
export { OptionsPage };
//# sourceMappingURL=options.js.map