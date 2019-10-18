import * as React from 'react';

// TO DO: Consider better locations for these interfaces.
export interface IVocabEntry {
    [propName: string]: any;
}

export interface IFlashcardState  {
    answerWord: string;
    questionWord: string;
    questionLanguage: string;
    answerLanguage: string;
    hintCount: number;
    vocabDB: IVocabEntry[];
}

// TO DO: interface this component once public contracts needed.
export default class Flashcard extends React.Component {
    public state: IFlashcardState = {
        answerWord: "",
        questionWord: "",
        questionLanguage: "english",
        answerLanguage: "korean",
        hintCount: 0,
        vocabDB: []
    };

    public componentWillMount = (): void => {
        this.getVocab();
    };

    // TO DO: Extract this out into Database Abstraction
    private getVocab = async (): Promise<void> => {
      const response = await fetch('https://gimbapp-api.herokuapp.com/vocab', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      this.state.vocabDB = await response.json();

      this.newQuestion();
    };

    private getRandomInt = (max: number): number => {
        return Math.floor(Math.random() * Math.floor(max));
    };

    private newQuestion = (): void => {
        if (this.state.vocabDB) {
            const index: number = this.getRandomInt(this.state.vocabDB.length);

            this.setState(Object.assign({}, {
                "questionWord": this.state.vocabDB[index][this.state.questionLanguage],
                "answerWord": this.state.vocabDB[index][this.state.answerLanguage],
                "hintCount": 0
            }));
        }

    };

    private showHintOrAnswer = (): string => {
        if (this.state.hintCount >= this.state.answerWord.length) {
            return this.showAnswer();
        }

        if (this.state.hintCount > 0) {
            let hintedAnswer = this.state.answerWord.slice(0, this.state.hintCount);

            return `Here is a hint: "${hintedAnswer}"`
        }

        return "";
    };

    private showAnswer = (): string => {
        return `The answer is: "${this.state.answerWord}"`
    };

    private giveHint = (): void => {
        if (this.state.hintCount >= this.state.answerWord.length) return;

        this.setState({"hintCount": this.state.hintCount + 1});
    };

    private revealAnswer = (): void => {
        this.setState({"hintCount": this.state.answerWord.length});
    };

    render() {

        return this.state.vocabDB.length > 0 && (
            <div>
                <p>{`What is the Korean translation for "${this.state.questionWord}"?`}</p>
                <button onClick={this.newQuestion}>
                    New Question
                </button>
                <button onClick={this.giveHint}>
                    Show me a letter!
                </button>
                <button onClick={this.revealAnswer}>
                    Reveal All!
                </button>
                <p>{this.showHintOrAnswer()}</p>
            </div>
        );

    };
}