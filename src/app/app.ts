import { Component, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
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
  // all possible solution phrases that could be selected
  possibleAnswers!: string[];
  // the solution phrase
  answer!: string;
  // the current known phrase, with '_' in place of unknowns
  blank!: string;
  // the current letter guess in the input field
  guess!: string;
  // the current full phrase guess in the input field
  fullGuess!: string;

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
    this.possibleAnswers = [
      'that old feeling',
      'but not for me',
      'time after time',
      'i get along without you very well',
      'there will never be another you',
      'i fall in love too easily',
      'my funny valentine',
      'everything happens to me',
      'it never entered my mind',
      'these foolish things remind me of you',
    ];
    const rand = Math.floor(Math.random() * this.possibleAnswers.length)
    this.answer = this.possibleAnswers[rand]
    this.blank = '';
    for (let i = 0; i < this.answer.length; i++) {
      if (this.answer.charAt(i) != ' ')
        this.blank += '_';
      else 
        this.blank += ' ';
    }
    this.guess = '';
    this.fullGuess = '';
  }

  // handles button press of submitting a full phrase guess
  submitFullGuess() {
    this.fullGuess = this.fullGuess.toLowerCase();
    if (this.fullGuess === this.answer) {
      this.blank = this.answer;
      this.gameWon.set(true);
    } else {
      this.wrongGuessCount.update((curr: number) => ++curr);
    }
    this.fullGuess = '';
  }

  // handles button press of submitting a guess
  submitGuess() {
    this.guess = this.guess.toLowerCase();
    if (this.guess.length > 0 && // invalid guesses ignored
      this.guess.length <= 1 && 
      !this.guesses.includes(this.guess) && 
      ![...this.blank].includes(this.guess) &&
      this.guess != ' '
    ) {
      const ogBlank = this.blank; // JS strings are primatives :)
      this.checkGuess(this.guess);
      if (this.blank == ogBlank) {
        this.wrongGuessCount.update((curr: number) => ++curr); // no blanks revealed
        this.guesses.push(this.guess);
      }
      if (this.blank == this.answer) { // all blanks revealed
        this.gameWon.set(true);
      }
      this.guess = '';
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