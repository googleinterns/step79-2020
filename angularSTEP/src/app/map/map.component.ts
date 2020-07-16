import {
  Component,
  ViewChild,
  EventEmitter,
  Output,
  OnInit,
  Input,
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() addressType!: string;
  @Output() setAddress: EventEmitter<
    google.maps.places.PlaceResult
  > = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  mapsForm: FormGroup;
  autocompleteInput!: string;

  constructor(private fb: FormBuilder) {
    this.mapsForm = this.fb.group({
      location: [''],
    });
  }

  ngOnInit(): void {}

  //gives input the Google autocomplete. If value is entered, emits that value up to home
  ngAfterViewInit() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement,
      {
        types: [this.addressType],
      }
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.setAddress.emit(place);
    });
  }
}
