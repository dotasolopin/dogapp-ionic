import { Headers, RequestOptions,Http } from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// import { HttpClient } from '@angular/common/http';
/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  apiUrl = 'https://doggieapp2.herokuapp.com/';
  constructor(public http: Http) {
    console.log('Hello RestProvider Provider');
  }
  public passData(method, data) {
    /* Passes data to server*/
    let opt: RequestOptions; //call requestoption class to enable headers
    let myHeaders: Headers = new Headers(); // calls headers calss
    let headers = new Headers({ //api key for security
      // 'key':'4d80e4e0-ddf8-457c-b2dd-b102d9444444',
      'Content-Type':'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    return Observable.create(observer => {
      let urlTemp = this.apiUrl+method;//links data together
      this.http.get(urlTemp,options)
      .subscribe(
        (msg)=> {
          /*If observers has no error */
          observer.next(msg.json());
          observer.complete();
        },
        (msg)=> {
          /*If observers has error */
          observer.next(msg.json());
            // this.alert = true;
        },
        ()=> {
          /*If observers completes transactions */
            observer.complete();
        }
      );
    });
  }
}
