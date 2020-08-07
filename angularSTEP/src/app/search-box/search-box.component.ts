// Copyright 2020 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Component, Inject, forwardRef, Input, Output, EventEmitter, ViewChild, SimpleChanges} from '@angular/core';
import {BaseWidget, NgAisInstantSearch} from 'angular-instantsearch';
import {connectSearchBox} from 'instantsearch.js/es/connectors';
import {MatInputHarness} from '@angular/material/input/testing'

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent extends BaseWidget {

  @ViewChild('input') inputRef: any;

  public state: {
    query: string;
    refine: Function;
    clear: Function;
    isSearchStalled: boolean;
    widgetParams: object;
    searchAsYouType: boolean;
  };

  @Input() searchField: string;
  @Input() contentType;
  @Output() noQuery = new EventEmitter<boolean>();
  refineInit: boolean = false
  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent
  ) {
    super('SearchBox');
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.searchField && this.refineInit){
      this.state.refine(changes.searchField.currentValue);
      this.noQuery.emit(false);
    }
  }
  ngOnInit() {
    this.createWidget(connectSearchBox, {
      searchAsYouType: false
    });
    super.ngOnInit();
    this.refineInit = true;
  }

  onSearchChanged(query: string){
    if(query){
      this.state.refine(query);
      this.noQuery.emit(false);
      this.refineInit = true;
    } else {
      this.noQuery.emit(true);
    }
  }

  clearSearchField() {
    this.searchField = '';
    this.noQuery.emit(true);
  }
}
