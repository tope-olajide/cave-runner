/* eslint-disable linebreak-style */
import {
  Scene, Object3D, AmbientLight, DirectionalLight, Clock, AnimationMixer, AnimationAction,
} from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export default class MainMenuScene extends Scene {
  private fbxLoader = new FBXLoader();

  private woodenCave = new Object3D();

  private player = new Object3D();

  private delta = 0;

  private clock = new Clock();

  private AnimationMixer!: AnimationMixer;

  private dancingAnimation!: AnimationAction;

  async load() {
    this.woodenCave = await this.fbxLoader.loadAsync('./assets/models/wooden-cave.fbx');
    this.woodenCave.position.set(0, 0, -500);
    this.woodenCave.scale.set(0.055, 0.055, 0.055);
    this.add(this.woodenCave);

    const ambient = new AmbientLight(0xFFFFFF, 2.5);
    this.add(ambient);

    const light = new DirectionalLight(0xFFFFFF, 2.5);

    light.position.set(0, 40, -10);
    this.add(light);

    this.player = await this.fbxLoader.loadAsync('../../assets/characters/xbot.fbx');
    this.player.position.z = -110;
    this.player.position.y = -35;
    this.player.scale.set(0.1, 0.1, 0.1);
    this.player.rotation.y = 180 * (Math.PI / 180);
    this.add(this.player);

    const dancingAnimationObject = await this.fbxLoader.loadAsync('../../assets/animations/xbot@dancing.fbx');
    this.AnimationMixer = new AnimationMixer(this.player);
    this.dancingAnimation = this.AnimationMixer.clipAction(dancingAnimationObject.animations[0]);
    this.dancingAnimation.play();
  }

  initialize() {
    (document.querySelector('#main-menu-buttons') as HTMLInputElement).style.display = 'block';
    (document.querySelector('.high-score-container') as HTMLInputElement).style.display = 'block';
    (document.querySelector('.total-coins-container') as HTMLInputElement).style.display = 'block';

    (document.querySelector('.high-score') as HTMLInputElement).innerHTML = JSON.parse(localStorage.getItem('highScore')!) || 0;
    (document.querySelector('.total-coins') as HTMLInputElement).innerHTML = JSON.parse(localStorage.getItem('totalCoins')!) || 0;

    if (!this.visible) {
      this.visible = true;
    }
    if (!this.clock.running) {
      this.clock.start();
    }
  }

  update() {
    if (this.AnimationMixer) {
      this.delta = this.clock.getDelta();
      this.AnimationMixer.update(this.delta);
    }
  }

  hide() {}
}
