import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { compose } from '../../node_modules/redux'
import {connect} from 'react-redux'
import {swapModule, toggleDragging, clearTimetable} from '../actions/creator.js'
import SubModule from './SubModule'


export class DnDModule extends React.Component {

  renderSubs(colspan) {
    let subs = []
    for(let i = 1; i < colspan; i++) {
      let position = this.props.position + i*5;
      let props = {
        ...this.props,
        position
      }
      if(position < 45)
      subs.push(<SubModule self  {...props}/>)
    }
    return subs;
  }
  render() {
    const {connectDragSource,toggleEdit, connectDropTarget, code, location, colspan, colors} = this.props;
    let span = colspan ? colspan : 1;
    return compose(connectDragSource, connectDropTarget)(
      <td rowSpan = {span} style = {{backgroundColor: colors[0], padding: '0', color: colors[1], borderColor: colors[2]}} className="active">
        <div style= {{float: "right"}}>
            <span onClick={toggleEdit} className= "fa fa-cog" style={{verticalAlign:"top", lineHeight:"30px", marginRight: '5px', fontSize:"20px", cursor:"pointer" }}/>
           </div>
          <div style = {{height: '100%', display: 'flex', flexDirection: 'column'}}>
              <div style = {{height: '100%', flex: '1'}}>
              <p style={{ marginBottom: 0, fontSize: '22px', fontWeight: 'bold' }}>
              {code}
            </p>
            <p style={{}}>{location}</p>
          </div>
          {colspan > 1 && this.renderSubs(span)}
          </div>
      </td>
    );
  }
}

const moduleSource = {
  beginDrag(props, monitor, component) {
    if(component) {
      component.props.toggleDragging()
    }
    const { code, location, position, colspan, time, day, self } = props;
    return { code, location, position, colspan, time, day, self };
  },
  endDrag(props, monitor, component) {
    if(component)
      component.props.toggleDragging()
      const { code, location, position, colspan, self } = props;
      return { code, location, position, colspan, self };
  }
};

const moduleTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
    component.props.swapModule(props.position, item.position);
    return { moved: true }
  }
};

const mapDispatch = function toDispatch(dispatch) {
  return {
      toggleDragging: () => dispatch(toggleDragging()),
      clearTimetable: () => dispatch(clearTimetable()),
      swapModule: (sourceIndex, targetIndex) => dispatch(swapModule({sourceIndex, targetIndex}))
  }
}

export default connect(null, mapDispatch)(compose(
  DragSource('module', moduleSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })),
  DropTarget('module', moduleTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  })),
)(DnDModule))