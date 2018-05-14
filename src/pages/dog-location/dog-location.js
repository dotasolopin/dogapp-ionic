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
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';
import 'rxjs/add/operator/filter';
import * as moment from 'moment';
import { RestProvider } from '../../providers/rest/rest';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
var DogLocationPage = /** @class */ (function () {
    function DogLocationPage(rest, navCtrl, loading, toast, geolocation, sharedData, localNotifications) {
        this.rest = rest;
        this.navCtrl = navCtrl;
        this.loading = loading;
        this.toast = toast;
        this.geolocation = geolocation;
        this.sharedData = sharedData;
        this.localNotifications = localNotifications;
        this.time = '';
        // ref https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates-shows-wrong?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
        this.earthRadius = 6371; // Radius of the earth in km
        this.dogDistance = 0;
        // ref https://stackoverflow.com/questions/28928906/google-maps-api-drawing-routes-from-an-array-of-points
        this.dogLocations = [];
    }
    DogLocationPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.getPosition();
        this.loadMap();
        setInterval(function () { _this.getTime(); }, 1000);
    };
    DogLocationPage.prototype.getTime = function () {
        this.time = moment().format();
    };
    DogLocationPage.prototype.getPosition = function () {
        var _this = this;
        var subscription = this.geolocation.watchPosition()
            .filter(function (p) { return p.coords !== undefined; })
            .subscribe(function (position) {
            _this.userPosition = position.coords;
            console.log(position.coords.longitude + ' ' + position.coords.latitude);
        });
    };
    DogLocationPage.prototype.loadMap = function () {
        var _this = this;
        var self = this;
        this.rest.passData("devices/3", "").subscribe(function (data) {
            var latLng = new google.maps.LatLng(data.latitude, data.longitude);
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            _this.mapData = data;
            console.log(data);
            _this.map = new google.maps.Map(_this.mapElement.nativeElement, mapOptions);
            //add marker
            _this.marker = new google.maps.Marker({
                map: _this.map,
                animation: google.maps.Animation.DROP,
                position: _this.map.getCenter()
            });
            var dogName = (_this.sharedData.selectedDog) ? _this.sharedData.selectedDog.name : 'Your dog';
            var content = "<p>" + dogName + " is here</p>";
            // this.addInfoWindow(marker, content);
            var infoWindow = new google.maps.InfoWindow({
                content: content
            });
            // google.maps.event.addListener(marker, 'idle', () => {
            infoWindow.open(_this.map, _this.marker);
            // });
            //add marker
            setTimeout(function () {
                // self.updateMap();
            }, 5000);
        });
    };
    DogLocationPage.prototype.degreesToRadius = function (deg) {
        return deg * (Math.PI / 180);
    };
    DogLocationPage.prototype.updateMap = function () {
        var _this = this;
        var self = this;
        this.rest.passData("devices/3", "")
            .filter(function (d) { return d !== undefined; })
            .subscribe(function (data) {
            console.log("API DATA", data);
            var latLng = new google.maps.LatLng(data.latitude, data.longitude);
            _this.marker.setPosition(latLng);
            console.log("LatLong to Push", latLng);
            _this.dogLocations.push(latLng);
            if (self.userPosition) {
                var latDegrees = _this.degreesToRadius(self.userPosition.latitude - data.latitude);
                var lonDegrees = _this.degreesToRadius(self.userPosition.longitude - data.longitude);
                var a = Math.sin(latDegrees / 2) * Math.sin(latDegrees / 2) +
                    Math.cos(_this.degreesToRadius(self.userPosition.latitude)) * Math.cos(_this.degreesToRadius(data.latitude)) *
                        Math.sin(lonDegrees / 2) * Math.sin(lonDegrees / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = _this.earthRadius * c; // Distance in km
                var m = void 0;
                if (d < 1) {
                    m = true;
                    d = parseFloat((d * 1000).toFixed(2)); // convert to meters
                }
                else {
                    m = false;
                    d = parseFloat(d.toFixed(2)); // remain to km
                }
                if ((!m && d != _this.dogDistance) || (d > 5 && d != _this.dogDistance)) {
                    _this.dogDistance = d;
                    var dogName = (self.sharedData.selectedDog) ? self.sharedData.selectedDog.name : 'Your dog';
                    self.localNotifications.schedule({
                        id: new Date().getTime(),
                        text: dogName + " is " + d + " " + (m ? 'meters' : 'kilometers') + " away from you"
                    });
                    console.log("must notify");
                }
                console.log(d);
            }
            var flightPath = new google.maps.Polyline({
                map: _this.map,
                path: _this.dogLocations,
                strokeColor: "#FF0000",
                strokeOpacity: 1,
                strokeWeight: 1
            });
            setTimeout(function () {
                self.updateMap();
            }, 10000);
        });
    };
    DogLocationPage.prototype.addInfoWindow = function (marker, content) {
        var _this = this;
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        google.maps.event.addListener(marker, 'idle', function () {
            infoWindow.open(_this.map, marker);
        });
    };
    DogLocationPage.prototype.save = function () {
        var _this = this;
        this.loadingIndicator = this.loading.create();
        this.loadingIndicator.present();
        if ([this.mapData.longitude, this.mapData.latitude].indexOf(null) > 0)
            return;
        var time = moment().format();
        var locationData = {
            dogid: this.sharedData.selectedDog.id,
            longitude: this.mapData.longitude,
            latitude: this.mapData.latitude,
            time: 
        };
        var temparatureData = {
            dogid: this.sharedData.selectedDog.id,
            temperature: this.temperature
        };
        this.rest.post('location', locationData)
            .subscribe(function (response) {
            _this.presentToast("Data successfully saved");
            _this.loadingIndicator.dismiss();
            console.log(response);
        }, function (error) {
            _this.loadingIndicator.dismiss();
            _this.presentToast("Unable to save data");
            console.log("Unable to save data", error);
        });
    };
    DogLocationPage.prototype.presentToast = function (message) {
        var toast = this.toast.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], DogLocationPage.prototype, "mapElement", void 0);
    DogLocationPage = __decorate([
        Component({
            selector: 'page-dog-location',
            templateUrl: 'dog-location.html'
        }),
        __metadata("design:paramtypes", [RestProvider,
            NavController,
            LoadingController,
            ToastController,
            Geolocation,
            SharedDataProvider,
            LocalNotifications])
    ], DogLocationPage);
    return DogLocationPage;
}());
export { DogLocationPage };
//# sourceMappingURL=dog-location.js.map