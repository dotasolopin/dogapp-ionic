import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


declare var google;

@Component({
  selector: 'page-view-location',
  templateUrl: 'view-location.html',
})
export class ViewLocationPage {
	@ViewChild('viewmap') mapElement: ElementRef;

	viewmap: any;
	location:any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams
	) {
		this.location = this.navParams.get('location');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ViewLocationPage');
		this.loadMap();
	}

	loadMap() {
    console.log(this.location)

    let latLng = new google.maps.LatLng(this.location.latitude, this.location.longitude);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
    this.viewmap = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //add marker
    let marker = new google.maps.Marker({
      map: this.viewmap,
      animation: google.maps.Animation.DROP,
      position: this.viewmap.getCenter()
    });
    let content = "<p>Your dog is here!</p>"+"<p>Latitude: "+this.location.latitude+"</p><p>Longitude:"+this.location.longitude+"</p>";         
    // this.addInfoWindow(marker, content);
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
  
    // google.maps.event.addListener(marker, 'idle', () => {
      infoWindow.open(this.viewmap, marker);
	}

}
