import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('mapElem', {static: true}) mapElem!: ElementRef;
  address = '';
  center: google.maps.LatLngLiteral = {lat: 40.157318, lng: -76.3069};
  zoom = 13;
  options: google.maps.MapOptions = {
    center: this.center,
    zoom: this.zoom,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };
  markers = [];
  infoContent = '';

  map!: google.maps.Map;
  service!: google.maps.places.PlacesService;
  infowindow!: google.maps.InfoWindow;
  request!: google.maps.places.PlaceSearchRequest;
  constructor(private zone: NgZone) {}

  //sets the map
  ngAfterViewInit() {
    this.zone.run(() => {
      this.map = new google.maps.Map(this.mapElem.nativeElement, this.options);
      this.getResults();
    });
  }

  getResults() {
    this.request = {
      location: this.center,
      radius: 16093,
      rankBy: google.maps.places.RankBy.PROMINENCE,
      type: 'supermarket',
    };
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.nearbySearch(this.request, this.callback);
  }

  callback(
    results: google.maps.places.PlaceResult[],
    status: google.maps.places.PlacesServiceStatus
  ) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        console.log(results[i]);
      }
    }
  }

  getNewCenter(place: google.maps.places.PlaceResult) {
    this.center = {
      lat: place.geometry?.location.lat() ? place.geometry?.location.lat() : 0,
      lng: place.geometry?.location.lng() ? place.geometry?.location.lng() : 0,
    };
    this.map.setCenter(this.center);
    this.getResults();
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom!) {
      this.zoom++;
    }
    this.map.setZoom(this.zoom);
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom!) {
      this.zoom--;
    }
    this.map.setZoom(this.zoom);
  }

  ngOnInit() {}
}
