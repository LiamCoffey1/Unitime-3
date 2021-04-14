import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { withFirebase } from '../Firebase';
import { Col, Card, Button, Form, Alert } from 'react-bootstrap'

function SignUpView(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [complete, setComplete] = useState(false);


  if (complete)
    return <Redirect to="/login" />
  return (
    <Form>
      <Form.Group controlId="formBasicName">
        <Form.Label>Full name</Form.Label>
        <Form.Control value={name} onChange={e => setName(e.target.value)} type="name" placeholder="Enter name" />
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter email" />
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group controlId="formConfirmBasicPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" autofill="off" autoComplete="off" placeholder="Confirm Password" />
      </Form.Group>
      <Button className = "round" onClick={e => signUp(e)} style={{ width: "100%", marginBottom: '10px' }} variant="primary" type="submit">
        Create Account
          </Button>
      <Link to="/login">
        <Button className = "round" style={{ width: "100%", marginBottom: '10px' }} variant="secondary" type="submit">
          Already have an Account? Click here to Login!
            </Button>
      </Link>
    </Form>
  )

  function signUp(e) {
    e.preventDefault();
    props.firebase // test if our firebase is working
      .createUserWithEmailAndPassword(email, password)
      .then(result => { //success
        return result.user.updateProfile({
          displayName: name //update name with formInput
        }).then(() => {
          //TODO: Initialize db storage for user
          let db = props.firebase.firestore;
          let user = {};
          let timetable = new Array(50).fill({ value: null });
		  user.assignments= [];
          user.ID = result.user.uid;
          user.timetable = {
              color: '#DD8F31',
              textColor: 'white',
              data: timetable
          }
          db.collection("users").doc(result.user.uid).set(
            { timetable: user.timetable }
          )
            .then(function (docRef) {
              setComplete(true);
            })
            .catch(function (error) {
              props.setError(error) // set alert error in main component
            });
        })
      })
      .catch(error => { // failure
        props.setError(error) // set alert error in main component
      });
  }
}

const SignUpForm = withFirebase(SignUpView); //Higher order component passes firebase prop

export function SignUp(props) {
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
            <Card style={{ marginTop: '20px', marginBottom: '20px' }} className="raise-element">
              <Card.Header className = "bg-primary text-center">SignUp</Card.Header>
              <Card.Body>
                <Card.Title className = "text-center">Welcome to Unitime!</Card.Title>
                <Card.Text className = "text-center soft">
                  Please enter your details below to sign up for Unitime!
            </Card.Text>
                <SignUpForm setError={setError} />
              </Card.Body>
            </Card>
        </Col>
      </div>
    </div>
  );
}