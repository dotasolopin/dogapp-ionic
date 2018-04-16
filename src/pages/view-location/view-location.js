var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
var ViewLocationPage = /** @class */ (function () {
    function ViewLocationPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.location = this.navParams.get('location');
    }
    ViewLocationPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ViewLocationPage');
        this.loadMap();
    };
    ViewLocationPage.prototype.loadMap = function () {
        console.log(this.location);
        var latLng = new google.maps.LatLng(this.location.latitude, this.location.longitude);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.viewmap = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        //add marker
        var marker = new google.maps.Marker({
            map: this.viewmap,
            animation: google.maps.Animation.DROP,
            position: this.viewmap.getCenter()
        });
        var content = "<p>Your dog is here!</p>" + "<p>Latitude: " + this.location.latitude + "</p><p>Longitude:" + this.location.longitude + "</p>";
        // this.addInfoWindow(marker, content);
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        // google.maps.event.addListener(marker, 'idle', () => {
        infoWindow.open(this.viewmap, marker);
    };
    __decorate([
        ViewChild('viewmap'),
        __metadata("design:type", ElementRef)
    ], ViewLocationPage.prototype, "mapElement", void 0);
    ViewLocationPage = __decorate([
        Component({
            selector: 'page-view-location',
            templateUrl: 'view-location.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams])
    ], ViewLocationPage);
    return ViewLocationPage;
}());
export { ViewLocationPage };
//# sourceMappingURL=view-location.js.map