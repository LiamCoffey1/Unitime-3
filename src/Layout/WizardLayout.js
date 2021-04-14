import React from 'react'
import { Navbar } from 'react-bootstrap';
import AccountTool from './AccountTool';
import {withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import "./WizardLayout.css"

export function NavBar(props) {
	return <Navbar className = "navbar" style = {{marginLeft: '170px'}} fixed = "top">
                <Navbar.Collapse className="justify-content-end">
                    <AccountTool/>
                </Navbar.Collapse>
            </Navbar>
}

export function SideBarView(props) {
	const cName = (page) => {
		if(props.location.pathname === page)
			return 'active';
		else return '';
	}
	return <div className = "side-bar">
			<div style = {{width: '100%', textAlign: 'center', marginTop: '20px'}}>
				<img alt = "Unitime" style = {{width: '70%'}} src = "./Unitime - 2.png"/>
			</div>
            <Link to = "/dash">
            <li className = {cName('/dash')}><p>Dashboard</p></li>
			</Link>
			<Link to = "/assignments">
			<li className = {cName('/assignments')}><p>Assignments</p></li>
            </Link>
			<Link to = "/notes">
			<li className = {cName('/notes')}><p>Notes</p></li>
            </Link>
			<Link to = "/map">
			<li className = {cName('/map')}><p>Map</p></li>
            </Link>
            </div>
}

export const SideBar = withRouter(SideBarView);

// move to assigments folder
function Assignments(props) {
	if(props.location.pathname !== '/dash')
		return null;
	console.log(props);
	return <div style = {{right: 0}} className = "side-bar-assign">
				<p>Assignments</p>
				{props.user.assignments && props.user.assignments.map((value, index) => {
					return <React.Fragment>
							<p>{value.aname}</p>
							<p>{value.id}</p>
							<p>{value.module}</p>
							<p>{new Date(value.duedate.seconds*1000).getUTCMonth()}</p>
						</React.Fragment>
				})}
            </div>
}

Assignments.mapState = function toState(state){
    return {
        user: state.user.data
    }
}

export const AssignmentBar = withRouter(connect(Assignments.mapState)(Assignments));





export function PageWrapper(props) {
	return <div className = "tutorial" style = {{height: '100%', width: '100%', display: 'inline-table'}}>
				{props.children}
			</div>
}

export function Content(props) {
	let cName = "clearfix content-wrapper"
	if(props.location.pathname == '/dash')
		 cName = cName.concat(' dash');
	console.log(cName);
	return <div className = {cName}>
		{props.children}
	</div>
}

export const ContentWrapper = withRouter(Content);


