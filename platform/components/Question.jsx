import React, { useState, useEffect } from 'react';

// --- Mock Shadcn UI Components (mimicking their appearance with Tailwind CSS) ---

// Card Component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

// Button Component
const Button = ({ children, onClick, variant = 'default', className = '', disabled = false }) => {
  let baseStyles = 'px-4 py-2 rounded-md transition-colors duration-200';
  let variantStyles = '';

  switch (variant) {
    case 'default':
      variantStyles = 'bg-blue-500 text-white hover:bg-blue-600';
      break;
    case 'outline':
      variantStyles = 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50';
      break;
    case 'destructive':
      variantStyles = 'bg-red-500 text-white hover:bg-red-600';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-blue-500 hover:bg-blue-50';
      break;
    case 'success':
      variantStyles = 'bg-green-500 text-white hover:bg-green-600';
      break;
    case 'disabled':
      variantStyles = 'bg-gray-300 text-gray-600 cursor-not-allowed';
      break;
    default:
      variantStyles = 'bg-blue-500 text-white hover:bg-blue-600';
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// AlertDialog Component (simplified for quiz feedback)
const AlertDialog = ({ title, description, isOpen, onClose, actionButtonText, onAction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{description}</p> {/* Added whitespace-pre-wrap */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {actionButtonText && onAction && (
            <Button onClick={onAction}>{actionButtonText}</Button>
          )}
        </div>
      </Card>
    </div>
  );
};

// Progress Component
const Progress = ({ value, max = 100, className = '' }) => {
  const percentage = (value / max) * 100;
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// --- Question Data ---
const questions = [
  {
    id: 1,
    type: 'mcq', // Multiple Choice Question
    question: "Which HTML tag is used to create the largest heading?",
    options: ["<head>", "<h6>", "<h1>", "<title>"],
    correctAnswerIndex: 2,
    difficulty: "Easy",
    category: "HTML"
  },
  {
    id: 2,
    type: 'mcq',
    question: "What CSS property would you use to change the background color of an element?",
    options: ["color", "bg-color", "background-color", "text-background"],
    correctAnswerIndex: 2,
    difficulty: "Easy",
    category: "CSS"
  },
  {
    id: 3,
    type: 'mcq',
    question: "How do you correctly output 'Hello World' in the browser's console using JavaScript?",
    options: ["print('Hello World');", "log('Hello World');", "console.log('Hello World');", "write('Hello World');"],
    correctAnswerIndex: 2,
    difficulty: "Easy",
    category: "JavaScript"
  },
  {
    id: 4,
    type: 'mcq',
    question: "Which CSS property is used to make an element disappear from the layout flow entirely, as if it was never there?",
    options: ["visibility: hidden;", "opacity: 0;", "display: none;", "height: 0;"],
    correctAnswerIndex: 2,
    difficulty: "Hard",
    category: "CSS"
  },
  {
    id: 5,
    type: 'mcq',
    question: "Which HTTP method would typically be used by a client to *create* a new resource on the server (e.g., submit a new user registration)?",
    options: ["GET", "PUT", "DELETE", "POST"],
    correctAnswerIndex: 3,
    difficulty: "Medium",
    category: "Full-Stack"
  },
  {
    id: 6,
    type: 'mcq',
    question: "What is the primary role of JavaScript in web development?",
    options: ["To structure the content of a web page.", "To style the appearance of a web page.", "To add interactivity and dynamic behavior to a web page.", "To store data on a server."],
    correctAnswerIndex: 2,
    difficulty: "Medium",
    category: "JavaScript"
  },
  {
    id: 7,
    type: 'mcq',
    question: "What does `box-sizing: border-box;` do in CSS?",
    options: ["It makes the element's width and height include padding and border.", "It makes the element's width and height exclude padding and border.", "It adds a shadow effect around the element's box.", "It prevents the box from collapsing."],
    correctAnswerIndex: 0,
    difficulty: "Medium",
    category: "CSS"
  },
  {
    id: 8,
    type: 'mcq',
    question: "What is the purpose of an API (Application Programming Interface) in full-stack development?",
    options: ["To create visual animations on the frontend.", "To manage server hardware and network connections.", "To define how different software components should interact with each other.", "To store user data in a database."],
    correctAnswerIndex: 2,
    difficulty: "Medium",
    category: "Full-Stack"
  },
  {
    id: 9,
    type: 'mcq',
    question: "Which HTML attribute is used to provide an alternate text for an image if it cannot be displayed?",
    options: ["src", "title", "alt", "description"],
    correctAnswerIndex: 2,
    difficulty: "Medium",
    category: "HTML"
  },
  {
    id: 10,
    type: 'mcq',
    question: "What is the purpose of JWT (JSON Web Token) in full-stack authentication?",
    options: ["To define the structure of a web page using JSON.", "To securely transmit information between parties as a JSON object, enabling stateless authentication.", "To perform database queries using JSON syntax.", "To encrypt frontend assets before deployment."],
    correctAnswerIndex: 1,
    difficulty: "Hard",
    category: "Security"
  },
  // --- Find the Error Question Example ---
  {
    id: 11,
    type: 'debug', // New type for debugging puzzles
    question: "The Case of the Muted Message: A crucial warning message is blending into the background. It's supposed to be a bold, striking red, but it remains a dull gray. Find out why this vital message is muted!",
    codeSnippet: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Guild</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Welcome, Brave Adventurer!</h1>
    </header>

    <main>
        <p>Prepare for your journey into the realms of valor and peril.</p>
        
        <div class="warning-message">
            Beware of the Shadow Lurkers in the Whispering Woods!
        </div>

        <p>Check your quest log for your first assignment.</p>
    </main>

    <footer>
        <p>&copy; 2025 The Adventurers Guild</p>
    </footer>
</body>
</html>

/* styles.css */
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    color: #333;
    margin: 20px;
}

h1 {
    color: #007bff;
}

#warning-message { /* Notice the selector here! */
    color: red;
    font-weight: bold;
    padding: 10px;
    border: 1px solid red;
    background-color: #ffeaea;
}

p {
    line-height: 1.6;
}
`,
    clues: [
      "Clue 1: The Visual Inspection - Use Developer Tools (Elements tab, Styles pane) to inspect the 'Warning Message' div. Is your intended `color: red;` rule listed? If so, is it crossed out or overridden?",
      "Clue 2: The HTML Blueprint Audit - Look closely at `index.html`. What attribute is used to identify the warning message div (`id` or `class`)? What is its value?",
      "Clue 3: The CSS Rule Book Review - Compare the HTML attribute's naming with how the CSS rule is written in `styles.css`. Do the HTML attribute and CSS selector match?"
    ],
    solution: {
      location: "File: `styles.css`, Section: CSS rule for `#warning-message`",
      nature: "The HTML `div` uses a `class` attribute (`class=\"warning-message\"`), but the CSS is trying to target it using an `ID` selector (`#warning-message`). Class selectors start with a dot (`.`), while ID selectors start with a hash (`#`). They don't match.",
      fix: "Change `#warning-message` to `.warning-message` in `styles.css`."
    },
    difficulty: "Easy",
    category: "HTML/CSS Debugging"
  }
];

// --- Main Question Component ---
function Question() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null); // For MCQ
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [showDebugSolution, setShowDebugSolution] = useState(false); // For Debug questions

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Handles user selecting an answer for MCQ
  const handleAnswerSelect = (index) => {
    if (selectedAnswerIndex !== null) return; // Prevent re-answering
    setSelectedAnswerIndex(index);

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      setFeedbackTitle("Correct!");
      setFeedbackMessage("Excellent work, Adventurer! Your knowledge shines brightly.");
    } else {
      setFeedbackTitle("Incorrect!");
      setFeedbackMessage(`The correct answer was: "${currentQuestion.options[currentQuestion.correctAnswerIndex]}". Keep learning!`);
    }
    setShowFeedback(true);
  };

  // Handles moving to the next question (for both MCQ and Debug)
  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswerIndex(null); // Reset selected answer for next question
    setShowDebugSolution(false); // Hide solution for next debug question

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setIsQuizFinished(true); // End of quiz
    }
  };

  // Handles restarting the quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setScore(0);
    setShowFeedback(false);
    setFeedbackTitle('');
    setFeedbackMessage('');
    setIsQuizFinished(false);
    setShowDebugSolution(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          pre {
            background-color: #e2e8f0; /* bg-slate-200 */
            padding: 1rem;
            border-radius: 0.375rem; /* rounded-md */
            overflow-x: auto;
            font-size: 0.875rem; /* text-sm */
            line-height: 1.5;
          }
        `}
      </style>

      <Card className="w-full max-w-4xl"> {/* Increased max-width for debug questions */}
        {!isQuizFinished ? (
          <>
            <Progress value={currentQuestionIndex + 1} max={totalQuestions} className="mb-6 h-3" />
            <div className="text-sm text-gray-500 mb-4">
              Question {currentQuestionIndex + 1} of {totalQuestions} | Difficulty: {currentQuestion.difficulty} | Category: {currentQuestion.category}
            </div>

            {currentQuestion.type === 'mcq' ? (
              // --- MCQ Question Display ---
              <>
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  {currentQuestion.question}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left justify-start ${
                        selectedAnswerIndex !== null
                          ? (index === currentQuestion.correctAnswerIndex
                              ? 'bg-green-500 hover:bg-green-600' // Correct answer
                              : (index === selectedAnswerIndex
                                  ? 'bg-red-500 hover:bg-red-600' // Incorrect selected answer
                                  : 'bg-blue-500 hover:bg-blue-600 opacity-70 cursor-not-allowed' // Unselected after answer
                                )
                            )
                          : 'bg-blue-500 hover:bg-blue-600' // Not yet answered
                      }`}
                      disabled={selectedAnswerIndex !== null} // Disable buttons after an answer is selected
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                {selectedAnswerIndex !== null && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleNextQuestion}>
                      {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              // --- Debugging Puzzle Display ---
              <>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Quest: {currentQuestion.question}
                </h2>
                <h3 className="text-lg font-medium mb-2 text-gray-700">Code Snippet:</h3>
                <pre className="mb-4 text-sm rounded-md p-4 bg-slate-200 overflow-x-auto">
                  <code>{currentQuestion.codeSnippet}</code>
                </pre>

                <h3 className="text-lg font-medium mb-2 text-gray-700">Clues:</h3>
                <ul className="list-disc list-inside mb-6 text-gray-700">
                  {currentQuestion.clues.map((clue, index) => (
                    <li key={index} className="mb-1">{clue}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-medium mb-2 text-gray-700">Your Solution:</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  placeholder="Describe the error's location, nature, and your proposed fix..."
                  disabled={showDebugSolution} // Disable textarea after solution is revealed
                ></textarea>

                <div className="flex justify-end space-x-2">
                  {!showDebugSolution && (
                    <Button onClick={() => setShowDebugSolution(true)}>Reveal Solution</Button>
                  )}
                  {showDebugSolution && (
                    <Button onClick={handleNextQuestion}>
                      {currentQuestionIndex < totalQuestions - 1 ? 'Next Puzzle' : 'Finish Quiz'}
                    </Button>
                  )}
                </div>

                {showDebugSolution && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Solution Revealed!</h3>
                    <p className="mb-1 text-green-800">
                      <strong>Location:</strong> {currentQuestion.solution.location}
                    </p>
                    <p className="mb-1 text-green-800">
                      <strong>Nature of the error:</strong> {currentQuestion.solution.nature}
                    </p>
                    <p className="text-green-800">
                      <strong>Proposed fix:</strong> {currentQuestion.solution.fix}
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          // --- Quiz Finished Display ---
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Quiz Complete!</h2>
            <p className="text-lg text-gray-700 mb-6">
              You scored {score} out of {totalQuestions} questions.
            </p>
            <Button onClick={handleRestartQuiz}>Restart Quiz</Button>
          </div>
        )}
      </Card>

      <AlertDialog
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        title={feedbackTitle}
        description={feedbackMessage}
        actionButtonText={currentQuestionIndex < totalQuestions - 1 ? 'Continue' : 'View Results'}
        onAction={handleNextQuestion}
      />
    </div>
  );
}

export default Question;
