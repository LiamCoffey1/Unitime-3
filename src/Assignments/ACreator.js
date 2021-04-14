import React from 'react'
import TimeTable from './TimeTable'
import { Button, Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withFirebase } from '../Firebase'
import { InfoModal } from '../Layout/Modal'
import { 
    updateModule,
    addModule,
    deleteModule,
    setTimetable,
    clearTimetable 
} from '../actions/creator.js'

import './Creator.css'

import { TIMES, DAYS } from '../Constants'
import DropBin from './DropBin'

import { TwitterPicker } from 'react-color';

class CreatorView extends React.Component {

    state = {
        showAdd: false,
        code: '',
        location: '',
        color: '#ff0000',
        time: '9:00',
        startTime: '9:00',
        endTime: '10:00',
        colspan: 1,
        day: 'Monday',
    }

    componentWillUnmount() {
        //When we leave this page, save
        this.saveTimetable();
    }

    componentDidMount() {
        //When we exit browser, save
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return this.saveTimetable();
        });
        const { user } = this.props;
        if (user) {
            this.props.setTimetable(user);
        }
    }
    updateModule() {
        this.props.updateModule(this.state)
        this.toggleEdit();
    }
    addModule() {
        this.props.addModule(this.state)
        this.toggleAdd();
    }
    deleteModule() {
        this.props.deleteModule(this.state);
        this.toggleEdit();
    }
    saveTimetable() {
        const { timetable } = this.props.creator;
        const { uid } = this.props.user;
        if (timetable) {
            //Fix from where if a user logs out while editing
            //it will write to localstorage of a user that
            //does not exist anymore
            let user = JSON.parse(localStorage.getItem('authUser'))
            if (user !== null)
                this.props.updateUser(timetable);
            //We always want to save their changes to db
            let db = this.props.firebase.firestore;
            db.collection("users").doc(uid).set(
                { timetable }
            )
                .catch(function (error) {
                    console.log(error);
                })
        }
    }
    toggleAdd() {
        this.setState(state => ({
            code: '',
            location: '',
            color: '#ff0000',
            time: '9:00',
            day: 'Monday',
            showAdd: !state.showAdd
        }))
    }
    toggleEdit(payload) {
        if (payload) {
            const { code, location, time, day, color, colspan } = payload;
            let endTime = TIMES[TIMES.indexOf(time) + colspan];
            this.setState({ code, location, time, day, color, colspan, endTime })
        }
        this.setState(state => ({
            showEdit: !state.showEdit,
        }))
    }
    renderForm() {
        const { code, location, time, day, color, endTime } = this.state;
        return <React.Fragment>
            <Form.Group controlId="formGridEmail">
                <Form.Label>Module code</Form.Label>
                <Form.Control value={code} onChange={e => this.setState({ code: e.target.value })} type="name" placeholder="Enter code" />
            </Form.Group>

            <TwitterPicker onChange={ (color, e) => {
                this.setState({ color: color.hex }) 
            } }/>

            <Form.Group controlId="formGridEmail">
                <Form.Label>Module location</Form.Label>
                <Form.Control value={location} onChange={e => this.setState({ location: e.target.value })} type="name" placeholder="Enter location" />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Day</Form.Label>
                <Form.Control value={day} onChange={e => this.setState({ day: e.target.value })} as="select">
                    {DAYS.map((value, index) => {
                        return <option key={index} >{value}</option>
                    })}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Start Time</Form.Label>
                <Form.Control value={time} onChange={e => this.setState({ time: e.target.value })} as="select">
                    {TIMES.map((value, index) => {
                        return <option key={index}>{value}</option>
                    })}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>End Time</Form.Label>
                <Form.Control value={endTime} onChange={e => this.setState({ endTime: e.target.value })} as="select">
                    {TIMES.map((value, index) => {
                        return <option key={index}>{value}</option>
                    })}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">  //to remove
                <Form.Label>Color</Form.Label>
                <Form.Control value={color} onChange={e => { this.setState({ color: e.target.value }) }} as="select">
                    <option value="#ff0000">red</option>
                    <option value="#0000ff">blue</option>
                    <option value="#00FF00">green</option>
                </Form.Control>
            </Form.Group>
        </React.Fragment>
    }
    render() {
        const { showAdd, showEdit, code, location } = this.state;
        const { dragging, timetable } = this.props.creator;
        const { clearTimetable } = this.props;
        const disabled = code === "" || location === "";
        return <div style={{ width: '100%', paddingBottom: '100px' }}>
            {dragging && <div className="dropBin">
                <DropBin />
            </div>}
            {showAdd && <InfoModal onClose={e => { this.toggleAdd() }} title="Add Module">
                {this.renderForm()}
                <Button disabled={disabled} onClick={e => { this.addModule() }}>
                    Add Module
                </Button>
            </InfoModal>}
            {showEdit && <InfoModal onClose={e => { this.toggleEdit() }} title="Edit Module">
                {this.renderForm()}
                <Button disabled={disabled} onClick={e => { this.updateModule() }}>
                    Save Changes
                </Button>
                <Button onClick={e => { this.deleteModule() }}>
                    Delete Module
                </Button>
            </InfoModal>}
            <div style={{ display: 'flex' }}>
                <div style={{ flex: '1' }}>
                    <h1>Edit Timetable</h1>
                </div>
                <div style={{ flex: '1' }}>
                    <Button onClick={e => { this.toggleAdd() }} style={{ float: 'right'}}>
                        Add Module
                    </Button>
                    <Button onClick={e => { clearTimetable() }} style={{ float: 'right'}}>
                        Clear Timetable
                    </Button>
                </div>
            </div>
            {timetable && <TimeTable toggleEdit={e => { this.toggleEdit(e) }} timetable={timetable} edit />}
        </div>
    }
}
CreatorView.mapState = function toState(state) {
    const user = state.user.data
    const creator = state.creator
    return {
        user, creator
    }
}

CreatorView.mapDispatch = function toDispatch(dispatch) {
    return {
        updateModule: (state) => dispatch(updateModule({ ...state })),
        addModule: (state) => dispatch(addModule({ ...state })),
        deleteModule: (state) => dispatch(deleteModule({ ...state })),
        setTimetable: (user) => dispatch(setTimetable(user, user.timetable)),
        clearTimetable: () => dispatch(clearTimetable()),
        updateUser: (timetable) =>
            dispatch(
                {
                    type: 'UPDATE_USER',
                    data: {
                        timetable
                    }
                }
            )
    }
}

export default withFirebase(
    connect(
        CreatorView.mapState,
        CreatorView.mapDispatch)(
            CreatorView
        )
);