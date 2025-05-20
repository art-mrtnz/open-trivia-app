# Open Trivia Database Quiz App

A modern React quiz application that fetches trivia questions from the [Open Trivia Database](https://opentdb.com/). Users can select their name, category, difficulty, and number of questions, then answer randomized multiple-choice questions and review their results.

## Features

- Fetches trivia questions from the Open Trivia Database API
- User can select category, difficulty, and number of questions (minimum 10)
- Randomized answer order for each question
- Progress bar and navigation between questions
- Final results with score, percentage, and answer review
- Confetti celebration for high scores
- Responsive and clean UI
- Personalized greeting using the user's name
- Option to restart the quiz at any time
- Error handling for failed API requests
- Ensures no repeated questions in a session
- Supports multiple quiz sessions with unique tokens
- Visual feedback for correct and incorrect answers
- Clean separation of components for maintainability
- Added conditional coloring for the score in the results section:
  - If the user's score is 70% or above, the score text is green.
  - If below 70%, the score text is red.