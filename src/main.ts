import { WebGLRenderer, PerspectiveCamera } from 'three';

import RunningScene from './scenes/RunningScene';
import MainMenuScene from './scenes/MainMenuScene';
import CharacterSelectionScene from './scenes/CharacterSelectionScene';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new WebGLRenderer({
  canvas: document.getElementById('app') as HTMLCanvasElement,
  antialias: true,
  precision: 'mediump',
});

renderer.setSize(width, height);

let currentScene:MainMenuScene | RunningScene | CharacterSelectionScene;

const mainCamera = new PerspectiveCamera(60, width / height, 0.1, 1000);

function onWindowResize() {
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

const runningScene = new RunningScene();
const mainMenuScene = new MainMenuScene();
const characterSelectionScene = new CharacterSelectionScene();

const switchToRunningScene = () => {
  currentScene.hide();
  currentScene = runningScene;
  currentScene.initialize();
};

const switchToMainMenuScene = () => {
  currentScene.hide();
  currentScene = mainMenuScene;
  currentScene.initialize();
};

const switchToCharacterSelectionScene = () => {
  currentScene.hide();
  currentScene = characterSelectionScene;
  currentScene.initialize();
};
(document.getElementById('play-game-button')as HTMLInputElement).onclick = () => {
  switchToRunningScene();
};
(document.querySelector('#quit-button')as HTMLInputElement).onclick = () => {
  (document.getElementById('game-over-modal')as HTMLInputElement).style.display = 'none';
  switchToMainMenuScene();
};

(document.querySelector('#game-over-quit-button')as HTMLInputElement).onclick = () => {
  (document.getElementById('game-over-modal')as HTMLInputElement).style.display = 'none';
  switchToMainMenuScene();
};

currentScene = mainMenuScene;
const render = () => {
  currentScene.update();
  renderer.render(currentScene, mainCamera);
  requestAnimationFrame(render);
};

(document.querySelector('#Characters-selection-button')as HTMLInputElement).onclick = () => {
  switchToCharacterSelectionScene();
};
(document.querySelector('.home-menu')as HTMLInputElement).onclick = () => {
  switchToMainMenuScene();
};

const main = async () => {
  await runningScene.load();
  await mainMenuScene.load();
  await characterSelectionScene.load();
  (document.querySelector('.loading-container') as HTMLInputElement).style.display = 'none';
  currentScene.initialize();
  render();
};

main();
