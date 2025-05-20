import React, { useState } from 'react';
import HomeForm from './components/HomeForm';
import QuestionForm from './components/QuestionForm';
import ResultsSection from './components/ResultsSection';
import { fetchTriviaQuestions } from './api/triviaApi';

function shuffle(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

const QUESTIONS_PER_QUIZ = 10;
const QUESTIONS_MIN = 10;

const App = () => {
    const [userInput, setUserInput] = useState({ firstName: '', category: '', difficulty: '', numQuestions: '' });
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showFinalResults, setShowFinalResults] = useState(false);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [token, setToken] = useState('');

    // Fetch token once per quiz session
    const fetchToken = async () => {
        const res = await fetch('https://opentdb.com/api_token.php?command=request');
        const data = await res.json();
        setToken(data.token);
        return data.token;
    };

    const handleHomeFormSubmit = (input) => {
        setUserInput(input);
        fetchQuestions(input);
    };

    const fetchQuestions = async (input) => {
        setError(null);
        const numQuestions = Math.max(Number(input.numQuestions) || QUESTIONS_MIN, QUESTIONS_MIN);
        let sessionToken = token;
        if (!sessionToken) {
            sessionToken = await fetchToken();
        }
        try {
            const fetchedQuestions = await fetchTriviaQuestions(
                numQuestions,
                input.category,
                input.difficulty,
                sessionToken
            );
            setQuestions(fetchedQuestions);
            setCurrentQuestionIndex(0);
        } catch {
            setError('Failed to fetch questions. Please try again.');
        }
    };

    const handleAnswerSubmit = (answer) => {
        setUserAnswers(prev => {
            const updated = [...prev];
            updated[currentQuestionIndex] = answer;
            return updated;
        });

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setShowFinalResults(true);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const restartQuiz = () => {
        setUserInput({ firstName: '', category: '', difficulty: '', numQuestions: '' });
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setShowFinalResults(false);
        setError(null);
        setUserAnswers([]);
    };

    return (
        <div style={{ position: "relative" }}>
            <div className="app-container" style={{ position: "relative" }}>
                <img
                    src="https://img.icons8.com/color/48/000000/question-mark.png"
                    alt="question"
                    className="qm qm-top-left"
                />
                <img
                    src="https://img.icons8.com/fluency/40/000000/question-mark.png"
                    alt="question"
                    className="qm qm-top-right"
                />
                <img
                    src="https://img.icons8.com/emoji/56/000000/question-mark-emoji.png"
                    alt="question"
                    className="qm qm-bottom-left"
                />
                <img
                    src="https://img.icons8.com/ios-filled/36/fa314a/question-mark.png"
                    alt="question"
                    className="qm qm-bottom-right"
                />

                <h1>Open Trivia Database Quiz App</h1>
                
                {showFinalResults ? (
                    <ResultsSection
                        userName={userInput.firstName}
                        total={questions.length}
                        questions={questions}
                        userAnswers={userAnswers}
                        onRestart={restartQuiz}
                    />
                ) : questions.length === 0 ? (
                    <HomeForm onSubmit={handleHomeFormSubmit} />
                ) : (
                    <>
                        {/* Personalized greeting */}
                        <div className="greeting-text">
                            <strong>
                                {userInput.firstName ? `Good luck, ${userInput.firstName}!` : "Good luck!"}
                            </strong>
                        </div>
                        <QuestionForm
                            question={questions[currentQuestionIndex]?.question}
                            answers={
                                questions[currentQuestionIndex]
                                    ? shuffle([questions[currentQuestionIndex].correct_answer, ...questions[currentQuestionIndex].incorrect_answers])
                                    : []
                            }
                            onSubmit={handleAnswerSubmit}
                            onPrevious={currentQuestionIndex > 0 ? handlePreviousQuestion : null}
                            error={error}
                            questionNumber={currentQuestionIndex + 1}
                            totalQuestions={questions.length}
                            currentAnswer={userAnswers[currentQuestionIndex] || ''}
                        />
                    </>
                )}
                {/* Restart Quiz Button centered under navigation */}
                {questions.length > 0 && !showFinalResults && (
                    <div className="restart-button-row">
                        <button className="restart-button" onClick={restartQuiz}>
                            Restart Quiz
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
