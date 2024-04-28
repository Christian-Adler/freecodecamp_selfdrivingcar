class PhoneControls {
  constructor(props) {
    this.tilt = 0;
    this.#addEventListeners();

  }

  #addEventListeners() {
    window.addEventListener("deviceorientation", e => {
      this.tilt = e.beta * Math.PI / 180;
    });
  }
}