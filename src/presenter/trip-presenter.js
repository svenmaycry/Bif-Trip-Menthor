
import FilterView from '../view/filter-view.js';
import FormNewPointView from '../view/form-new-point-view.js';
import SortView from '../view/sort-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripPointView from '../view/trip-point-view.js';
import ListView from '../view/list-view';
import { TRIP_COUNT } from '../const.js';
import { render } from '../render.js';

export class HeaderTripPresenter {
  filterComponent = new FilterView();
  infoComponent = new TripInfoView();

  constructor({ sortContainer }) {
    this.sortContainer = sortContainer;
  }

  init() {
    render(this.infoComponent, this.sortContainer, 'afterbegin');
    render(this.filterComponent, this.sortContainer);
  }
}


export class MainTripPresenter {
  sortComponent = new SortView();
  listComponent = new ListView();

  constructor({ sortContainer }) {
    this.sortContainer = sortContainer;
  }

  init() {
    render(this.sortComponent, this.sortContainer);
    render(this.listComponent, this.sortContainer);
    render(new FormNewPointView(), this.listComponent.getElement());
    for (let i = 0; i < TRIP_COUNT; i++) {
      render(new TripPointView(), this.listComponent.getElement());
    }
  }
}
