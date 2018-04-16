import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { StorageProvider } from '../storage/storage';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  apiUrl = 'https://doggieapp2.herokuapp.com/';
  backendUrl: string = 'http://localhost/dogapp-server/api/';

  constructor(
    public http: Http,
    private storage: StorageProvider
    ) {
    console.log('Hello RestProvider Provider');
  }


  public passData(method, data) {
    /* Passes data to server*/
    let opt: RequestOptions; //call requestoption class to enable headers
    let myHeaders: Headers = new Headers(); // calls headers calss
    let headers = new Headers({ 
      //api key for security
      // 'key':'4d80e4e0-ddf8-457c-b2dd-b102d9444444',
      'Content-Type':'application/json'
    });
    let options = new RequestOptions({ headers: headers });


    return Observable.create(observer => {
      let urlTemp = this.apiUrl+method;//links data together
      this.http.get(urlTemp,options)
      .subscribe( (msg)=> {
        /*If observers has no error */
        observer.next(msg.json());
        observer.complete();
      }, (msg)=> {
        /*If observers has error */
        observer.next(msg.json());
        // this.alert = true;
      }, ()=> { 
        observer.complete(); //If observers completes transactions
      });
    });

  }

  public get(endpoint, id:string = '', params = {}) {
    let url = this.getBackendUrl();
    return this.http.get(url + endpoint + id, this.createRequestHeaders(params))
    .map((response: Response) => { return response.json(); });
  }

  public post(endpoint, data) {
    let url = this.getBackendUrl();
    return this.http.post(url + endpoint, data)
    .map((response: Response) => { return response.json(); })
  }

  public put(endpoint, data) {
    let url = this.getBackendUrl();
    return this.http.put(url + endpoint, data)
    .map((response: Response) => { return response.json(); });
  }

  public delete(endpoint, id) {
    let url = this.getBackendUrl();
    return this.http.delete(url + endpoint + id)
    .map((response: Response) => { return response.json(); });
  }

  private createRequestHeaders(params) {
    let headers = new Headers({ 'Content-Type': 'application/json', "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE"});
    return new RequestOptions({ headers: headers, params: params });
  }

  private getBackendUrl() {
    // return "http://localhost/dogapp-server/api/";
    return "https://stark-refuge-28510.herokuapp.com/index.php/api/";
    // return this.storage.get('dogappbackendurl') || '';
  }


}
