import React from 'react'
import { withFirebase } from "../Firebase"
import {connect} from 'react-redux'
import TimeTable from '../TimeTable/TimeTable.js'
import { Button } from 'react-bootstrap';
import {Link} from 'react-router-dom';

class DashView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signOut: false
        }
    }
    render() {
        return <div style = {{width: '100%'}}>
        <div style = {{display: 'flex'}}>
            <div style = {{flex: '1'}}>
                <h1>My Timetable</h1>
            </div>
            <div style = {{flex: '1'}}>
                <Link to = "./new">
                    <Button style = {{float: 'right', width: '170px', height: '42px'}}>Edit Timetable</Button>
                </Link>
            </div>
        </div>
        <br/>
        <TimeTable timetable = {this.props.user.timetable}/>    
        </div>
    }
}

DashView.mapState = function toState(state){
    return {
        user: state.user.data
    }
  }

export const Dash = withFirebase(connect(DashView.mapState)(DashView))