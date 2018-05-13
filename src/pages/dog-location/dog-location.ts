import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { LocalNotifications } from '@ionic-native/local-notifications';

import 'rxjs/add/operator/filter';

import { RestProvider } from '../../providers/rest/rest';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';

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

  userPosition:any;

  // ref https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates-shows-wrong?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
  earthRadius:number = 6371; // Radius of the earth in km
  dogDistance:any = 0;

  // ref https://stackoverflow.com/questions/28928906/google-maps-api-drawing-routes-from-an-array-of-points
  dogLocations:any = [];

  // testData:any = {
  //   longitude: 124.65499,
  //   latitude: 8.484772399999999
  // }  


  constructor(
    private rest:RestProvider,
    public navCtrl: NavController,
    private loading: LoadingController,
    private toast: ToastController,
    public geolocation: Geolocation,
    private sharedData: SharedDataProvider,
    private localNotifications: LocalNotifications
    ) { }

  ionViewDidLoad(){
    this.getPosition();
    this.loadMap();
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
 
    // this.geolocation.getCurrentPosition().then((position) => {
 
      
      this.rest.passData("devices/3","").subscribe(data=>{
        let latLng = new google.maps.LatLng(data.latitude, data.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        
        this.mapData = data;
        console.log(data);
      
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        //add marker
        this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.map.getCenter()
        });
        let dogName = (this.sharedData.selectedDog) ? this.sharedData.selectedDog.name : 'Your dog';
        let content = `<p>${dogName} is here</p>`;
        // this.addInfoWindow(marker, content);
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });
      
        // google.maps.event.addListener(marker, 'idle', () => {
          infoWindow.open(this.map, this.marker);
        // });
        //add marker
        setTimeout(() => {
          self.updateMap();
        }, 5000)
      });
    // }, (err) => {
    //   console.log(err);
    // });
    // (success) => {
    //   console.log(success);
    // }
  }

  degreesToRadius(deg) {
    return deg * (Math.PI/180)
  }


  updateMap() {
    let self = this;
    this.rest.passData("devices/3","")
    .filter((d) =>  d !== undefined )
    .subscribe(data=>{
      console.log(data)

        // test only
        // data.longitude = 124.65499;
        // data.latitude = 8.484772399999999;

        // data = this.testData;

        let latLng = new google.maps.LatLng(data.latitude, data.longitude);
        this.marker.setPosition(latLng);

        this.dogLocations.push(latLng);

        // let rLat = Math.random() * 0.00001;
        // let rLong = Math.random() * 0.00001;

        // this.testData.latitude += rLat;
        // this.testData.longitude += rLong;

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

          if( (!m  && d != this.dogDistance) || (d > 5 && d != this.dogDistance)) {
            this.dogDistance = d;
            let dogName = (self.sharedData.selectedDog) ? self.sharedData.selectedDog.name : 'Your dog';
            self.localNotifications.schedule({
              id: new Date().getTime(),
              text: `${dogName} is ${d} ${m ? 'meters':'kilometers'} away from you`
            });
            console.log("must notify")
          }

          console.log(d);

        }

        var flightPath = new google.maps.Polyline({
            map: this.map,
            path: this.dogLocations,
            strokeColor: "#FF0000",
            strokeOpacity: .7,
            strokeWeight: 1
        });


        setTimeout(() => {
          self.updateMap();
        }, 10000)
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
  saveLocation() {
    this.loadingIndicator = this.loading.create();
    this.loadingIndicator.present();

    if([this.mapData.longitude, this.mapData.latitude].indexOf(null) > 0) return;

    let data = {
      dogid: this.sharedData.selectedDog.id,
      longitude: this.mapData.longitude,
      latitude: this.mapData.latitude
    }

    this.rest.post('location', data)
    .subscribe((response) => {
      this.presentToast("Location successfully saved");
      this.loadingIndicator.dismiss();
      console.log(response);
    }, (error) => {
      this.loadingIndicator.dismiss();
      this.presentToast("Unable to save location");
      console.log("Unable to save location", error)
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
