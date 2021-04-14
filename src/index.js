import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Firebase, { FirebaseContext } from './Firebase';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <App />
    </FirebaseContext.Provider>,
 document.getElementById('root'));
 
 /*  ReactDOM.render((       
  <BrowserRouter>
    <App />
  </BrowserRouter>  */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//https://www.codingame.com/playgrounds/6517/react-router-tutorial