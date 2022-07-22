import {
  Scene, DirectionalLight, AmbientLight, Object3D, AnimationMixer, AnimationAction, Clock,
} from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export default class RunningScene extends Scene {
  private fbxLoader = new FBXLoader();

  private woodenCave = new Object3D();

  private player = new Object3D();

  private animationMixer!: AnimationMixer;

  private runningAnimation!: AnimationAction;

  private clock = new Clock();

  private delta = 0;

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
  }

  initialize() {

  }

  update() {
    if (this.animationMixer) {
      this.delta = this.clock.getDelta();
      this.animationMixer.update(this.delta);
    }
  }

  hide() {

  }
}
