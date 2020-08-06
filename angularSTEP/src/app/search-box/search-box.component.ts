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

import {Component, Inject, forwardRef, Input, Output, EventEmitter} from '@angular/core';
import {BaseWidget, NgAisInstantSearch} from 'angular-instantsearch';
import {connectSearchBox} from 'instantsearch.js/es/connectors';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent extends BaseWidget {
  private timerId = null;
  searchField = '';
  public state: {
    query: string;
    refine: Function;
    clear: Function;
    isSearchStalled: boolean;
    widgetParams: object;
    searchAsYouType: boolean;
  };
  loading = false;

  @Input() contentType;
  @Input() delay = 0;
  @Output() noQuery = new EventEmitter<boolean>();

  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent
  ) {
    super('SearchBox');
  }

  ngOnInit() {
    this.createWidget(connectSearchBox, {
      searchAsYouType: false,
    });
    super.ngOnInit();
  }

  public onChangeDebounced(value) {
    if (!value) {
      this.noQuery.emit(true);
    } else {
      if (this.timerId) clearTimeout(this.timerId);
      this.loading = true;
      this.timerId = setTimeout(() => {
        this.loading = false;
        this.state.refine(value);
      }, this.delay);
      this.noQuery.emit(false);
    }
  
  }

  clearSearchField() {
    this.searchField = '';
    this.noQuery.emit(true);
  }
}
