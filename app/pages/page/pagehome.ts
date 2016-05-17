import {Page, Platform, Loading, NavController, Toast} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Subscription} from 'rxjs/Subscription';
import {MapsService} from '../../services/MapsService';

declare var google;

@Page({
  templateUrl: 'build/pages/page/pagehome.html',
  providers:[MapsService]
})
export class PageHome {

  public map:any;
  public nav:NavController;
  public loading:Loading;
  public isWatching:boolean;
  public subscription:Subscription;
  public mapsService:MapsService;
  public address: string;

  constructor(platform: Platform, nav: NavController, mapsService: MapsService) {

    this.nav = nav;
    this.mapsService = mapsService;
    this.loading = this._createLoading();
    this.isWatching = false;

    platform.ready().then(() => {
      this.map = mapsService.getMap('map');
    });
  }

  /**
  * Geolocate
  */
  public geolocate():void{

      this.nav.present(this.loading);
      setTimeout(()=>this._sleep(), 2000);



  }

  private _sleep(){
    Geolocation.getCurrentPosition({timeout:5000, enableHighAccuracy:true}).then((position) => {

      this.mapsService.moveToPosition(this.map, position.coords.latitude, position.coords.longitude);

      this.mapsService.getAddress(position.coords.latitude, position.coords.longitude).then((data) => {
        this.address = data[0].formatted_address;
      });

      this._dismissLoading();
    }).catch(error=>{
      this._dismissLoading();
    });
  }

  /**
  * Watch the position
  */
  public watchPosition():void{
    this.isWatching = true;
    this.subscription = Geolocation.watchPosition().subscribe((position) => {

      this.mapsService.getAddress(position.coords.latitude, position.coords.longitude).then((data) => {
        this.address = data[0].formatted_address;
      });

      this.mapsService.moveToPosition(this.map, position.coords.latitude, position.coords.longitude);

    });;
  }

  /**
  * stop watching
  */
  public stopWatching():void{
    this.isWatching = false;
    this.subscription.unsubscribe();
  }

  /**
  * Create a loader
  */
  private _createLoading():Loading{
    return Loading.create({
      content : 'Please wait...'
    });
  }

  /**
  * Dismiss the loader
  */
  private _dismissLoading():void{
    this.loading.dismiss();
    this.loading = this._createLoading();
  }

  private _displayToast(msg: any):void{
    this.nav.present(Toast.create({
      message:msg,
      duration:4000
    }));
  }
}
