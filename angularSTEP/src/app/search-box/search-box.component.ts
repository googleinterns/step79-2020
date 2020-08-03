import {Component, Inject, forwardRef, Input} from '@angular/core';
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

  @Input() delay = 0;

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
    if (this.timerId) clearTimeout(this.timerId);
    this.loading = true;
    this.timerId = setTimeout(() => {
      this.loading = false;
      this.state.refine(value);
    }, this.delay);
  }

  clearSearchField() {
    this.searchField = '';
  }
}
