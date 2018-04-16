var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Headers, RequestOptions, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { StorageProvider } from '../storage/storage';
/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var RestProvider = /** @class */ (function () {
    function RestProvider(http, storage) {
        this.http = http;
        this.storage = storage;
        this.apiUrl = 'https://doggieapp2.herokuapp.com/';
        this.backendUrl = 'http://localhost/dogapp-server/api/';
        console.log('Hello RestProvider Provider');
    }
    RestProvider.prototype.passData = function (method, data) {
        var _this = this;
        /* Passes data to server*/
        var opt; //call requestoption class to enable headers
        var myHeaders = new Headers(); // calls headers calss
        var headers = new Headers({
            //api key for security
            // 'key':'4d80e4e0-ddf8-457c-b2dd-b102d9444444',
            'Content-Type': 'application/json'
        });
        var options = new RequestOptions({ headers: headers });
        return Observable.create(function (observer) {
            var urlTemp = _this.apiUrl + method; //links data together
            _this.http.get(urlTemp, options)
                .subscribe(function (msg) {
                /*If observers has no error */
                observer.next(msg.json());
                observer.complete();
            }, function (msg) {
                /*If observers has error */
                observer.next(msg.json());
                // this.alert = true;
            }, function () {
                observer.complete(); //If observers completes transactions
            });
        });
    };
    RestProvider.prototype.get = function (endpoint, id, params) {
        if (id === void 0) { id = ''; }
        if (params === void 0) { params = {}; }
        var url = this.getBackendUrl();
        return this.http.get(url + endpoint + id, this.createRequestHeaders(params))
            .map(function (response) { return response.json(); });
    };
    RestProvider.prototype.post = function (endpoint, data) {
        var url = this.getBackendUrl();
        return this.http.post(url + endpoint, data)
            .map(function (response) { return response.json(); });
    };
    RestProvider.prototype.put = function (endpoint, data) {
        var url = this.getBackendUrl();
        return this.http.put(url + endpoint, data)
            .map(function (response) { return response.json(); });
    };
    RestProvider.prototype.delete = function (endpoint, id) {
        var url = this.getBackendUrl();
        return this.http.delete(url + endpoint + id)
            .map(function (response) { return response.json(); });
    };
    RestProvider.prototype.createRequestHeaders = function (params) {
        var headers = new Headers({ 'Content-Type': 'application/json', "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE" });
        return new RequestOptions({ headers: headers, params: params });
    };
    RestProvider.prototype.getBackendUrl = function () {
        return "http://localhost/dogapp-server/api/";
        // return "https://stark-refuge-28510.herokuapp.com/index.php/api/";
        // return this.storage.get('dogappbackendurl') || '';
    };
    RestProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            StorageProvider])
    ], RestProvider);
    return RestProvider;
}());
export { RestProvider };
//# sourceMappingURL=rest.js.map