/* eslint-disable linebreak-style */
import {
  Scene, DirectionalLight, AmbientLight, Object3D, AnimationMixer, AnimationAction, Clock, Box3, LoopOnce,
} from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import TWEEN, { Tween } from '@tweenjs/tween.js';

export default class RunningScene extends Scene {
  private fbxLoader = new FBXLoader();

  private woodenCave = new Object3D();

  private player = new Object3D();

  private animationMixer!: AnimationMixer;

  private runningAnimation!: AnimationAction;

  private clock = new Clock();

  private delta = 0;

  private woodenCaveClone = new Object3D();

  private caveSize = 0;

  private speed = 220;

  private currentAnimation!: AnimationAction;

  private jumpingAnimation!: AnimationAction;

  private isJumping = false;

  private jumpingUp!: Tween<any>;

  private jumpingDown!: Tween<any>;

  private isSliding = false;

  private slidingAnimation !: AnimationAction;

  private sliderTimeout!: ReturnType<typeof setTimeout>;

  async load() {
    const ambient = new AmbientLight(0xFFFFFF, 2.5);
    this.add(ambient);

    const light = new DirectionalLight(0xFFFFFF, 2.5);

    light.position.set(0, 40, -10);
    this.add(light);

    this.woodenCave = await this.fbxLoader.loadAsync('./assets/models/wooden-cave.fbx');
    this.woodenCave.position.set(0, 0, -500);
    this.woodenCave.scale.set(0.055, 0.055, 0.055);
    this.add(this.woodenCave);

    this.player = await this.fbxLoader.loadAsync('../../assets/characters/xbot.fbx');
    this.player.position.z = -110;
    this.player.position.y = -35;
    this.player.scale.set(0.1, 0.1, 0.1);
    this.player.rotation.y = 180 * (Math.PI / 180);
    this.add(this.player);

    const runningAnimationObject = await this.fbxLoader.loadAsync('./assets/animations/xbot@running.fbx');

    this.animationMixer = new AnimationMixer(this.player);
    this.runningAnimation = this.animationMixer.clipAction(runningAnimationObject.animations[0]);
    this.runningAnimation.play();

    this.woodenCaveClone = this.woodenCave.clone();
    const caveBox = new Box3().setFromObject(this.woodenCave);
    this.caveSize = caveBox.max.z - caveBox.min.z - 1;
    this.woodenCaveClone.position.z = this.woodenCave.position.z + this.caveSize;
    this.add(this.woodenCaveClone);

    this.currentAnimation = this.runningAnimation;

    const jumpingAnimationObject = await this.fbxLoader.loadAsync('./assets/animations/xbot@jumping.fbx');

    this.jumpingAnimation = this.animationMixer.clipAction(jumpingAnimationObject.animations[0]);

    const slidingAnimationObject = await this.fbxLoader.loadAsync('./assets/animations/xbot@sliding.fbx');
    // remove the animation track that makes the player move forward when sliding
    slidingAnimationObject.animations[0].tracks.shift();
    this.slidingAnimation = this.animationMixer.clipAction(slidingAnimationObject.animations[0]);
  }

  initialize() {
    document.onkeydown = (e) => {
      if (e.key === 'ArrowLeft') {
        this.moveLeft();
      } if (e.key === 'ArrowRight') {
        this.moveRight();
      }
      if (e.key === 'ArrowUp') {
        this.jump();
      }
      if (e.key === 'ArrowDown') {
        this.slide();
      }
    };
  }

  update() {
    if (this.animationMixer) {
      this.delta = this.clock.getDelta();
      this.animationMixer.update(this.delta);
    }
    this.woodenCave.position.z += this.speed * this.delta;
    this.woodenCaveClone.position.z += this.speed * this.delta;

    if (this.woodenCave.position.z > 600) {
      this.woodenCave.position.z = this.woodenCaveClone.position.z - this.caveSize;
    }

    if (this.woodenCaveClone.position.z > 600) {
      this.woodenCaveClone.position.z = this.woodenCave.position.z - this.caveSize;
    }
    TWEEN.update();
  }

  hide() {

  }

  private moveLeft() {
    if (this.player.position.x !== -18) {
      const tweenLeft = new TWEEN.Tween(this.player.position)
        .to({ x: this.player.position.x - 18 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.player.rotation.y = -140 * (Math.PI / 180);
          if (this.player.position.x <= -18) {
            this.player.position.x = -18;
          }
        })
        .onComplete(() => {
          this.player.rotation.y = 180 * (Math.PI / 180);
        });
      tweenLeft.start();
    }
  }

  private moveRight() {
    if (this.player.position.x !== 18) {
      this.player.rotation.y = 140 * (Math.PI / 180);
      const tweenRight = new Tween(this.player.position)
        .to({ x: this.player.position.x + 18 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          if (this.player.position.x >= 18) {
            this.player.position.x = 18;
          }
        })
        .onComplete(() => {
          this.player.rotation.y = 180 * (Math.PI / 180);
        });
      tweenRight.start();
    }
  }

  private jump() {
    if (!this.isJumping) {
      if (this.isSliding) {
        clearTimeout(this.sliderTimeout);
        this.player.position.y = -35;
        this.isSliding = false;
      }
      this.isJumping = true;
      this.currentAnimation.stop();

      this.currentAnimation = this.jumpingAnimation;
      this.currentAnimation.reset();
      this.currentAnimation.setLoop(1, 1);
      this.currentAnimation.clampWhenFinished = true;
      this.currentAnimation.play();
      this.animationMixer.addEventListener('finished', () => {
        this.currentAnimation.crossFadeTo(this.runningAnimation, 0.1, false).play();
        this.currentAnimation = this.runningAnimation;
      });

      this.jumpingUp = new Tween(this.player.position).to({ y: this.player.position.y += 20 }, 400);
      this.jumpingDown = new Tween(this.player.position)
        .to({ y: this.player.position.y -= 20 }, 500);
      this.jumpingUp.chain(this.jumpingDown);
      this.jumpingUp.start();
      this.jumpingDown.onComplete(() => {
        this.isJumping = false;
        this.player.position.y = -35;
      });
    }
  }

  private slide() {
    if (!this.isSliding) {
      if (this.isJumping) {
        this.jumpingUp.stop();
        this.jumpingDown.stop();
        this.player.position.y = -35;
        this.isJumping = false;
      }
      this.isSliding = true;
      this.player.position.y -= 5;
      this.currentAnimation.stop();
      this.slidingAnimation.reset();
      this.currentAnimation = this.slidingAnimation;
      this.slidingAnimation.clampWhenFinished = true;
      this.slidingAnimation.play();
      this.slidingAnimation.crossFadeTo(this.runningAnimation, 1.9, false).play();
      this.currentAnimation = this.runningAnimation;
      this.sliderTimeout = setTimeout(() => {
        this.player.position.y = -35;
        this.isSliding = false;
      }, 800);
    }
  }
}
