import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SharedDataProvider } from '../../providers/shared-data/shared-data';

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
    private sharedData: SharedDataProvider,
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
    let dogName = (this.sharedData.selectedDog) ? this.sharedData.selectedDog.name : 'Your dog';
    let content = `<p><b>${dogName}</b> is here</p><p style="width:100px;">${this.location.address}</p>`      
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
  
    infoWindow.open(this.viewmap, marker);

    var flightPath = new google.maps.Polyline({
          map: this.viewmap,
          path: this.location.tracklets,
          strokeColor: "#FF0000",
          strokeOpacity: 1,
          strokeWeight: 1
      });


	}

}
