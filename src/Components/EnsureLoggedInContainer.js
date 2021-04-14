import React from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

function EnsureLoggedIn(props) {
    if(!props.loggedIn)
      return <Redirect to = "/login"/>
    return props.children;
}

EnsureLoggedIn.mapState = function toState(state){
  const user = state.user.data
  return {
    loggedIn: user !== null
  }
}

export const EnsureLoggedInContainer = connect(EnsureLoggedIn.mapState)(EnsureLoggedIn)