import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/filter';
import * as moment from 'moment';

import { RestProvider } from '../../providers/rest/rest';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { AddressProvider } from '../../providers/address/address';

declare var LatLon:any;
declare var Dms:any;


declare var google;

@Component({
  selector: 'page-dog-location',
  templateUrl: 'dog-location.html'
})
export class DogLocationPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;

  loadingIndicator:any;
  mapData:any;
  time:any = '';
  temperature:any = 0;

  userPosition:any;

  // ref https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates-shows-wrong?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
  earthRadius:number = 6371; // Radius of the earth in km
  dogDistance:any = 0;

  // ref https://stackoverflow.com/questions/28928906/google-maps-api-drawing-routes-from-an-array-of-points
  dogLocations:any = [];


  constructor(
    private rest:RestProvider,
    public navCtrl: NavController,
    private loading: LoadingController,
    private toast: ToastController,
    public geolocation: Geolocation,
    private sharedData: SharedDataProvider,
    private localNotifications: LocalNotifications,
    private addressProvider: AddressProvider
    ) { }

  ionViewDidLoad(){
    this.getPosition();
    this.loadMap();
    setInterval(()=>{this.getTime()}, 1000);
  }

  getTime() {
    this.time = moment().format();
  }

  getPosition() {
    const subscription = 
    this.geolocation.watchPosition()
    .filter((p) => p.coords !== undefined)
    .subscribe(position => {
      this.userPosition = position.coords;
      console.log(position.coords.longitude + ' ' + position.coords.latitude);
    });

  }
 
  loadMap(){
    let self = this;

      this.rest.passData("devices/3","").subscribe(data=>{
        this.temperature = data.temp;

        this.mapData = data;
        console.log(data);

        let oFloor = Math.floor(this.temperature);
        let nFloor = Math.floor(data.temp);

        if((parseFloat(data.temp + "") > 39 || parseFloat(data.temp + "") < 27) &&  (oFloor != nFloor)) {

          let dogName = (self.sharedData.selectedDog) ? self.sharedData.selectedDog.name : 'Your dog';

          self.localNotifications.schedule({
            id: 1,
            text: `${dogName}'s temperature is now ${data.temp}℃` 
          });
        }

        let latLong = new google.maps.LatLng(data.latitude, data.longitude);
        let mapOptions = {
          center: latLong,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
      
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        //add marker
        this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.map.getCenter()
        });
        let dogName = (this.sharedData.selectedDog) ? this.sharedData.selectedDog.name : 'Your dog';
        let content = `<p>${dogName} is here</p>`;
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });
      
        infoWindow.open(this.map, this.marker);
        setTimeout(() => {
          self.updateMap();
        }, 5000)
      });
  }

  degreesToRadius(deg) {
    return deg * (Math.PI/180)
  }


  updateMap() {
    let self = this;
    this.rest.passData("devices/3","")
    .filter((d) =>  d !== undefined )
    .subscribe(data=>{
      console.log("API DATA", data)
        
        // data.longitude = 124.76466090000001;
        // data.latitude = 8.508911;
        this.mapData = data;
        console.log(data);

      let latLong = new google.maps.LatLng(data.latitude, data.longitude);
      this.marker.setPosition(latLong);

      console.log("LatLong to Push", latLong);
      this.dogLocations.push(latLong);

      if(self.userPosition) {

        let latDegrees = this.degreesToRadius(self.userPosition.latitude - data.latitude);
        let lonDegrees = this.degreesToRadius(self.userPosition.longitude - data.longitude);
        let a = 
          Math.sin(latDegrees/2) * Math.sin(latDegrees/2) +
          Math.cos(this.degreesToRadius(self.userPosition.latitude)) * Math.cos(this.degreesToRadius(data.latitude)) * 
          Math.sin(lonDegrees/2) * Math.sin(lonDegrees/2)

        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        let d = this.earthRadius * c; // Distance in km
        let m;

        if(d < 1) {
          m = true;
          d = parseFloat((d * 1000).toFixed(2)); // convert to meters
        }
        else {
          m = false;
          d = parseFloat(d.toFixed(2)); // remain to km
        }

        if( (!m && d != this.dogDistance) || (m && d > 10 && d != this.dogDistance)) {
          this.dogDistance = d;
          let dogName = (self.sharedData.selectedDog) ? self.sharedData.selectedDog.name : 'Your dog';
          self.localNotifications.schedule({
            id: 2,
            text: `${dogName} is ${d} ${m ? 'meters':'kilometers'} away from you`
          });
        }

        console.log(d);

      }

      var flightPath = new google.maps.Polyline({
          map: this.map,
          path: this.dogLocations,
          strokeColor: "#FF0000",
          strokeOpacity: 1,
          strokeWeight: 1
      });


      setTimeout(() => {
        self.updateMap();
      }, 8000)
    })

  }
  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'idle', () => {
      infoWindow.open(this.map, marker);
    });
   
  }

  getAddress() {

    let data = this.mapData;

    let pos = new google.maps.LatLng(data.latitude, data.longitude);;

    var google_maps_geocoder = new google.maps.Geocoder();
    google_maps_geocoder.geocode(
      { 'latLng': pos },
      function( results, status ) {
        console.log(results, status)
        if ( status == google.maps.GeocoderStatus.OK && results[0] ) {
          return results[0].formatted_address;
        }
        else {
          return "N/A";
        }
      }
    );
  }
  save() {
    
    this.loadingIndicator = this.loading.create();
    this.loadingIndicator.present();

    if([this.mapData.longitude, this.mapData.latitude].indexOf(null) > 0) return;

    this.addressProvider.get(this.mapData)
    .then(respose => {
      console.log(respose);

      let time = moment().format();

      let locationData = {
        dogid: this.sharedData.selectedDog.id,
        longitude: this.mapData.longitude,
        latitude: this.mapData.latitude,
        time: time,
        address: respose,
        tracklets: this.dogLocations

      }
      let temperatureData = {
        dogid: this.sharedData.selectedDog.id,
        temperature: this.temperature,
        time: time
      }

      let locationRequest = this.rest.post('location', locationData);
      let temperatureRequest = this.rest.post('temperature', temperatureData);
      console.log("sending")

      Observable.forkJoin([locationRequest, temperatureRequest])
      .subscribe(data => {
        console.log(data)
        this.presentToast("Data successfully saved");
        this.loadingIndicator.dismiss();
      }, error => {
        this.presentToast("Unable to save data");
        this.loadingIndicator.dismiss();
        console.log(error)
      });

    }, error => {
      console.log(error);
    })
  }

  presentToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
