import { Component, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('hangman');

  // letters that have been guessed
  guesses!: string[];
  // how many incorrect guesses there have been 
  wrongGuessCount!: WritableSignal<number>;
  // if the game has been won or not
  gameWon!: WritableSignal<boolean>;
  // the solution phrase
  answer!: string;
  // the current known phrase, with '_' in place of unknowns
  blank!: string;

  constructor() {}

  // start new game on app opening
  ngOnInit() {
    this.newGame();
  }

  // initialize values on new game started
  newGame() {
    this.guesses = [];
    this.wrongGuessCount = signal<number>(0);
    this.gameWon = signal<boolean>(false);
    this.answer = 'should change later'; // TODO change to random in list
    this.blank = '';
    for (let i = 0; i < this.answer.length; i++) {
      if (this.answer.charAt(i) != ' ')
        this.blank += '_';
      else 
        this.blank += ' ';
    }
  }

  // handles button press of submitting a full phrase guess
  submitFullGuess() {
    const guess = (document.getElementById('full-guess-input') as HTMLInputElement).value.toLowerCase();
    if (guess === this.answer) {
      this.blank = this.answer;
      this.gameWon.set(true);
    } else {
      this.wrongGuessCount.update((curr: number) => ++curr);
    }
  }

  // handles button press of submitting a guess
  submitGuess() {
    const guess = (document.getElementById('guess-input') as HTMLInputElement).value.toLowerCase();
    if (guess.length > 0 && // invalid guesses ignored
      guess.length <= 1 && 
      !this.guesses.includes(guess) && 
      ![...this.blank].includes(guess) &&
      guess != ' '
    ) {
      const ogBlank = this.blank; // JS strings are primatives :)
      this.checkGuess(guess);
      if (this.blank == ogBlank) {
        this.wrongGuessCount.update((curr: number) => ++curr); // no blanks revealed
        this.guesses.push(guess);
      }
      if (this.blank == this.answer) { // all blanks revealed
        this.gameWon.set(true);
      }
    }
  }

  // returns str with the char at index replaced with the given char
  replaceCharAt(str: string, char: string, index: number): string {
    if (index >= str.length) return str;
    else return str.substring(0, index) + char + str.substring(index + 1, str.length);
  }

  // fills in blanks in this.blank
  checkGuess(guess: string) {
    for (let i = 0; i < this.answer.length; i++) {
      if (this.answer.charAt(i) == guess) {
        this.blank = this.replaceCharAt(this.blank, guess, i);
      }
    }
  }
}