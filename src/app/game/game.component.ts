import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Character } from 'app/character';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  
  letters: string[] = [];
  guessedLetters: string[] = [];
  content: string = '';
  currentStep: number = 0;
  lastStep: number = 7;
  imageCounters: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  text: string = '';
  category: string = '';
  endView: boolean = false;
  hintCounter: number = 0;
  maxHint: number = 4;

  character:Character = {
    name: '',
    species: '',
    episodesNum: 0,
    gender: '',
    image: '',
  };

  constructor(private service: GameService) { }
  
  ngOnInit(): void {
    this.getRandomCharacter();
    this.drawLetters();
  }

  getRandomCharacter() {
    this.service.getGameData().subscribe({
      next: value => {
        const data: any = value;
        
        const randomElement = data.results[Math.floor(Math.random()*data.results.length)];

        this.character.name = randomElement.name.toLowerCase();
        this.character.species = randomElement.species;
        this.character.episodesNum = randomElement.episode.length;
        this.character.gender = randomElement.gender
        this.character.image = randomElement.image;
                
      },
      complete: () => this.getQuoteContent()
    })
  }

  
  drawLetters() {
    for (let i=0; i<26; i++) {
      const letter = (i+10).toString(36);
      this.letters.push(letter);
    }
  }
  
  guess(letter: string, event: MouseEvent) {
    const element = event.target as HTMLButtonElement;
    element.disabled = true;
    this.guessedLetters.push(letter);
    if(this.checkIfTitleContainsLetter(letter)) {
      this.getQuoteContent();
      if(!this.content.includes("_")) {
        this.winning();
      }
    } else {
      this.currentStep++;
      if(this.currentStep === this.lastStep) {
        this.loosing();
      }
    }
  }

  
  getQuoteContent() {
    this.content = '';
    for(const char of this.character.name) {
      if(char === ' ' || this.guessedLetters.includes(char)) {
        this.content += char;
      } else {
        this.content += "_";
      }
    }
  }
  
  checkIfTitleContainsLetter(letter: string) {
    if(this.character.name.includes(letter)) {
      return true;
    }
    return false;
  }

  showhint() {
    if(this.hintCounter <= this.maxHint) {
      this.hintCounter++;
    }
  }

  resetHints() {
    this.hintCounter = 0;
  }

  endGame() {
    this.letters = [];
    this.endView = true;
  }
  
  loosing() {
    this.content = "You lost, the character name was: " + this.character.name;
    this.endGame();
  }
  
  winning() {
    this.content = "You win using " + this.hintCounter + " hints. The character name was: " + this.character.name;
    this.endGame();
  }

  reset() {
    this.endView = false;
    this.guessedLetters = [];
    this.currentStep = 0;
    this.getRandomCharacter();
    this.drawLetters();
    this.resetHints();
  }

}
