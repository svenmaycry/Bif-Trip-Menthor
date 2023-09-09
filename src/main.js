import { HeaderTripPresenter, MainTripPresenter } from './presenter/trip-presenter.js';

const body = document.querySelector('.page-body');
const headerTripInfo = body.querySelector('.trip-main');
const headerTripFilter = body.querySelector('.trip-controls__filters');
const mainContent = body.querySelector('.trip-events');

const headerTripPresenter = new HeaderTripPresenter({ sortContainer: headerTripInfo, headerTripFilter });
const mainTripPresenter = new MainTripPresenter({ sortContainer: mainContent });

headerTripPresenter.init();
mainTripPresenter.init();
