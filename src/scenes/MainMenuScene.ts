/* eslint-disable class-methods-use-this */
import {
  Scene, Object3D, AmbientLight, DirectionalLight, Clock, AnimationMixer, AnimationAction,
} from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import Toastify from 'toastify-js';

import allCharacters from '../allCharacters';

import 'flag-icons';

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

  private displayAboutModal() {
    (document.querySelector('#about-modal') as HTMLInputElement).style.display = 'block';
  }

  private hideAboutModal() {
    (document.querySelector('#about-modal') as HTMLInputElement).style.display = 'none';
  }

  private displaySignUpForm() {
    (document.querySelector('#sign-in-modal') as HTMLInputElement).style.display = 'none';
    (document.querySelector('#sign-up-modal') as HTMLInputElement).style.display = 'block';
  }

  private displaySignInForm() {
    (document.querySelector('#sign-up-modal') as HTMLInputElement).style.display = 'none';
    (document.querySelector('#sign-in-modal') as HTMLInputElement).style.display = 'block';
  }

  private async SignInUser() {
    const username = (document.getElementById('signin-username-text') as HTMLInputElement).value;
    const password = (document.getElementById('signin-password-text') as HTMLInputElement).value;
    const loginData = { username, password };

    try {
      (document.querySelector('#login-button') as HTMLInputElement).innerHTML = 'Logging you in...';
      (document.querySelector('#login-button') as HTMLInputElement).disabled = true;
      const response = await fetch('/.netlify/functions/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const { token, message } = await response.json();
      (document.querySelector('#login-button') as HTMLInputElement).innerHTML = 'Login';
      (document.querySelector('#login-button') as HTMLInputElement).disabled = false;
      if (token) {
        localStorage.setItem('token', token);
        this.closeSignInForm();
        this.loadLoginScreen();
        Toastify({
          text: `Welcome Back, ${username}`,
          duration: 7000,
          close: true,
          gravity: 'bottom',
          position: 'center',
          stopOnFocus: true,
        }).showToast();
      } else {
        Toastify({
          text: `${message}`,
          duration: 7000,
          close: true,
          gravity: 'bottom',
          position: 'center',
          stopOnFocus: true,
        }).showToast();
      }
    } catch (error) {
      (document.querySelector('#login-button') as HTMLInputElement).innerHTML = 'Login';
      (document.querySelector('#login-button') as HTMLInputElement).disabled = false;

      Toastify({
        text: `❎❎❎ ${error}`,
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
    }
  }

  async SignUpUser() {
    const username = (document.getElementById('signup-username-text') as HTMLInputElement).value;
    const password = (document.getElementById('signup-password-text') as HTMLInputElement).value;
    const repeatPassword = (document.getElementById('signup-repeat-password-text') as HTMLInputElement).value;
    const country = (document.getElementById('country') as HTMLInputElement).value;
    const signUpData = {
      username, password, country,
    };
    if (username.length < 4) {
      Toastify({
        text: '❎ Username is too short!',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
    }
    if (password.length < 5) {
      Toastify({
        text: '❎ Password is too short!',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
    }
    if (password !== repeatPassword) {
      Toastify({
        text: '❎ Password does not match!',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
    }
    try {
      (document.querySelector('#register-button') as HTMLInputElement).innerHTML = 'Signing you up...';
      (document.querySelector('#register-button') as HTMLInputElement).disabled = true;
      const response = await fetch('/.netlify/functions/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });
      const { token, message } = await response.json();
      (document.querySelector('#register-button') as HTMLInputElement).innerHTML = 'Register';
      (document.querySelector('#register-button') as HTMLInputElement).disabled = false;

      if (token) {
        localStorage.setItem('token', token);
        this.closeSignUpForm();
        this.loadLoginScreen();
        Toastify({
          text: 'Registration Successful!',
          duration: 7000,
          close: true,
          gravity: 'bottom',
          position: 'center',
          stopOnFocus: true,
        }).showToast();
      } else {
        Toastify({
          text: `${message}`,
          duration: 7000,
          close: true,
          gravity: 'bottom',
          position: 'center',
          stopOnFocus: true,
        }).showToast();
      }
    } catch (error) {
      Toastify({
        text: `❎❎❎ ${error}`,
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
      (document.querySelector('#register-button') as HTMLInputElement).innerHTML = 'Signing you up...';
      (document.querySelector('#register-button') as HTMLInputElement).disabled = false;
    }
  }

  private closeSignUpForm() {
    (document.querySelector('#sign-up-modal') as HTMLInputElement).style.display = 'none';
  }

  private closeSignInForm = () => {
    (document.querySelector('#sign-in-modal') as HTMLInputElement).style.display = 'none';
  };

  private loadLoginScreen() {
    (document.querySelector('#sign-out-button') as HTMLInputElement).style.display = 'block';
    (document.querySelector('.auth-button') as HTMLInputElement).style.display = 'none';
  }

  private loadLogoutScreen() {
    (document.querySelector('#sign-out-button') as HTMLInputElement).style.display = 'none';
    (document.querySelector('.auth-button') as HTMLInputElement).style.display = 'block';
  }

  private async fetchHighScores() {
    (document.querySelector('#high-scores-modal') as HTMLInputElement).style.display = 'block';
    const response = await fetch('/.netlify/functions/highscores');
    const { highscores } = await response.json();
    let tableHead = '<tr><th>Rank</th><th>Username</th><th>Scores</th><th>Country</th></tr>';
    highscores.forEach((player: {
      username: string; scores: string; country: string;
    }, index: number) => {
      tableHead += `<tr>
          <td>${index + 1} </td>
          <td>${player.username}</td>        
          <td>${player.scores}</td>        
          <td><span class='fi fi-${player.country}'></span></td>        
      </tr>`;
    });
    (document.getElementById('rank-table') as HTMLInputElement).innerHTML = tableHead;
  }

  private closeHighScoreModal() {
    (document.querySelector('#high-scores-modal') as HTMLInputElement).style.display = 'none';
  }

  async logoutUser() {
    localStorage.removeItem('token');
    this.loadLogoutScreen();
  }

  initialize() {
    (document.querySelector('.auth-button') as HTMLInputElement).style.display = 'block';
    const token = localStorage.getItem('token');
    if (token) {
      this.loadLoginScreen();
      (document.querySelector('#score-board-button') as HTMLInputElement).style.display = 'none';
    }

    (document.querySelector('#main-menu-buttons') as HTMLInputElement).style.display = 'block';
    (document.querySelector('.high-score-container') as HTMLInputElement).style.display = 'block';
    (document.querySelector('.total-coins-container') as HTMLInputElement).style.display = 'block';

    (document.querySelector('.high-score') as HTMLInputElement).innerHTML = JSON.parse(localStorage.getItem('high-score')!) || 0;
    (document.querySelector('.total-coins') as HTMLInputElement).innerHTML = JSON.parse(localStorage.getItem('total-coins')!) || 0;

    (document.querySelector('.auth-button') as HTMLInputElement).onclick = () => {
      this.displaySignUpForm();
    };
    (document.querySelector('#about-button') as HTMLInputElement).onclick = () => {
      this.displayAboutModal();
    };

    (document.querySelector('#close-about-btn') as HTMLInputElement).onclick = () => {
      this.hideAboutModal();
    };

    if (!this.visible) {
      this.visible = true;
    }
    if (!this.clock.running) {
      this.clock.start();
    }
    (document.querySelector('#score-board-button') as HTMLInputElement).style.display = 'block';
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



    (document.querySelector('#close-signup-form') as HTMLInputElement).onclick = () => {
      this.closeSignUpForm();
    };
    (document.querySelector('#close-signin-form') as HTMLInputElement).onclick = () => {
      this.closeSignInForm();
    };
    (document.querySelector('#sign-out-button') as HTMLInputElement).onclick = () => {
      this.logoutUser();
    };

    (document.querySelector('#sign-in-button') as HTMLInputElement).onclick = () => {
      this.displaySignInForm();
    };
    (document.querySelector('#sign-up-button') as HTMLInputElement).onclick = () => {
      this.displaySignUpForm();
    };
    (document.querySelector('#score-board-button') as HTMLInputElement).onclick = () => {
      this.fetchHighScores();
    };
    (document.querySelector('#close-highscores-modal') as HTMLInputElement).onclick = () => {
      this.closeHighScoreModal();
    };
    (document.querySelector('#register-button') as HTMLInputElement).onclick = () => {
      this.SignUpUser();
    };
    (document.querySelector('#login-button') as HTMLInputElement).onclick = () => {
      this.SignInUser();
    };
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
    (document.querySelector('.auth-button') as HTMLInputElement).style.display = 'none';
    (document.querySelector('#score-board-button') as HTMLInputElement).style.display = 'none';
    (document.querySelector('#sign-out-button') as HTMLInputElement).style.display = 'none';
  }
}
