import { Injectable } from '@angular/core';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  constructor() { }

  get(storage) {
  	return localStorage.getItem(storage) || false;
  }

  set(storage, data) {
  	return localStorage.setItem(storage, data);
  }

  remove(storage) {
    localStorage.removeItem(storage);
  }

}
