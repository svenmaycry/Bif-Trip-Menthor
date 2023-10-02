import TripPlanView from '../view/trip-plan-view.js';
import SortView from '../view/sort-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import { render } from '../render.js';

export default class TripPlanPresenter {
  tripPlanComponent = new TripPlanView();
  tripEventsListComponent = new TripEventsListView();

  constructor({ tripPlanContainer, tripEventsModel }) {
    this.tripPlanContainer = tripPlanContainer;
    this.tripEventsModel = tripEventsModel;
  }

  init() {
    this.tripEvents = [...this.tripEventsModel.getTripEvents()];
    this.tripDestinations = [...this.tripEventsModel.getTripDestinations()];
    this.tripOffers = [...this.tripEventsModel.getTripOffers()];


    render(this.tripPlanComponent, this.tripPlanContainer);
    render(new SortView(), this.tripPlanComponent.getElement());
    render(this.tripEventsListComponent, this.tripPlanComponent.getElement());

    // логика отрсиовки редактора
    const redactingEvent = this.tripEvents[0];
    const destination = this.tripDestinations.find((dstntn) => dstntn.id === redactingEvent.destination);
    // const offers = this.tripEventsModel.getTripConcreteOffers(redactingEvent.type);
    render(new TripEventEditView({ tripEvent: redactingEvent, destination: destination, offers: this.tripOffers }), this.tripEventsListComponent.getElement());

    // логика отрисовки карточек ивентов
    for (let i = 1; i < this.tripEvents.length; i++) {
      const event = this.tripEvents[i];
      const eventDestination = this.tripDestinations.find((dstntn) => dstntn.id === event.destination);
      const eventOffers = this.tripEventsModel.mapIdToOffers(event.offers, event.type);

      render(new TripEventView({ tripEvent: event, destination: eventDestination, offers: eventOffers }), this.tripEventsListComponent.getElement());
    }

  }
}
