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
import ColorPicker from './ColorPicker'

class CreatorView extends React.Component {

    state = {
        showAdd: false,
        previousPosition: {},
        colors: ['teal', 'black', 'black'],
        code: '',
        location: '',
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
        this.props.deleteModule({ ...this.state.previousPosition });
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
            db.collection("users").doc(uid).update({ timetable })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }
    toggleAdd() {
        this.setState(state => ({
            code: '',
            location: '',
            colors: ['teal', 'black', 'black'],
            time: '9:00',
            startTime: '9:00',
            endTime: '10:00',
            day: 'Monday',
            showAdd: !state.showAdd
        }))
    }
    toggleEdit(payload) {
        if (payload) {
            const { code, location, time, day, colspan, colors } = payload;
            let endTime = TIMES[TIMES.indexOf(time) + colspan];
            let previousPosition = { position: TIMES.indexOf(time) * 5 + DAYS.indexOf(day), colspan };
            this.setState({ code, location, time, day, colors, colspan, endTime, previousPosition })
        }
        this.setState(state => ({
            showEdit: !state.showEdit,
        }))
    }
    setColor(color, id) {
        let colors = this.state.colors;
        colors[id] = color;
        this.setState({ colors })
    }
    renderColorPickersTT() {
        const { timetable } = this.props.creator;
        if (timetable)
            return <div style={{ display: 'flex' }}>
                <ColorPicker title="Header Color" color={timetable.color} onColorChange={
                    color => this.props.setTimetableColor(color, null)} />
                <ColorPicker title="Text Color" color={timetable.textColor} onColorChange={
                    color => this.props.setTimetableColor(null, color)} />
            </div>
    }
    renderColorPickers() {
        const { colors } = this.state;
        let TITLES = ['Background Color', 'Text Color', 'Border Color'];
        return colors.map((value, index) => {
            return <div key={index} style={{ flex: '1' }}>
                <ColorPicker title={TITLES[index]} color={value} onColorChange={
                    color => this.setColor(color, index)} />
            </div>
        })
    }
    renderForm() {
        const { code, location, time, day, endTime } = this.state;
        return <React.Fragment>
            <div style={{ display: 'flex' }}>
                {this.renderColorPickers()}
            </div>
            <Form.Group controlId="formGridEmail">
                <Form.Label>Module code</Form.Label>
                <Form.Control value={code} onChange={e => this.setState({ code: e.target.value })} type="name" placeholder="Enter code" />
            </Form.Group>
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
                    {TIMES.concat('18:00').map((value, index) => {
                        if(index > TIMES.indexOf(this.state.time))
                        return <option key={index}>{value}</option>
                    })}
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
            {this.renderColorPickersTT()}
            <div style={{ display: 'flex' }}>
                <div style={{ flex: '1' }}>
                    <Button onClick={e => { clearTimetable() }} style={{ float: 'left' }}>
                        Clear Timetable
                    </Button>
                </div>
                <div style={{ flex: '1' }}>
                    <Button onClick={e => { this.toggleAdd() }} style={{ float: 'right' }}>
                        Add Module
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
        setTimetableColor: (color, textColor) => dispatch(
            {
                type: 'SET_TIMETABLE_COLOR',
                data: {
                    color, textColor
                }
            }
        ),
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
        CreatorView.mapDispatch
    )(CreatorView)
);