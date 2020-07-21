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
    if(!value){
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
  }
}
