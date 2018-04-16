import { Injectable } from '@angular/core';

/*
  Generated class for the SharedDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SharedDataProvider {

	selectedDog:any;

	constructor() {
		console.log('Hello SharedDataProvider Provider');
	}


}
