import { render, RenderPosition } from '../framework/render.js';
import PlanView from '../view/plan-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventView from '../view/no-event-view.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils/event.js';

export default class PlanPresenter {
  #planContainer = null;
  #eventsModel = null;

  #planComponent = new PlanView();
  #eventsListComponent = new EventsListView();
  #sortComponent = null;
  #noEventComponent = new NoEventView();

  #events = [];
  #destinations = [];
  #offers = [];

  #eventPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({ planContainer, eventsModel }) {
    this.#planContainer = planContainer;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#eventsModel.destinations];
    this.#offers = [...this.#eventsModel.offers];

    this.#renderPlan();
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #sortEvents(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#events.sort(sortByDay);
        break;
      case SortType.TIME:
        this.#events.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#events.sort(sortByPrice);
        break;
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortEvents(sortType);
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#planComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEvent({ event, destination, offers }) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange,
      destination, offers,
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEvents() {
    this.#events
      .forEach((event) => this.#renderEvent({
        event,
        destination: this.#destinations.find((dstntn) => dstntn.id === event.destination),
        offers: this.#offers
      }));
  }

  #renderNoEvents() {
    render(this.#noEventComponent, this.#planComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearEventsList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#planComponent.element);
    this.#renderEvents();
  }

  #renderPlan() {
    render(this.#planComponent, this.#planContainer);

    if (!this.#events) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEventsList();
  }
}
