import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [id, setID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedButton,] = useState(null);
  const [isIncrementing, setIsIncrementing] = useState(false);

  useEffect(() => {
    fetch(`/database?button=${selectedButton || ''}`)
      .then((response) => response.json())
      .then((data) => {
        const idAsNumber = parseInt(data.id, 10);
        setID(idAsNumber);
        setIsLoading(false);
      })
      .catch((error) => console.error('ERROR = ', error));
  }, [selectedButton]);


  const incrementID = () => {
    if (isIncrementing) {
      return;
    }
    setIsIncrementing(true);
    fetch('/database/increment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentID: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setID(data.id);
      })
      .catch((error) => console.error('ERROR = ', error))
      .finally(() => {
        setIsIncrementing(false);
      });
  };


  const decrementID = () => {
    if (isIncrementing) {
      return;
    }
    setIsIncrementing(true);
    fetch('/database/decrement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentID: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setID(data.id);
      })
      .catch((error) => console.error('ERROR = ', error))
      .finally(() => {
        setIsIncrementing(false);
      });
  };

  return (
    <div className="App">
      <div className="main-content">
      <h1>DB data</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <h1>{id}</h1>
        )}
      </div>
      <button onClick={incrementID}>Increment</button>
      <button onClick={decrementID}>Decrement</button>
    </div>
  );
}

export default App;
