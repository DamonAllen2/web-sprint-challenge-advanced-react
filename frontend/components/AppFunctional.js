import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

 // the index the "B" is at
let x = 2;
let y = 2;

const initialValues = {
  'message': '',
  'email': '',
  'steps': 0,
  'index': 4,
  'x': x,
  'y': y,
}

export default function AppFunctional(props) {
  const [values, setValues] = useState(initialValues);
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setValues({ 'message': '', 
    'email': '',
    'steps': 0,
    'index': 4,})
    x = 2;
    y = 2;
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    let direction = evt.target.id;
    let index = values.index;
    if (direction === 'up') {
      if (index < 3) {
        setValues({ ...values, 'message': `You can't go up` })
      } else {
        setValues({ ...values, 'steps': values.steps + 1, 'index': values.index - 3, 'message': `` })
      }
    } else if (direction === 'right') {
      if (index === 2 || index === 5 || index === 8) {
        setValues({ ...values, 'message': `You can't go right` })
      } else {
        setValues({ ...values, 'steps': values.steps + 1, 'index': values.index + 1, 'message': `` })
      }
    } else if (direction === 'down') {
      if (index > 6) {
        setValues({ ...values, 'message': `You can't go down` })
      } else {
        setValues({ ...values, 'steps': values.steps + 1, 'index': values.index + 3, 'message': `` })
      }
    } else {
      if (index === 0 || index === 3 || index === 6) {
        setValues({ ...values, 'message': `You can't go left` })
      } else {
        setValues({ ...values, 'steps': values.steps + 1, 'index': values.index - 1, 'message': `` })
      }
    }
  }

  useEffect(() => {
    getXY(values.index);
  }, [values.index])

  function getXY(index) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    if (index === 0) {
      setValues({ ...values, 'x': 1, 'y': 1})
    } else if (index === 1) {
      setValues({ ...values, 'x': 2, 'y': 1})
    } else if (index === 2) {
      setValues({ ...values, 'x': 3, 'y': 1})
    } else if (index === 3) {
      setValues({ ...values, 'x': 1, 'y': 2})
    } else if (index === 4) {
      setValues({ ...values, 'x': 2, 'y': 2})
    } else if (index === 5) {
      setValues({ ...values, 'x': 3, 'y': 2})
    } else if (index === 6) {
      setValues({ ...values, 'x': 1, 'y': 3})
    } else if (index === 7) {
      setValues({ ...values, 'x': 2, 'y': 3})
    } else if (index === 8) {
      setValues({ ...values, 'x': 3, 'y': 3})
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setValues({ ...values, 'email': evt.target.value })
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    let email = values.email;
    let check = ['@', '.'];
    let checked = false;
    
    if (email.includes(check[0])) {
      if (email.includes(check[1])) {
        checked = true;
      }
    }

    if (values.email === 'foo@bar.baz') {
      axios.post('http://localhost:9000/api/result', {
        'x': values.x,
        'y': values.y,
        'steps': values.steps,
        'email': 'tes@mai.com',
      })
      .then(res => {
        let newMessage = res.data.message;
        setValues({ ...values, 'message': `foo@bar.baz failure ${newMessage.slice(8)}`, 'email': '' });
        console.log(newMessage.slice(8));
        console.log(email)
      })
    } else if (values.email === '') {
      setValues({ ...values, 'message': 'Ouch: email is required' })
      console.log(values.email)
    } else if (checked === false) {
      setValues({ ...values, 'message': `Ouch: email must be a valid email` })
      console.log('values.email')
    } else {
      axios.post('http://localhost:9000/api/result', {
        'x': values.x,
        'y': values.y,
        'steps': values.steps,
        'email': values.email,
      })
      .then(res => {
        setValues({ ...values, 'message': res.data.message, 'email': '' });
      })
    }
    
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({values.x}, {values.y})</h3>
        <h3 id="steps">You moved {values.steps === 1 ? '1 time' : `${values.steps} times`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === values.index ? ' active' : ''}`}>
              {idx === values.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{values.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="text" placeholder="type email" value={values.email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
