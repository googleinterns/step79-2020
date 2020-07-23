import { Component, Inject, forwardRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectAutocomplete } from 'instantsearch.js/es/connectors';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent extends BaseWidget {

  state: {
    query: string;
    refine: Function;
    indices: object[];
  };

  @Output() onQuerySuggestionClick = new EventEmitter<{ query: string }>();

  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent
  ) {
    super('AutocompleteComponent');
  }

  public handleChange($event: KeyboardEvent) {
    this.state.refine(($event.target as HTMLInputElement).value);
    if($event.key === 'Enter'){
      this.onQuerySuggestionClick.emit({ query: ($event.target as HTMLInputElement).value})
    }
  }

  public ngOnInit() {
    this.createWidget(connectAutocomplete, {});
    super.ngOnInit();
  }
}
