import React from 'react'
import './Launcher.css'
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default class Launcher extends React.Component {
	render() {
		return(
			<div className = "page-wrap">  
			<div className = "Container-launcher">
			<div className = "launcher">
		
				<img src="./Logo.png" alt="Unitime" width="350" height="350" style = {{marginBottom: '15px'}}/>
				<div style = {{display: 'flex', justifyContent: 'center'}}>
					<div style = {{display: 'flex'}}>
						<Link to = "/login">
						<Button className ="button1" style = {{marginRight: '15px'}}>Login</Button>
						</Link>
						<Link to = "/sign-up">
						<Button className ="button2">Signup</Button>
						</Link>
					</div>
				</div>
				</div>
		 </div>
		 </div>
		)
	}
}


