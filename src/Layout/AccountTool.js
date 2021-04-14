import React from 'react';
import {Redirect} from 'react-router-dom';
import './AccountTool.css'
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import {InfoModal } from './Modal';
import { FormControl, InputGroup, Button} from 'react-bootstrap';
class AccountToolView extends React.Component{
	state = {
		logoutPending:false,
		showDropdown:false,
		showSettings:false
	}
	constructor(props) {
		super(props);
		this.dropRef = React.createRef();
	}
	toggleActive = e=>{
		console.log('toggle')
		const {showDropdown} = this.state;
		if(!showDropdown && this.dropRef) {
			this.setState({showDropdown:!this.state.showDropdown});
				setTimeout(() => {
					this.dropRef.current.focus();
				}, 100);
		}	
	}
	toggleSettings = e=>{
		const {showSettings} = this.state;
		this.setState({showSettings:!showSettings});
	}
	clickListItem(clickType){
		return (e)=>{
			e.stopPropagation()
			switch(clickType){
				case 'logout':
					this.props.dispatch({type: 'REMOVE_USER'})
					this.props.firebase.doSignOut();
					return this.setState({logoutPending:true})
				case 'settings':
                    //TODO: IMPLEMENT A MODAL FOR SETTINGS
					const {showSettings} = this.state;
					this.setState({showSettings:!showSettings});
					this.setState({showDropdown:false});
                    break;
				default:
					console.warn('INVALID clickType',clickType)
				break;
			}
		}
	}
	onBlur = () => {
		setTimeout(() => {
			this.setState({showDropdown: false});
		}, 200);
	}
	renderModal() {
		return <InfoModal onClose = {e=>{this.toggleSettings()}}title  = " Settings">
		<InputGroup className="mb-3">
			<FormControl
			placeholder="Display Name"
			aria-label="Display Name"
			aria-describedby="basic-addon1"
			/>	
		</InputGroup>
		<p>
		Send Reset Email
		</p>
		<Button onClick = {e => this.props.firebase.resetEmail('test@test.com')} type="button">dd</Button>
			<Button type="button">dd</Button>
		</InfoModal>
	}
	render() {
	
	
		const { logoutPending, showDropdown  } = this.state;
		const { user } = this.props;
		if(logoutPending){
			return <Redirect to='/login'/>
		}
		return <React.Fragment>
		{this.state.showSettings && this.renderModal()}
		<div className="accountTool" onClick={this.toggleActive}>
			<div className="userSettings">
				{getInitials(user)}
            </div>
			<span className="fas fa-caret-down"/>
			{showDropdown && <div autoFocus ref = {this.dropRef} tabIndex = "0" onBlur = {this.onBlur} className="dropdown-menu show">
				<li className="dropdown-item" onClick={this.clickListItem('settings')}> <span className="fas fa-cog"/>Settings </li>
				<li className="dropdown-item" onClick={this.clickListItem('logout')}> <span className="fas fa-sign-out-alt"/>Logout </li>
			</div>}
		</div>
		</React.Fragment>
	}
}

AccountToolView.mapState = function toState(state) {
    const user = state.user.data
    return {
      user
    }
}
export default withFirebase(connect(AccountToolView.mapState)(AccountToolView))


function getInitials(user) {
	let names = user.displayName.split(' ');
	return names[0][0] + (names[1] ? names[1][0] : '');
}