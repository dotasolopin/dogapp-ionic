import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { DogLocationPage } from '../pages/dog-location/dog-location';
import { DogTemperaturePage } from '../pages/dog-temperature/dog-temperature';
import { OptionsPage } from '../pages/options/options';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { AddDogPage } from '../pages/add-dog/add-dog';
import { SavedFilesPage } from '../pages/saved-files/saved-files';
import { UpdateProfilePage } from '../pages/update-profile/update-profile';
import { UpdateDogPage } from '../pages/update-dog/update-dog';
import { ViewLocationPage } from '../pages/view-location/view-location';

import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { RestProvider } from '../providers/rest/rest';
import { StorageProvider } from '../providers/storage/storage';
import { SharedDataProvider } from '../providers/shared-data/shared-data';

import { DatePicker } from '@ionic-native/date-picker';
import { Camera } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';


@NgModule({
  declarations: [
    MyApp,
    DogLocationPage,
    DogTemperaturePage,
    OptionsPage,
    TabsControllerPage,
    LoginPage,
    SignupPage,
    AboutPage,
    HomePage,
    AddDogPage,
    SavedFilesPage,
    UpdateProfilePage,
    UpdateDogPage,
    ViewLocationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DogLocationPage,
    DogTemperaturePage,
    OptionsPage,
    TabsControllerPage,
    LoginPage,
    SignupPage,
    AboutPage,
    HomePage,
    AddDogPage,
    SavedFilesPage,
    UpdateProfilePage,
    UpdateDogPage,
    ViewLocationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    HttpClientModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    StorageProvider,
    DatePicker,
    Camera,
    LocalNotifications,
    SharedDataProvider
  ]
})
export class AppModule {}