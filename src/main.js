import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <App />
    </FirebaseContext.Provider>,
 document.getElementById('root'));