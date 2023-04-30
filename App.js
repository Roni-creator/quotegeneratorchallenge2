import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [quotes, setQuotes] = useState('');
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [synth, setSynth] = useState(null);

  const getQuote = () => {
    fetch("http://localhost:3000/quotes")
      .then(res => res.json())
      .then(data => {
        let randomNum = Math.floor(Math.random() * data.length);
        setQuotes(data[randomNum]);
        if (synth) {

          const utterance = new SpeechSynthesisUtterance(data[randomNum].quote);
          synth.speak(utterance);
        }
      });
  };

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSynth(synth);
    }
    getQuote();
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const dataToSubmit = {
      quote,
      author,
    };
    fetch("http://localhost:3000/quotes", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSubmit)
    })
      .then(res => res.json())
      .then(res => {
        alert('QUOTE SUBMITTED');
      });
  }

  return (
    <div className="App">
      <div className="quote">
        <p>{quotes.quote}</p>
        <div className="author">
          <p>{quotes.author}</p>
          <div className="btnContainer">
            <button className="button" onClick={getQuote}>Next</button>
            <button className="button" onClick={getQuote}>Previous</button>
            <button className="button" onClick={() => {

              const utterance = new SpeechSynthesisUtterance(quotes.quote);
              synth.speak(utterance);
            }}>Speak</button>
            <a href={`https://twitter.com/intent/tweet?text=${quotes.quote}`}
              target="_blank"
              rel="noopener noreferrer"
              className="twitter">Tweet</a>
          </div>
        </div>
      </div>
      <form method='post' action="#" onSubmit={handleFormSubmit}>
        <label>
          Quote
          <input type="text" value={quote} name="quote" onChange={(event) =>
            setQuote(event.target.value)} />
        </label>
        <label>
          Author
          <input type="text" value={author} name="author" onChange={(event) =>
            setAuthor(event.target.value)} />
        </label>
        <input type="submit" />
      </form>
    </div>
  );
};

export default App;
