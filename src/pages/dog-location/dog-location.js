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
import 'rxjs/add/operator/filter';
import { RestProvider } from '../../providers/rest/rest';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
var DogLocationPage = /** @class */ (function () {
    function DogLocationPage(rest, navCtrl, loading, toast, geolocation, sharedData) {
        this.rest = rest;
        this.navCtrl = navCtrl;
        this.loading = loading;
        this.toast = toast;
        this.geolocation = geolocation;
        this.sharedData = sharedData;
        // ref https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates-shows-wrong?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
        this.earthRadius = 6371; // Radius of the earth in km
    }
    DogLocationPage.prototype.ionViewDidLoad = function () {
        this.getPosition();
        this.loadMap();
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
        // this.geolocation.getCurrentPosition().then((position) => {
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
                self.updateMap();
            }, 5000);
        });
        // }, (err) => {
        //   console.log(err);
        // });
        // (success) => {
        //   console.log(success);
        // }
    };
    DogLocationPage.prototype.getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.degreesToRadius(lat2 - lat1); // this.degreesToRadius below
        var dLon = this.degreesToRadius(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degreesToRadius(lat1)) * Math.cos(this.degreesToRadius(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
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
            // test only
            data.longitude = 124.8;
            data.latitude = 8.9;
            var latLng = new google.maps.LatLng(data.latitude, data.longitude);
            _this.marker.setPosition(latLng);
            console.log(data);
            if (self.userPosition) {
                var latDegrees = _this.degreesToRadius(self.userPosition.latitude - data.latitude);
                var lonDegrees = _this.degreesToRadius(self.userPosition.longitude - data.longitude);
                var a = Math.sin(latDegrees / 2) * Math.sin(latDegrees / 2) +
                    Math.cos(_this.degreesToRadius(self.userPosition.latitude)) * Math.cos(_this.degreesToRadius(lat2)) *
                        Math.sin(lonDegrees / 2) * Math.sin(lonDegrees / 2);
                var userPos = new LatLon(Dms.parseDMS(self.userPosition.latitude), Dms.parseDMS(self.userPosition.longitude));
                var dogPos = new LatLon(Dms.parseDMS(data.latitude), Dms.parseDMS(data.longitude));
                var distance = parseFloat(userPos.distanceTo(dogPos).toPrecision(4));
                console.log(distance);
            }
            setTimeout(function () {
                self.updateMap();
            }, 5000);
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
    DogLocationPage.prototype.saveLocation = function () {
        var _this = this;
        this.loadingIndicator = this.loading.create();
        this.loadingIndicator.present();
        if ([this.mapData.longitude, this.mapData.latitude].indexOf(null) > 0)
            return;
        var data = {
            dogid: this.sharedData.selectedDog.id,
            longitude: this.mapData.longitude,
            latitude: this.mapData.latitude
        };
        this.rest.post('location', data)
            .subscribe(function (response) {
            _this.presentToast("Location successfully saved");
            _this.loadingIndicator.dismiss();
            console.log(response);
        }, function (error) {
            _this.loadingIndicator.dismiss();
            _this.presentToast("Unable to save location");
            console.log("Unable to save location", error);
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
            SharedDataProvider])
    ], DogLocationPage);
    return DogLocationPage;
}());
export { DogLocationPage };
//# sourceMappingURL=dog-location.js.map