import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { RestProvider } from '../../providers/rest/rest';
declare var google;

@Component({
  selector: 'page-dog-location',
  templateUrl: 'dog-location.html'
})
export class DogLocationPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(private rest:RestProvider,public navCtrl: NavController,public geolocation: Geolocation) {
  }
  ionViewDidLoad(){
    this.loadMap();
    // 
  }
 
  loadMap(){
 
    // this.geolocation.getCurrentPosition().then((position) => {
 
      
      this.rest.passData("devices/3","").subscribe(data=>{
        let latLng = new google.maps.LatLng(data.latitude, data.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
      
        console.log(data);
      
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        //add marker
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.map.getCenter()
        });
        let content = "<p>Your dog is here!</p>"+"<p>Latitude: "+data.latitude+"</p><p>Latitude:"+data.longitude+"</p>";         
        // this.addInfoWindow(marker, content);
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });
      
        // google.maps.event.addListener(marker, 'idle', () => {
          infoWindow.open(this.map, marker);
        // });
        //add marker
      });
    // }, (err) => {
    //   console.log(err);
    // });
    // (success) => {
    //   console.log(success);
    // }
    
  }
  addMarker(){
 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
   
    let content = "<h4>Your dog is here!</h4>";         
   
    this.addInfoWindow(marker, content);
   
  }
  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'idle', () => {
      infoWindow.open(this.map, marker);
    });
   
  }
}
