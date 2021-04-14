import React from 'react'
import {Button} from 'react-bootstrap'
export function GoogleButton(props) {
    return <Button onClick = {props.onClick} id = "googleButton">
       <img alt = "" style = {{height: '100%', float: 'left'}} src = "https://developers.google.com/identity/images/g-logo.png"/>
        {props.children}
   </Button>
}
