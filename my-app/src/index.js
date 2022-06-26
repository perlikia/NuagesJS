import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const Cont = createContext({
  elements: [],
  setElemenets: (elements) => {}
})

class Element extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      value: props.value
    }
  }

  render(){
    return <p>{this.state.value}</p>
  }

}

class List extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      elements: [1, 2, 3, 4],
      setElemenets: (elements) => {
        this.setState((state) => ({
          elements: elements
        }))
      }
    }
  }

  render(){

    document.onkeydown = (event) => {
      this.state.setElemenets([])
    } 

    return this.state.elements.map((value, index) => {
      return <Element value={value} key={index}></Element>
    })

  }

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
