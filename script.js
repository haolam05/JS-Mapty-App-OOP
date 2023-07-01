'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;

  constructor() {
    this.#getPosition();
    form.addEventListener('submit', this.#newWorkout.bind(this));
    inputType.addEventListener('change', this.#toggleElevationField);
  }

  #getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this),
        this.#alertError
      );
    }
  }

  #loadMap(position) {
    const { latitude, longitude } = position.coords;
    this.#setMapview([latitude, longitude]);
    this.#addTileLayerToMap();
    this.#registerEventToDisplayForm();
  }

  #showForm(e) {
    form.classList.remove('hidden');
    this.#mapEvent = e;
    inputDistance.focus();
  }

  #toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  #newWorkout(e) {
    this.#displayPopup(e);
  }

  #displayPopup(e) {
    e.preventDefault();
    this.#resetAllFormInputs();
    const { lat: latitude, lng: longitude } = this.#mapEvent.latlng;
    L.marker([latitude, longitude])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('🏃‍♀️🏃‍♂️🏃‍♀️💨')
      .openPopup();
  }

  #alertError() {
    alert('Could not find your position!');
  }

  #setMapview(coords) {
    this.#map = L.map('map').setView(coords, 13);
  }

  #addTileLayerToMap() {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
  }

  #registerEventToDisplayForm() {
    this.#map.on('click', this.#showForm.bind(this));
  }

  #resetAllFormInputs() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }
}
const app = new App();
