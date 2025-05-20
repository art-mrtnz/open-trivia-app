// Fetch a new session token from Open Trivia DB
export async function fetchTriviaToken() {
  const response = await fetch('https://opentdb.com/api_token.php?command=request');
  const data = await response.json();
  return data.token;
}

export async function fetchTriviaQuestions(amount, category, difficulty, token) {
  let url = `https://opentdb.com/api.php?amount=${amount}`;
  if (category && category !== "all") {
    url += `&category=${category}`;
  }
  if (difficulty) {
    url += `&difficulty=${difficulty}`;
  }
  url += `&type=multiple`;
  if (token) {
    url += `&token=${token}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

// Reset an existing session token
export async function resetTriviaToken(token) {
  const response = await fetch(`https://opentdb.com/api_token.php?command=reset&token=${token}`);
  const data = await response.json();
  return data.token;
}