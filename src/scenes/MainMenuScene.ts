/* eslint-disable linebreak-style */
import {
  Scene, Object3D, AmbientLight, DirectionalLight, Clock, AnimationMixer, AnimationAction,
} from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import allCharacters from '../allCharacters';

interface IallGameCharacters {
    name: string
    model: string
    isActive: boolean
    price: number
    isLocked: boolean
    danceAnimation: string
    runAnimation: string
    slideAnimation: string
    stumbleAnimation: string
    jumpAnimation: string
}

export default class MainMenuScene extends Scene {
  private fbxLoader = new FBXLoader();

  private woodenCave = new Object3D();

  private delta = 0;

  private clock = new Clock();

  private animationMixer!: AnimationMixer;

  private dancingAnimation!: AnimationAction;

  private xbot = new Object3D();

  private jolleen = new Object3D();

  private peasantGirl = new Object3D();

  private xbotAnimation!: Object3D;

  private jolleenAnimation!: Object3D;

  private peasantGirlAnimation!: Object3D;

  private charactersContainer: Object3D[] = [];

  private animationsContainer: Object3D[] = [];

  private allGameCharacters: IallGameCharacters[] = [];

  private activeCharacter = new Object3D();

  private activeCharacterAnimation!: Object3D;

  private activeIndexNumber = 0;

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

    if (!JSON.parse(localStorage.getItem('allGameCharacters')!)) {
      localStorage.setItem('allGameCharacters', JSON.stringify(allCharacters));
    }

    this.allGameCharacters = (JSON.parse(localStorage.getItem('allGameCharacters')!));

    this.xbot = await this.fbxLoader.loadAsync(this.allGameCharacters[0].model);
    this.jolleen = await this.fbxLoader.loadAsync(this.allGameCharacters[1].model);
    this.peasantGirl = await this.fbxLoader.loadAsync(this.allGameCharacters[2].model);

    this.xbotAnimation = await this.fbxLoader
      .loadAsync(this.allGameCharacters[0].danceAnimation);
    this.jolleenAnimation = await this.fbxLoader
      .loadAsync(this.allGameCharacters[1].danceAnimation);
    this.peasantGirlAnimation = await this.fbxLoader
      .loadAsync(this.allGameCharacters[2].danceAnimation);

    this.xbot.visible = false;
    this.jolleen.visible = false;
    this.peasantGirl.visible = false;

    this.charactersContainer.push(
      this.xbot,
      this.jolleen,
      this.peasantGirl,
    );
    this.animationsContainer.push(
      this.xbotAnimation,
      this.jolleenAnimation,
      this.peasantGirlAnimation,
    );

    this.add(this.xbot);
    this.add(this.jolleen);
    this.add(this.peasantGirl);

    this.hide();
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

    this.allGameCharacters = (JSON.parse(localStorage.getItem('allGameCharacters')!));
    this.activeIndexNumber = this.allGameCharacters
      .findIndex((character) => character.isActive === true);

    this.activeCharacter = this.charactersContainer[this.activeIndexNumber];
    this.activeCharacterAnimation = this.animationsContainer[this.activeIndexNumber];
    this.activeCharacter.scale.set(0.1, 0.1, 0.1);
    this.activeCharacter.position.set(0, -35, -110);
    this.activeCharacter.visible = true;
    this.animationMixer = new AnimationMixer(this.activeCharacter);
    this.dancingAnimation = this.animationMixer
      .clipAction(this.activeCharacterAnimation.animations[0]);
    this.dancingAnimation.play();
  }

  update() {
    if (this.animationMixer) {
      this.delta = this.clock.getDelta();
      this.animationMixer.update(this.delta);
    }
  }

  hide() {
    this.visible = false;
    this.clock.stop();
    (document.querySelector('#main-menu-buttons') as HTMLInputElement).style.display = 'none';
    (document.querySelector('.high-score-container') as HTMLInputElement).style.display = 'none';
    (document.querySelector('.total-coins-container') as HTMLInputElement).style.display = 'none';
    this.activeCharacter.visible = false;
  }
}
