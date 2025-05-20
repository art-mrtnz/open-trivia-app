import React, { useState, useEffect } from 'react';

const QuestionForm = ({
  question,
  answers,
  onSubmit,
  onPrevious,
  error,
  questionNumber,
  totalQuestions,
  currentAnswer
}) => {
  const [selected, setSelected] = useState(currentAnswer);

  useEffect(() => {
    setSelected(currentAnswer);
  }, [currentAnswer, questionNumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selected) {
      onSubmit(selected);
      // Do NOT reset selected here, so it persists when going back
    }
  };

  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        Question {questionNumber} of {totalQuestions}
      </h2>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{
            width: `${(questionNumber / totalQuestions) * 100}%`
          }}
        />
      </div>
      <div className="quiz-question-text" dangerouslySetInnerHTML={{ __html: question }} />
      {answers.map((ans, idx) => (
        <div key={idx} className="quiz-answer-option">
          <label>
            <input
              type="radio"
              name="answer"
              value={ans}
              checked={selected === ans}
              onChange={() => setSelected(ans)}
              required
            />
            <span dangerouslySetInnerHTML={{ __html: ans }} />
          </label>
        </div>
      ))}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="button-row">
        {onPrevious && (
          <button type="button" onClick={onPrevious}>
            Previous
          </button>
        )}
        <button type="submit" disabled={!selected}>
          {isLastQuestion ? 'Submit' : 'Next'}
        </button>
      </div>
    </form>
  );
};

const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const Quiz = ({ questions, currentQuestionIndex, currentQuestion, handleAnswerSubmit, handlePreviousQuestion, error }) => {
  return (
    <QuestionForm
      question={currentQuestion?.question}
      answers={
        currentQuestion
          ? shuffle([currentQuestion.correct_answer, ...currentQuestion.incorrect_answers])
          : []
      }
      onSubmit={handleAnswerSubmit}
      onPrevious={currentQuestionIndex > 0 ? handlePreviousQuestion : null}
      error={error}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      currentAnswer={currentQuestion?.selectedAnswer || ''}
    />
  );
};

export default QuestionForm;
export { Quiz };