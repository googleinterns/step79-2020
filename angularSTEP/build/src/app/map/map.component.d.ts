/// <reference types="googlemaps" />
import { ElementRef, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
export declare class MapComponent implements OnInit {
    private fb;
    private zone;
    addressType: string;
    addresstext: any;
    mapsForm: FormGroup;
    autocompleteInput: string;
    mapElem: ElementRef;
    address: string;
    center: google.maps.LatLngLiteral;
    zoom: number;
    options: google.maps.MapOptions;
    markers: google.maps.Marker[];
    infocontent: string;
    map: google.maps.Map;
    service: google.maps.places.PlacesService;
    infowindow: google.maps.InfoWindow;
    request: google.maps.places.PlaceSearchRequest;
    constructor(fb: FormBuilder, zone: NgZone);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    getResults(): void;
    clearMarkers(): void;
    zoomIn(): void;
    zoomOut(): void;
}
