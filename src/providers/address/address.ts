import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AddressProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var google;

@Injectable()
export class AddressProvider {

	public resolve: (value?: any) => void;
	public reject: (reason?: any) => void;

	constructor(
		public http: HttpClient
	) { }

	get(data) {
		return new Promise<any>( (resolve, reject) => {

			let pos = new google.maps.LatLng(data.latitude, data.longitude);;

			var google_maps_geocoder = new google.maps.Geocoder();
			google_maps_geocoder.geocode(
				{ 'latLng': pos },
				function( results, status ) {
					console.log(results, status)
					if ( status == google.maps.GeocoderStatus.OK && results[0] ) {
						resolve(results[0].formatted_address)
					}
					else {
						resolve("(N/A)");
					}
				}
			);
		})
	}

}
