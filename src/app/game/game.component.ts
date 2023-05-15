import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

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

  quotes = [
    {
        text: 'pan tadeusz',
        category: 'Utwór literacji'
    },
    {
        text: 'ogniem i mieczem',
        category: 'utwór literacki'
    },
    {
        text: 'avatar',
        category: 'film'
    },
  ];

  constructor(service: GameService) { }
  
  ngOnInit(): void {
    this.getRandomQuote();
    this.drawLetters();
    this.getQuoteContent();
  }

  getRandomQuote() {
    this.text = this.quotes[Math.floor(Math.random()*this.quotes.length)].text;
    this.category = this.quotes[Math.floor(Math.random()*this.quotes.length)].category;
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
    for(const char of this.text) {
      if(char === ' ' || this.guessedLetters.includes(char)) {
        this.content += char;
      } else {
        this.content += "_";
      }
    }
  }
  
  checkIfTitleContainsLetter(letter: string) {
    if(this.text.includes(letter)) {
      return true;
    }
    return false;
  }

  endGame() {
    this.letters = [];
    this.endView = true;
  }
  
  loosing() {
    this.content = "Przegrałeś, nie odgadłeś hasła: " + this.text;
    this.endGame();
  }
  
  winning() {
    this.content = "Gratulacje, odgadłeś hasło: " + this.text;
    this.endGame();
  }

  reset() {
    this.endView = false;
    this.guessedLetters = [];
    this.currentStep = 0;
    this.getRandomQuote();
    this.drawLetters();
    this.getQuoteContent();
  }

}
