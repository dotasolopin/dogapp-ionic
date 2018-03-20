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
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { RestProvider } from '../providers/rest/rest';
@NgModule({
  declarations: [
    MyApp,
    DogLocationPage,
    DogTemperaturePage,
    OptionsPage,
    TabsControllerPage,
    LoginPage,
    SignupPage,
    AboutPage
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
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    HttpClientModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider
  ]
})
export class AppModule {}