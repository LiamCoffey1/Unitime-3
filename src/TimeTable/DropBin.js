import React from 'react'
import { DropTarget } from 'react-dnd'
import {connect} from 'react-redux'
import {deleteModule, toggleDragging} from '../actions/creator.js'

const Types = {
    MODULE: 'module',
}

const dropTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
    const {position, colspan} = item;
    const {deleteModule, toggleDragging} = component.props;
    console.log(position, colspan);
    deleteModule(position, colspan);
    toggleDragging();
    return { moved: true }
  },
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  }
}

class DropBin extends React.Component {
  render() {
    const {connectDropTarget } = this.props;
    return connectDropTarget(
      <span className = "fa fa-trash" />
    )
  }
}

const mapDispatch = function toDispatch(dispatch) {
  return {
      toggleDragging: () => dispatch(toggleDragging()),
      deleteModule: (position, colspan) => dispatch(deleteModule({position, colspan}))
  }
}

export default connect(null, mapDispatch)(
    DropTarget(Types.MODULE, dropTarget, collect)(DropBin)
)
