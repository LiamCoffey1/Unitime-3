import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { withFirebase } from '../Firebase';
import { Col, Card, Button, Form, Alert } from 'react-bootstrap'
import { LoadingModal } from '../Layout/Modal';


export default function PassReset(props) {
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
          <Card className = "raise-element" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Card.Header className = "text-center bg-primary" > Send Email</Card.Header>
            <Card.Body>
              <Card.Title className = "text-center">Password Reset!</Card.Title>
              <Card.Text className = "text-center soft">
                Please enter your Email to reset password !
              </Card.Text>
              <ResetForm setError={setError} />
            </Card.Body>
          </Card>
        </Col>
      </div>
    </div>
  );
}

const ResetForm = withFirebase(PassResetView);

function PassResetView(props) {
  const [email, setEmail] = useState(''); // REACT HOOKS: another way to use state
  const [loading, setLoading] = useState(false);
  const sendReset = (e) => {
	  e.preventDefault();
	  props.firebase.resetEmail(email);
  }
  return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email Address</Form.Label>
        <Form.Control value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter email" />
      </Form.Group>
      <Button onClick = {e=>{sendReset(e)}} className = "round" style={{ width: "100%", marginBottom: '15px', background: 'rgb(255, 148, 77)', outline: 'rgb(255, 148, 77)' }} variant="primary" type="submit">
        Reset Password
       </Button> 
	   <Link to ="/login"> 
	   <Button className = "round" style={{ width: "100%", marginBottom: '15px' }} variant="secondary" type="submit">
		Log in
       </Button>
	     </Link> 
    </Form>
  )
}

              

// This will get whatever value we want from our user reducer
// and pass it as props to our component

