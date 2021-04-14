import React from 'react'
import {Accordion, Card, Button, Form} from 'react-bootstrap'
import "./Assignments.css"
import { connect } from 'react-redux'
import DatePicker from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withFirebase } from '../Firebase'
import { InfoModal } from '../Layout/Modal'

class Assignments extends React.Component {
	
	state = {
        selectedDate: new Date(),
        showAdd: false,
        module: '',
        aname: '',
        duedate: '',
        priority: '',
        assignments: []
    }

    componentWillUnmount() {
        this.saveAssignments();
    }

    saveAssignments() {
        const { assignments } = this.props.assignments;
        const { uid } = this.props.user;
        if (assignments) {
            //Fix from where if a user logs out while editing
            //it will write to localstorage of a user that
            //does not exist anymore
            let user = JSON.parse(localStorage.getItem('authUser'))
            if (user !== null)
                this.props.dispatch(
                    {
                        type: 'UPDATE_USER',
                        data: {
                            assignments
                        }
                    }
                )
            //We always want to save their changes to db
            let db = this.props.firebase.firestore;
            db.collection("users").doc(uid).update({ assignments })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }
	
	componentDidMount() {
        //When we exit browser, save
        const { user } = this.props;
        if (user.assignments) {
            this.props.dispatch({type:"SET_ASSIGNMENTS", data:{assignments: user.assignments}});
        }
    }
	
	addAssignment(){
        //should pass only required props instead of all props
		this.props.dispatch({type:"ADD_ASSIGNMENTS", data:{...this.state, duedate: {seconds: this.state.selectedDate/1000}}});
    }
    
	
	toggleAdd=()=> {
        this.setState(state => ({
            showAdd: !state.showAdd,
        }))
    }

    handleChange = (e) => {
        this.setState({selectedDate: e})
    }

    //needs style
    renderDatePicker() {
        return  <Form.Group style = {{display: 'grid'}} controlId="exampleForm.ControlSelect1">
                    <Form.Label>Due Date</Form.Label>
                    <DatePicker
                            selected={this.state.selectedDate}
                            showTimeSelect
                            onChange={this.handleChange}
                        />
                 </Form.Group>
    }

	renderForm() {
		const {module, aname} = this.state;
        return <React.Fragment>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Module Code</Form.Label>
                <Form.Control value={module} onChange={e => this.setState({ module: e.target.value })} type="name" placeholder="Enter code" />
            </Form.Group>
			<Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Assignment</Form.Label>
                <Form.Control value={aname} onChange={e => this.setState({ aname: e.target.value })} type="name" placeholder="Enter assignment" />
            </Form.Group>
			{this.renderDatePicker()}
        </React.Fragment>
    }

    //move logic to shared space
    getRemainingTime(date) {
        let d = new Date(date.seconds*1000)
        var t = Date.parse(d) - Date.parse(new Date());
        var minutes =  Math.abs(Math.floor( (t/1000/60) % 60 ));
        var hours =  Math.abs(Math.floor( (t/(1000*60*60)) % 24 ));
        var days =  Math.abs(Math.floor( t/(1000*60*60*24) ));
        let ret = ""
        if(d < new Date()) {
            ret = "Overdue by: "
        } else ret = "Due in: "
        if(days != 0)
            ret = ret.concat(days + " days, ")
        if(hours != 0) 
            ret = ret.concat(hours + " hours, ")
        if(minutes != 0) 
            ret = ret.concat(minutes + " minutes")
        return ret;
    }

    //needs fixing
    sortByDate(array) {
        return array.sort(function(a,b){
            let c = new Date(a.duedate.seconds*1000)/1000
            let d = new Date(b.duedate.seconds*1000)/1000
            return c < d ? 1: -1;
        });
    }

  render() {
	const { showAdd, module, aname} = this.state;
	const disabled = module === "" || aname === "";
    return (
        <div className = "clearfix" style = {{width: '100%'}}>
            <div style = {{display: 'flex'}}>
                <h3 style = {{flex: '1'}}>Filters</h3>
                <Button style = {{marginBottom: '10px', width: '200px'}} onClick={e=> {this.setState({showAdd: true})}}>
                    Add Assignments
                </Button>
            </div>
             <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Module</Form.Label>
                <Form.Control value={module} onChange={e => this.setState({ module: e.target.value })} type="name" placeholder="Enter code" />
            </Form.Group>
            {this.renderDatePicker()}
			<div className='box'>
            {showAdd && <InfoModal onClose={e => { this.toggleAdd() }} title="Add Module">
               {this.renderForm()}
               <Button disabled={disabled} onClick={e => { this.addAssignment() }}>
                   Start Assignment
               </Button>
            </InfoModal>}
			<Accordion style = {{width: '100%'}}>
			{!!this.props.assignments.assignments.length && this.sortByDate(this.props.assignments.assignments).map((value, index)=>{
				return <Card key = {index} className= 'due'>
                    <Card.Header className = "bg-primary">
                        <Accordion.Toggle as={Button} variant="link" eventKey={index}>
                            <div>
                                {value.module}:         {value.aname}
                            </div>
                        </Accordion.Toggle>
                        <div className = "assign-toolbar" style = {{float: 'right', display: 'flex', height: '20px', marginTop: '6px'}}>
                            <p style = {{marginRight: '20px', fontWeight: 'bold'}}>{this.getRemainingTime(value.duedate)}</p>
                            <span style = {{fontSize: '18px', marginRight: '10px'}} onClick = {e=>{
                                this.props.dispatch({type: 'DELETE_ASSIGNMENT', data: {id: value.id}})
                            }} className = "fa fa-trash"/>
                            <span style = {{fontSize: '18px'}} className = "fa fa-check"/>
                        </div>
                    </Card.Header>
                    <Accordion.Collapse eventKey={index}>
                        <Card.Body>Stuff</Card.Body>
                    </Accordion.Collapse>
                </Card>
            })}
			</Accordion>
			</div>
			
        </div>
    );
  } 
}

Assignments.mapState = function toState(state) {
    const user = state.user.data
    const assignments = state.assignments
    return {
        user, assignments
    }
}

export default withFirebase(
    connect(Assignments.mapState)(Assignments)
);