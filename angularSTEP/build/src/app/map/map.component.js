"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let MapComponent = class MapComponent {
    constructor(fb, zone) {
        this.fb = fb;
        this.zone = zone;
        this.address = '';
        this.center = { lat: 39.068229, lng: -94.393225 };
        this.zoom = 11;
        this.options = {
            center: this.center,
            zoom: this.zoom,
            zoomControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true,
            maxZoom: 15,
            minZoom: 3,
        };
        this.markers = [];
        this.infocontent = '';
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
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.clearMarkers();
                    this.zoom = 11;
                    this.map.setZoom(this.zoom);
                    this.map.setCenter(this.center);
                    this.getResults();
                });
            }
        });
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {
            types: [this.addressType],
        });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            var _a, _b, _c, _d;
            const place = autocomplete.getPlace();
            this.center = {
                lat: ((_a = place.geometry) === null || _a === void 0 ? void 0 : _a.location.lat()) ? (_b = place.geometry) === null || _b === void 0 ? void 0 : _b.location.lat() : 0,
                lng: ((_c = place.geometry) === null || _c === void 0 ? void 0 : _c.location.lng()) ? (_d = place.geometry) === null || _d === void 0 ? void 0 : _d.location.lng() : 0,
            };
            this.zone.run(() => {
                this.clearMarkers();
                this.zoom = 11;
                this.map.setZoom(this.zoom);
                this.map.setCenter(this.center);
                this.getResults();
            });
        });
    }
    ngOnInit() { }
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
                        position: results[i].geometry.location,
                        title: results[i].name,
                    });
                    google.maps.event.addListener(marker, 'click', () => {
                        const requestInfo = {
                            placeId: results[i].place_id,
                            fields: ['formatted_phone_number', 'vicinity', 'website'],
                        };
                        this.service.getDetails(requestInfo, (res, stat) => this.zone.run(() => {
                            if (stat === google.maps.places.PlacesServiceStatus.OK) {
                                const infocontent = '<div id="content">' +
                                    '<div id="siteNotice">' +
                                    '</div>' +
                                    '<h1 id="firstHeading" class="firstHeading">' +
                                    results[i].name +
                                    '</h1>' +
                                    '<div id="bodyContent">' +
                                    '<p>Phone Number: ' +
                                    res.formatted_phone_number +
                                    '<br/>Address: ' +
                                    res.vicinity +
                                    '<br/>Rating: ' +
                                    results[i].rating +
                                    '/5' +
                                    '<br><a href=' +
                                    res.website +
                                    " target='_blank'>Visit Website</a>" +
                                    '</p>' +
                                    '</div>' +
                                    '</div>';
                                this.infowindow.setContent(infocontent);
                                this.infowindow.open(this.map, marker);
                            }
                        }));
                    });
                    this.markers.push(marker);
                }
            }
        }));
    }
    //clears markers if user changes to different location
    clearMarkers() {
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];
    }
    zoomIn() {
        if (this.zoom < this.options.maxZoom) {
            this.zoom++;
        }
        this.map.setZoom(this.zoom);
    }
    zoomOut() {
        if (this.zoom > this.options.minZoom) {
            this.zoom--;
        }
        this.map.setZoom(this.zoom);
    }
};
__decorate([
    core_1.Input()
], MapComponent.prototype, "addressType", void 0);
__decorate([
    core_1.ViewChild('addresstext')
], MapComponent.prototype, "addresstext", void 0);
__decorate([
    core_1.ViewChild('mapElem', { static: true })
], MapComponent.prototype, "mapElem", void 0);
MapComponent = __decorate([
    core_1.Component({
        selector: 'app-map',
        templateUrl: './map.component.html',
        styleUrls: ['./map.component.scss'],
    })
], MapComponent);
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map