import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Observable';

declare var google:any;

@Injectable()
export class MapsService {

  /**
  * Create a map
  * @elementId
  */
  public getMap(elementId: string):any{
    return new google.maps.Map(document.getElementById(elementId), {
        zoom:12,
        center: this._getLatLng(44.8462488, -0.5765077),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }

  /**
  * Move to position
  */
  public moveToPosition(map:any, latitude: number, longitude: number):void{
    let center = this._getLatLng(latitude, longitude);
    map.setCenter(center);
    this._addMarker(center, map);
  }

  /**
  * Get address from position
  */
  public getAddress(latitude: number, longitude: number):Promise<any>{
    let center = this._getLatLng(latitude, longitude);
    return new Promise(function(resolve, reject){
      new google.maps.Geocoder().geocode({'location':center}, function(results, status){
        if(status === google.maps.GeocoderStatus.OK){
          resolve(results);
        }else{
          reject(status);
        }
      });
    });
  }

  /**
  * Add a marker on map
  */
  private _addMarker(position:any, map:any):void{
    let marker = new google.maps.Marker({
        position:position,
        title:'Location',
        animation: google.maps.Animation.DROP,
        dragable:true
    });

    marker.setMap(map)
  }

  /**
  * Generate LatLng
  */
  private _getLatLng(latitude:number, longitude:number):any{
    return new google.maps.LatLng(latitude, longitude);
  }
}
