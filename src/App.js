import React from 'react';
import { Route, BrowserRouter, Switch, Redirect, Link } from 'react-router-dom';
import {EnsureLoggedInContainer} from './Components/EnsureLoggedInContainer.js'
import { Provider } from 'react-redux'
import reduxStore from './reduxStore.js';
import {Login} from './Login/Login.js'
import PassReset from './Login/Passreset.js'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {SignUp} from './Login/SignUp.js'
import './App.css';
import { Col } from 'react-bootstrap'
import { Dash } from './Dash/Dash';
import  Map  from './Map/Map.js'
import Assignments from './Assignments/Assignments.js'
import Notes from './Notes/Notes.js'
import Creator from './TimeTable/Creator.js';
import { PageWrapper, NavBar, ContentWrapper, SideBar, AssignmentBar } from './Layout/WizardLayout.js';
  

function fallback(props) { // Invalid route redirects here (optional)
  const CONTAINER_STYLE = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
  const ERROR_SIGN_STYLE = {
    color: '#ff5016',
    fontSize: '120px',
    marginBottom: '30px'
  }
  return (
    <div style={CONTAINER_STYLE}>
      <Col style={{ textAlign: 'center' }}>
        <span style={ERROR_SIGN_STYLE} className="fas fa-exclamation-circle" />
        <p><strong>ERROR: 404</strong> page cannot be found</p>
      </Col>
    </div>
  );
}
window.store = reduxStore;

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Provider store={reduxStore}>
        <BrowserRouter>
          <Switch>
            <Redirect exact path="/" to='/dash' />
            <Route path="/login" component={Login} />
            <Route path="/sign-up" component={SignUp} />
			      <Route path="/pass-reset" component ={PassReset} />	
            <EnsureLoggedInContainer> {/** AUTH PROTECTED ROUTES GO HERE */}
            <PageWrapper>
              <NavBar/>
              <SideBar/>
              <AssignmentBar/>
              <ContentWrapper>
                <Route path="/dash" component={Dash} />
                <Route path="/new" component={Creator} />
                <Route path="/map" component={Map} />
				        <Route path="/assignments" component ={Assignments} />
                <Route path="/notes" component={Notes} />
              </ContentWrapper>
              </PageWrapper>		 
            </EnsureLoggedInContainer>
            <Route path="/" component={fallback} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </DndProvider>
  );
}

export default App;