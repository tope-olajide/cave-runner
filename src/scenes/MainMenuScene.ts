/* eslint-disable class-methods-use-this */
import {
  Scene, Object3D, AmbientLight, DirectionalLight, Clock, AnimationMixer, AnimationAction,
} from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import Toastify from 'toastify-js';

import allCharacters from '../allCharacters';

import 'flag-icons';

import { IallGameCharacters } from '../types';

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

    (document.querySelector('.loading-percentage') as HTMLInputElement).innerHTML = '27%';
    (document.querySelector('#loading-bar') as HTMLProgressElement).value = 27;

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

    (document.querySelector('.loading-percentage') as HTMLInputElement).innerHTML = '32%';
    (document.querySelector('#loading-bar') as HTMLProgressElement).value = 32;

    this.xbotAnimation = await this.fbxLoader
      .loadAsync(this.allGameCharacters[0].danceAnimation);

    (document.querySelector('.loading-percentage') as HTMLInputElement).innerHTML = '34%';
    (document.querySelector('#loading-bar') as HTMLProgressElement).value = 34;

    this.jolleenAnimation = await this.fbxLoader
      .loadAsync(this.allGameCharacters[1].danceAnimation);

    (document.querySelector('.loading-percentage') as HTMLInputElement).innerHTML = '39%';
    (document.querySelector('#loading-bar') as HTMLProgressElement).value = 39;
    this.peasantGirlAnimation = await this.fbxLoader
      .loadAsync(this.allGameCharacters[2].danceAnimation);

    (document.querySelector('.loading-percentage') as HTMLInputElement).innerHTML = '42%';
    (document.querySelector('#loading-bar') as HTMLProgressElement).value = 42;

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

  private restoreOnlineBackup(scores:number, coins:number, characters:string) {
    localStorage.setItem('high-score', String(scores));
    localStorage.setItem('total-coins', String(coins));
    localStorage.setItem('allGameCharacters', characters);
    this.allGameCharacters = (JSON.parse(localStorage.getItem('allGameCharacters')!));
    (document.querySelector('#backup-modal') as HTMLInputElement).style.display = 'none';
    (document.querySelector('.high-score') as HTMLInputElement).innerHTML = JSON.parse(localStorage.getItem('high-score')!);
    (document.querySelector('.total-coins') as HTMLInputElement).innerHTML = JSON.parse(localStorage.getItem('total-coins')!);
  }

  private async overwriteOnlineBackup() {
    const scores = (JSON.parse(localStorage.getItem('high-score')!));
    const coins = (JSON.parse(localStorage.getItem('total-coins')!));
    const characters = JSON.stringify(this.allGameCharacters);
    const token = localStorage.getItem('token');

    if (token) {
      try {
        (document.querySelector('#overwrite-online-backup-btn') as HTMLInputElement).disabled = true;
        (document.querySelector('#restore-online-backup-btn') as HTMLInputElement).disabled = true;
        (document.querySelector('.auto-save-loader') as HTMLInputElement).style.display = 'block';
        const response = await fetch('/.netlify/functions/overwrite-game-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
          body: JSON.stringify({ scores, coins, characters }),
        });
        (document.querySelector('.auto-save-loader') as HTMLInputElement).style.display = 'none';
        (document.querySelector('#backup-modal') as HTMLInputElement).style.display = 'none';
        (document.querySelector('.high-score') as HTMLInputElement).innerHTML = JSON.parse(localStorage.getItem('high-score')!);
        (document.querySelector('.total-coins') as HTMLInputElement).innerHTML = JSON.parse(localStorage.getItem('total-coins')!);
        (document.querySelector('#overwrite-online-backup-btn') as HTMLInputElement).disabled = false;
        (document.querySelector('#restore-online-backup-btn') as HTMLInputElement).disabled = false;
        if (response.status === 401) {
          localStorage.removeItem('token');
          if (response.status === 401) {
            Toastify({
              text: 'Your session has expired. Please relogin',
              duration: 5000,
              close: true,
              gravity: 'bottom',
              position: 'center',
              stopOnFocus: true,
            }).showToast();
            (document.querySelector('#overwrite-online-backup-btn') as HTMLInputElement).disabled = false;
            (document.querySelector('#restore-online-backup-btn') as HTMLInputElement).disabled = false;
          }
        }
      } catch (error) {
        (document.querySelector('.auto-save-loader') as HTMLInputElement).style.display = 'none';
        (document.querySelector('#backup-modal') as HTMLInputElement).style.display = 'none';
        (document.querySelector('#overwrite-online-backup-btn') as HTMLInputElement).disabled = false;
        (document.querySelector('#restore-online-backup-btn') as HTMLInputElement).disabled = false;
      }
    }
  }

  private async signInUser() {
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

      const {
        token, message, scores, coins, characters,
      } = await response.json();
      (document.querySelector('#login-button') as HTMLInputElement).innerHTML = 'Login';
      (document.querySelector('#login-button') as HTMLInputElement).disabled = false;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        this.closeSignInForm();
        this.loadLoginScreen();
        Toastify({
          text: `Welcome Back, ${username}`,
          duration: 4000,
          close: true,
          gravity: 'bottom',
          position: 'center',
          stopOnFocus: true,
        }).showToast();
        if (scores !== Number(JSON.parse(localStorage.getItem('high-score')!))
        || coins !== Number(JSON.parse(localStorage.getItem('total-coins')!))
           || characters !== JSON.stringify(this.allGameCharacters)) {
          (document.querySelector('#backup-modal') as HTMLInputElement).style.display = 'block';
        }
        (document.querySelector('#restore-online-backup-btn') as HTMLInputElement).onclick = () => {
          this.restoreOnlineBackup(scores, coins, characters);
        };
      } else {
        Toastify({
          text: `${message}`,
          duration: 4000,
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
        text: '❎❎❎ Unable to login, please try again',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
    }
  }

  async signUpUser() {
    const username = (document.getElementById('signup-username-text') as HTMLInputElement).value;
    const password = (document.getElementById('signup-password-text') as HTMLInputElement).value;
    const repeatPassword = (document.getElementById('signup-repeat-password-text') as HTMLInputElement).value;
    const country = (document.getElementById('country') as HTMLInputElement).value;
    const characters = JSON.stringify(this.allGameCharacters);
    const signUpData = {
      username, password, country, characters,
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
    } else if (password.length < 5) {
      Toastify({
        text: '❎ Password is too short!',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
    } else if (password !== repeatPassword) {
      Toastify({
        text: '❎ Password does not match!',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
    } else {
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
          localStorage.setItem('username', username);
          this.closeSignUpForm();
          this.loadLoginScreen();
          Toastify({
            text: 'Registration Successful!',
            duration: 4000,
            close: true,
            gravity: 'bottom',
            position: 'center',
            stopOnFocus: true,
          }).showToast();
        } else {
          Toastify({
            text: `${message}`,
            duration: 4000,
            close: true,
            gravity: 'bottom',
            position: 'center',
            stopOnFocus: true,
          }).showToast();
        }
      } catch (error) {
        Toastify({
          text: '❎❎❎Unable to sign you up, please try again.',
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
  }

  private closeSignUpForm() {
    (document.querySelector('#sign-up-modal') as HTMLInputElement).style.display = 'none';
  }

  private closeSignInForm = () => {
    (document.querySelector('#sign-in-modal') as HTMLInputElement).style.display = 'none';
  };

  private loadLoginScreen() {
    (document.querySelector('#sign-out-button') as HTMLInputElement).style.display = 'block';
    (document.querySelector('#greetings') as HTMLInputElement).style.display = 'block';
    (document.querySelector('.auth-button') as HTMLInputElement).style.display = 'none';
    (document.querySelector('#username') as HTMLInputElement).innerHTML = localStorage.getItem('username')!;
  }

  private loadLogoutScreen() {
    (document.querySelector('#sign-out-button') as HTMLInputElement).style.display = 'none';
    (document.querySelector('#greetings') as HTMLInputElement).style.display = 'none';
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
          <td><span class='fi fi-${player.country.toLowerCase()}'></span></td>        
      </tr>`;
    });
    (document.getElementById('rank-table') as HTMLInputElement).innerHTML = tableHead;
  }

  private closeHighScoreModal() {
    (document.querySelector('#high-scores-modal') as HTMLInputElement).style.display = 'none';
  }

  private logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    this.loadLogoutScreen();
  }

  initialize() {
    (document.querySelector('.auth-button') as HTMLInputElement).style.display = 'block';

    (document.querySelector('#overwrite-online-backup-btn') as HTMLInputElement).onclick = () => {
      this.overwriteOnlineBackup();
    };

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
      this.signUpUser();
    };
    (document.querySelector('#login-button') as HTMLInputElement).onclick = () => {
      this.signInUser();
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
    (document.querySelector('#greetings') as HTMLInputElement).style.display = 'none';
  }
}
