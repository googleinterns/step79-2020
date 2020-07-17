import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Input,
  NgZone
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() addressType!: string;
  @ViewChild('addresstext') addresstext: any;

  mapsForm: FormGroup;
  autocompleteInput!: string;

  @ViewChild('mapElem', {static: true}) mapElem!: ElementRef;
  address = '';
  center: google.maps.LatLngLiteral = {lat: 39.068229, lng: -94.393225};
  zoom = 11;
  options: google.maps.MapOptions = {
    center: this.center,
    zoom: this.zoom,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 3,
  };
  markers: google.maps.Marker[] = new Array();
  infocontent: string = '';
  map!: google.maps.Map;
  service!: google.maps.places.PlacesService;
  infowindow!: google.maps.InfoWindow;
  request!: google.maps.places.PlaceSearchRequest;

  constructor(private fb: FormBuilder, private zone: NgZone) {
    this.mapsForm = this.fb.group({
      location: [''],
    });
  }

  //Sets up the map and sets its center to the middle of the US. If value is entered, changes the zoom and
  //center of map and then retrieves the results
  ngAfterViewInit() {
    this.zone.run(() => {
      this.map = new google.maps.Map(this.mapElem.nativeElement, this.options);
      this.infowindow = new google.maps.InfoWindow();
      this.map.setZoom(3);
    });
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement,
      {
        types: [this.addressType],
      }
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.center = {
        lat: place.geometry?.location.lat() ? place.geometry?.location.lat() : 0,
        lng: place.geometry?.location.lng() ? place.geometry?.location.lng() : 0,
      };
      this.zone.run(() => {
        this.clearMarkers();
        this.zoom = 11;
        this.map.setZoom(this.zoom);
        this.map.setCenter(this.center);
        this.getResults();
      })
    });
  }

  ngOnInit(): void {}

  //retreives the results 10 miles around the given location and sets up listener for infomarker
  getResults() {
    this.request = {
      location: this.center,
      radius: 16093,
      rankBy: google.maps.places.RankBy.PROMINENCE,
      type: 'grocery_or_supermarket',
    };
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.nearbySearch(this.request, (results, status) => this.zone.run(() => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            const marker = new google.maps.Marker({
              map: this.map,
              position: results[i].geometry!.location,
              title: results[i].name
            });

            google.maps.event.addListener(marker, "click", () => {
              const requestInfo: google.maps.places.PlaceDetailsRequest = {
                placeId: results[i].place_id!,
                fields: ['formatted_phone_number', 'vicinity', 'website']
              }
              this.service.getDetails(requestInfo, (res, stat) => this.zone.run(() => {
                if (stat === google.maps.places.PlacesServiceStatus.OK) {
                const infocontent = '<div id="content">' +
                '<div id="siteNotice">' +
                "</div>" +
                '<h1 id="firstHeading" class="firstHeading">'+ results[i].name +'</h1>' +
                '<div id="bodyContent">' +
                "<p>Phone Number: " + res.formatted_phone_number +
                "<br/>Address: " + res.vicinity +
                "<br/>Rating: " + results[i].rating + "/5"+
                "<br><a href=" + res.website+" target='_blank'>Visit Website</a>"+
                "</p>" +
                "</div>" +
                "</div>";
                this.infowindow.setContent(infocontent);
                this.infowindow.open(this.map, marker);
                }
              })) 
            });
            this.markers.push(marker);
          }
        }
    }))
  }

  //clears markers if user changes to different location
  clearMarkers(){
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
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

  
}
