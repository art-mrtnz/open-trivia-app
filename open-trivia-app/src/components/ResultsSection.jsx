import React, { useRef, useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import HomeForm from './HomeForm';
import QuestionForm from './QuestionForm';

const ResultsSection = ({ userName, total, questions, userAnswers, onRestart }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  // Calculate correct answers and percent
  const correctCount = questions.reduce(
    (acc, q, idx) => acc + (userAnswers[idx] === q.correct_answer ? 1 : 0),
    0
  );
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const scoreClass = percent >= 70 ? "score-green" : "score-red";

  // Show confetti if passing score is reached on mount
  useEffect(() => {
    if (percent >= 70) setShowConfetti(true);
  }, [percent]);

  const handleRestart = () => {
    setShowConfetti(false);
    onRestart();
  };

  return (
    <div ref={containerRef} className="results-app-confetti-container" style={{ position: 'relative' }}>
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={250}
          recycle={false}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none'
          }}
        />
      )}
      <h2 className="results-score-header">
        {userName ? `${userName}, ` : ''}
        Your Score:
      </h2>
      <div className="results-score-center">
        <div className={`results-percent ${scoreClass}`}>
          {correctCount} / {total} correct ({percent}%)
        </div>
      </div>
      <h3>Review your answers:</h3>
      <ul>
        {questions.map((q, idx) => (
          <li key={idx} style={{ marginBottom: '1rem' }}>
            <div dangerouslySetInnerHTML={{ __html: q.question }} />
            <div>
              Your answer:{' '}
              <span
                style={{
                  color: userAnswers[idx] === q.correct_answer ? 'green' : 'red',
                  fontWeight: 'bold'
                }}
                dangerouslySetInnerHTML={{ __html: userAnswers[idx] || 'No answer' }}
              />
            </div>
            {userAnswers[idx] !== q.correct_answer && (
              <div>
                Correct answer:{' '}
                <span style={{ color: 'green', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: q.correct_answer }} />
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="results-button-row">
        <button onClick={handleRestart}>Restart Quiz</button>
      </div>
    </div>
  );
};

export default ResultsSection;