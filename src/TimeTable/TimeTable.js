import React from 'react';
import './TimeTable.css'
import {Table} from 'react-bootstrap'
import DroppableModule from './DroppableModule';
import DnDModule from './DnDModule';

import {TIMES, DAYS} from '../Constants'

function Module(props) {
    const { index, code, location, colors, colspan } = props;
    return <td rowSpan = {colspan} style = {{backgroundColor: colors[0], padding: '0', color: colors[1], borderColor: colors[2]}}  className="active" key={index}>
       <p style={{ marginBottom: 0, fontSize: '22px', fontWeight: 'bold' }}>
              {code}
            </p>
            <p style={{}}>{location}</p>
    </td>
}
export default class TimeTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timetable: props.timetable
        }
    }

    renderHeader() {
        const days = ['Time'].concat(DAYS);
        return days.map((value, index) => {
            return <th key = {index}>{value}</th>
        })
    }
    renderRows() {
        let timetable = this.props.timetable.data;
        return TIMES.map((time, row) => { // Loop over every row of data
            return <tr key = {row}>
                <td style = {{backgroundColor: this.props.timetable.color, color: this.props.timetable.textColor}} key = {row}>{time}</td>
                {DAYS.map((day, index) => { // loop over every element of row
                if(index !== 5) {
                    let position = (row*5 + index);
                    let current = timetable[position];
                    if(current.hidden === true)
                        return null;
                    if(current && current.code){//if data present 
                        //Here we will check if timetable is in edit mode
                        //If so we return a draggable module
                        //else just return regular module info inside a <td>
                        let props = {
                            code: current.code,
                            location: current.location,
                            colspan: current.colspan,
                            colors: current.colors,
                            time,
                            day,
                            position,
                        }
						let ret = {...props, day, time}
                        return !this.props.edit ? <Module key = {position} {...props}/>
                                : <DnDModule  key = {position} toggleEdit={e=>{this.props.toggleEdit(ret)}} {...props}/>
                    }
                    // else return empty table cell
                    else return !this.props.edit ? <td key = {position}></td> 
                                : <DroppableModule key = {position} position = {position}/> 
                } return null;
                })}
            </tr>
        })
    }

    render() {
        return <div className = "raise-element">
                    {this.props.timetable && <Table className = "timeTable" striped responsive>
                        <thead style = {{color: this.props.timetable.textColor, backgroundColor: this.props.timetable.color}}>
                        <tr>
                            {this.renderHeader()}
                        </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()}
                        </tbody>
                    </Table>}
                </div>
    }
}