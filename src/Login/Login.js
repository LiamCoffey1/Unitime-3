import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { withFirebase } from '../Firebase';
import { Col, Card, Button, Form, Alert } from 'react-bootstrap'
import { LoadingModal } from '../Layout/Modal';

function LoginFormView(props) {
  const [email, setEmail] = useState(''); // REACT HOOKS: another way to use state
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  if (props.loggedIn) { // user has logged in
    return <Redirect to="/dash" />
  }
  return (
    <Form>
      {loading && <LoadingModal text = "Logging in. Please wait."/>}
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email Address</Form.Label>
        <Form.Control value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter email" />
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      </Form.Group>
      <Link to="/pass-reset">
        <p className = "soft">Forgot Password?</p>
      </Link>
      <Button className = "round" onClick={e => login(e)} style={{ width: "100%", marginBottom: '15px'}} variant="primary" type="submit">
        Login
          </Button>
      <Link to="/sign-up">
        <Button className = "round" style={{ width: "100%", marginBottom: '15px' }} variant="secondary" type="submit">
          Dont have an Account? Click here to Sign Up!
            </Button>
      </Link>
      <Button style = {{height: '42px', width: '100%',
            color: '#5E5E5E', fontSize: '15px', backgroundColor: 'white',
            border: '1px solid #8c8c8c'}}>
        <img alt = "ms-icon" style = {{float: 'left'}} src = "./ms-symbol.png"/>
        Sign in with Microsoft
      </Button>
    </Form>
  )
  function login(e) {
    setLoading(true);
    console.log('login')
    e.preventDefault(); //prevent page from reloading
    props.firebase // test if our firebase is working
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => { //success
        let db = props.firebase.firestore;
        let collection = db.collection("users").doc(authUser.user.uid);
        collection.get()
          .then(doc => {
            if (!doc.exists) {
              //Definitely remove this but for the moment notify us whats happening
              //ideally if it dosnt exist we want to create it
              props.setError({message: 'Create a new account this is broken from old data'});
              setLoading(false);
            } else {
              const { displayName, emailVerified, uid } = authUser.user;
              const user = {
                user: {
                  email,
                  uid,
                  displayName,
                  emailVerified,
                  ...doc.data()
                }
              }
              console.log(user);
              // Bring our data from firebase into localstorage
              // So when we refresh the page our data is still here
              // It will be loaded by the user reducer
              localStorage.setItem('authUser', JSON.stringify(user));
              props.dispatch({ type: 'SET_USER', data: user })
              setLoading(false);
            }
          })
          .catch(error => {
            props.setError(error) // set alert error in main component
            setLoading(false);
          });
        return;
      })
      .catch(error => { // failure
        props.setError(error) // set alert error in main component
        setLoading(false);
      });
  }
}

// This will get whatever value we want from our user reducer
// and pass it as props to our component
LoginFormView.mapState = function toState(state) {
  const user = state.user.data
  return {
    loggedIn: user !== null
  }
}

const LoginForm = withFirebase(connect(LoginFormView.mapState)(LoginFormView)); //Higher order component passes firebase prop

export function Login(props) {
  const CONTAINER_STYLE = {
    height: '100%',
    width: '100%',
    display: 'inline-table',
    backgroundColor: 'rgba(0,0,0,.03)'
  }
  const CONTENT_STYLE = {
    maxWidth: '50%',
    minWidth: '600px',
    minHeight: '100vh',
    paddingTop: '20px',
    paddingBottom: '20px',
    margin: '0 auto',
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
  const [error, setError] = useState('');
  return (
    <div style={CONTAINER_STYLE}>
      
      <div style={CONTENT_STYLE}>
        <Col style={{ width: '10px' }}>
          <img alt = "Unitime" id="header" style={{ display: 'block', margin: '0 auto' }} src="./Unitime - 1.png" width="auto" height="220px"></img>
          {error && <Alert variant="danger">{error.message}</Alert>}
          <Card className = "raise-element" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Card.Header className = "text-center bg-primary" >Login</Card.Header>
            <Card.Body>
              <Card.Title className = "text-center">Welcome to Unitime!</Card.Title>
              <Card.Text className = "text-center soft">
                Please enter your Email and Password to sign in!
              </Card.Text>
              <LoginForm setError={setError} />
            </Card.Body>
          </Card>
        </Col>
      </div>
    </div>
  );
}