import React from 'react'
import { DropTarget } from 'react-dnd'
import {connect} from 'react-redux'
import {swapModule, toggleDragging, deleteModule} from '../actions/creator.js'

const Types = {
    MODULE: 'module',
}

const dropTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
    const {swapModule, toggleDragging} = component.props;
    let sourceIndex = props.position;
    let targetIndex = item.position;
    if((sourceIndex - targetIndex)%5 === 0) {
        swapModule(sourceIndex, targetIndex);
        toggleDragging();
    }
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

class SubModule extends React.Component {
  render() {
    const {connectDropTarget} = this.props;
    return connectDropTarget(
        <div style = {{height: '100%', flex: '1'}}>
            <div style = {{width: '100%', height: '100%'}}>
            </div>
        </div>
    )
  }
}
const mapDispatch = function toDispatch(dispatch) {
  return {
      toggleDragging: () => dispatch(toggleDragging()),
      deleteModule: (position, colspan) => dispatch(deleteModule(position, colspan)),
      swapModule: (sourceIndex, targetIndex) => dispatch(swapModule({sourceIndex, targetIndex}))
  }
}

export default connect(null, mapDispatch)(
    DropTarget(Types.MODULE, dropTarget, collect)(SubModule)
)
