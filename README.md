# Bingo: For Real

Bingo: For Real is an interactive bingo game developed with React and TypeScript. The goal of the game is to mark all the numbers on your bingo card before your opponents.

## How to Play

1. **Start the game**: Click the "Start" button to begin the game. A number will be announced every 5 seconds.
2. **Mark numbers**: Click on the numbers on your bingo card to mark them if they match the announced number.
3. **Pause and resume**: You can pause the game at any time by clicking the "Pause" button and resume it with the "Resume" button.
4. **Restart the game**: If you want to restart the game, click the "Restart" button.
5. **Win the game**: When you have marked all the numbers on your bingo card, click the "BINGO!" button to win the game. If all the numbers are correctly marked, you win; otherwise, you lose.

## Installation and Execution

1. Clone this repository.
2. Install the dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Open your browser and navigate to the specified `localhost` to play.

## Play Online

You can also play the game online using GitHub Pages. Simply visit the following URL:

[https://plustra03.github.io/BingoFR](https://plustra03.github.io/BingoFR)

## Project Structure

- `public/`: Contains public files like the favicon and site manifest.
- `src/`: Contains the project's source code.
    - `components/`: React components used in the game.
    - `hooks/`: Custom React hooks.
    - `icons/`: Icons used in the game.
    - `sounds/`: Sounds used in the game.
    - `styles/`: CSS style files.
    - `utils/`: Utility functions used in the game.
    - `Game.tsx`: Main game component.
    - `main.tsx`: Application entry point.

## Dependencies

- React
- TypeScript
- TailwindCSS
- CLSX
- Vite

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
