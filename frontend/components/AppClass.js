import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

let x = 2;
let y = 2;

export default class AppClass extends React.Component {
  constructor() {
    super();
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      x: x,
      y: y,
    }
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({ index: 4 });
    this.setState({ email: '' });
    this.setState({ message: '' });
    this.setState({ steps: 0 })
    this.setState({ x: x })
    this.setState({ y: y })
  }

  move = (evt) => {
    let direction = (evt.target.id);
    let index = this.state.index;
    if (direction === 'up') {
      if (index < 3) {
        this.setState({ message: `You can't go up`})
      } else {
        this.setState({steps: this.state.steps + 1})
        this.setState({ index: this.state.index - 3 }, () => {
          this.getXY(this.state.index);
        })
        this.setState({ message: `` })
      }
    } else if (direction === 'right') {
      if (index === 2 || index === 5 || index === 8) {
        this.setState({ message: `You can't go right`})
      } else {
        this.setState({steps: this.state.steps + 1})
        this.setState({ index: this.state.index + 1 }, () => {
          this.getXY(this.state.index);
        })
        this.setState({ message: `` })
      }
    } else if (direction === 'down') {
      if (index > 6) {
        this.setState({ message: `You can't go down` })
      } else {
        this.setState({steps: this.state.steps + 1})
        this.setState({ index: this.state.index + 3 }, () => {
          this.getXY(this.state.index);
        })
        this.setState({ message: `` })
      } 
    } else {
      if (index === 0 || index === 3 || index === 6) {
        this.setState({ message: `You can't go left`})
      } else {
        this.setState({steps: this.state.steps + 1})
        this.setState({ index: this.state.index - 1 }, () => {
          this.getXY(this.state.index);
        })
        this.setState({ message: `` })
      }
    }
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  getXY = (index) => {
    console.log(index);
    if (index === 0) {
      this.setState({x: 1});
      this.setState({y: 1});
    } else if (index === 1) {
      this.setState({x: 2});
      this.setState({y: 1});
    } else if (index === 2) {
      this.setState({x: 3});
      this.setState({y: 1});
    } else if (index === 3) {
      this.setState({x: 1});
      this.setState({y: 2});
    } else if (index === 4) {
      this.setState({x: 2});
      this.setState({y: 2});
    } else if (index === 5) {
      this.setState({x: 3});
      this.setState({y: 2});
    } else if (index === 6) {
      this.setState({x: 1});
      this.setState({y: 3});
    } else if (index === 7) {
      this.setState({x: 2}); 
      this.setState({y: 3});
    } else if (index == 8) {
      this.setState({x: 3});
      this.setState({y: 3});
    }
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.

  }

  onChange = (evt) => {
    this.setState({email: evt.target.value})
    evt.preventDefault();
    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    let email = this.state.email;
    let check = ['@', '.'];
    let checked = true;
    check.forEach(n => {
      checked &= email.includes(n);
    })
    evt.preventDefault();
    if (this.state.email === 'foo@bar.baz') {
      axios.post('http://localhost:9000/api/result', {
      'x': this.state.x,
      'y': this.state.y,
      'steps': this.state.steps,
      'email': 'tes@mai.com',
    })
    .then(res => {
      let newMessage = res.data.message;
      newMessage.slice(7);
      this.setState({ message: `foo@bar.baz failure ${newMessage.slice(8)}` });
      console.log(newMessage.slice(8));
  })
    } else if (this.state.email === '') {
      this.setState({ message: 'Ouch: email is required' })
    } else if (checked == false) {
      this.setState({ message: 'Ouch: email must be a valid email' })
    } else {
     axios.post('http://localhost:9000/api/result', {
      'x': this.state.x,
      'y': this.state.y,
      'steps': this.state.steps,
      'email': this.state.email,
    }) 
    .then(res => this.setState({ message: res.data.message }))
    .catch(err => console.error(err))
    }
    
    
    this.setState({ email: '' })
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({this.state.x}, {this.state.y})</h3>
          <h3 id="steps">You moved {this.state.steps === 1 ? '1 time' : `${this.state.steps} times`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="text" placeholder="type email" onChange={this.onChange} value={this.state.email}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
