import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyC7cfhaYdULcHU5OdxeM_VLCLS7FcFEqKk",
    authDomain: "unitime-5dd29.firebaseapp.com",
    databaseURL: "https://unitime-5dd29.firebaseio.com",
    projectId: "unitime-5dd29",
    storageBucket: "unitime-5dd29.appspot.com",
    messagingSenderId: "122003648622",
    appId: "1:122003648622:web:c84255fb695c27a815767f"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
	this.firestore = app.firestore();
    //TODO: AUTH LISTENER UPDATES REDUX STORE
  }

  doSignOut = () => {
    localStorage.removeItem('authUser');
    this.auth.signOut();
  };

  createUserWithEmailAndPassword = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
	
	 resetEmail = (email ) => 
    this.auth.sendPasswordResetEmail(email).then(success =>
	{
		console.log("success")
	} );
	
 


}
export default Firebase;