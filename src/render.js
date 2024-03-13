class Vpet {
  constructor() {
    if (Vpet.instance) {
      return Vpet.instance;
    }
    Vpet.instance = this;

    this.init();
  }

  init() {
    this.canvas = document.querySelector("canvas");
    this.VPet = document.querySelector("#VPet");
    this.VPetBody = document.querySelector("#BODY");
    this.VPetHead = document.querySelector("#HEAD");
    this.ctx = this.canvas.getContext("2d");
    this.img = document.createElement("img");
    this.img.width = 1000;
    this.img.height = 1000;

    this.playQueue = [];
    this.intervalId = 0;
    this.repeatCurrentPlay = true;
    this.shutDownCurrentAnimation = false;

    this.dragAble = false;
    this.dragStart = { x: 0, y: 0 };
    this.currentPos = { x: 0, y: 0 };

    this.img.onload = () => {
      if (this.shutDownCurrentAnimation) {
        this.ctx.clearRect(0, 0, 200, 200);
      } else {
        this.ctx.clearRect(0, 0, 200, 200);
        this.ctx.drawImage(this.img, 0, 0, 200, 200);
      }
    };

    this.VPetHead.addEventListener("click", (e) => {
      this.TouchHead();
    });

    this.VPetBody.addEventListener("mousedown", (e) => {
      this.catchBody();
    });
    this.VPetBody.addEventListener("mouseup", (e) => {
      this.releaseBody();
    });

    this.VPet.addEventListener("mousedown", (e) => {
      this.dragAble = true;
      this.dragStart = {
        x: e.screenX,
        y: e.screenY,
      };
    });
    this.VPet.addEventListener("mousemove", (e) => {
      if (!this.dragAble) return;
      const offsetX = e.screenX - this.dragStart.x;
      const offsetY = e.screenY - this.dragStart.y;

      const { x, y } = this.currentPos;

      Object.assign(this.VPet.style, {
        top: `${y + offsetY}px`,
        left: `${x + offsetX}px`,
      });
    });
    this.VPet.addEventListener("mouseup", (e) => {
      this.dragAble = false;
      this.currentPos = {
        x: parseInt(this.VPet.style.left),
        y: parseInt(this.VPet.style.top),
      };
    });
  }

  async getAnimation(type) {
    const animation = await window.ContentAPI.getImgList(type);
    this.playQueue.push({ animation });
  }

  async playAnimation() {
    if (this.playQueue.length === 0) {
      await this.getAnimation("Default-Happy-1");
      this.repeatCurrentPlay = true;
    }
    let i = 0;
    const imgList = this.repeatCurrentPlay
      ? this.playQueue[0].animation
      : this.playQueue.shift().animation;
    this.intervalId = setInterval(() => {
      if (this.shutDownCurrentAnimation) {
        clearInterval(this.intervalId);
        this.playAnimation();
        this.shutDownCurrentAnimation = false;
      } else {
        this.img.src = imgList[i];
        if (i < imgList.length - 1) {
          i++;
        } else {
          clearInterval(this.intervalId);
          this.playAnimation();
        }
      }
    }, 100);
  }

  toggleAnimation() {
    clearInterval(this.intervalId);
    this.shutDownCurrentAnimation = true;
    this.playAnimation();
  }

  TouchHead() {
    this.repeatCurrentPlay = false;
    this.repeatCurrentPlay && this.playQueue.shift();
    this.getAnimation("Touch_Head-Happy-B");
    this.toggleAnimation();
  }

  catchBody() {
    this.repeatCurrentPlay = true;
    this.repeatCurrentPlay && this.playQueue.shift();
    this.getAnimation("Raise-Raised_Dynamic-Happy");
    this.toggleAnimation();
  }
  releaseBody() {
    this.repeatCurrentPlay = false;
    this.toggleAnimation();
  }
}

const myVPet = new Vpet();
myVPet.playAnimation();
