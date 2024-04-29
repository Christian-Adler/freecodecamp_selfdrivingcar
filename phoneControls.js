class PhoneControls {
  constructor(canvas) {
    this.canvas = canvas;
    this.tilt = 0;
    this.forward = true;
    this.reverse = false;
    this.canvasAngle = 0;
    this.#addEventListeners();

  }

  #addEventListeners() {
    // window.addEventListener("deviceorientation", e => {
    //   this.tilt = e.beta * Math.PI / 180;
    //   const canvasAngel = -this.tile;
    //   this.canvas.style.transform = `translate(-50%,-50%) rotate(${canvasAngel}rad)`;
    // });

    window.addEventListener("devicemotion", e => {
      this.tilt = Math.atan2(e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.x);
      const newCanvasAngel = -this.tilt;
      this.canvasAngle = this.canvasAngle * 0.6 + newCanvasAngel * 0.4;
      this.canvas.style.transform = `translate(-50%,-50%) rotate(${this.canvasAngle}rad)`;
    });

    window.addEventListener('touchstart', ev => {
      this.reverse = true;
      this.forward = false;
    });
    window.addEventListener('touchend', ev => {
      this.reverse = false;
      this.forward = true;
    });
  }
}