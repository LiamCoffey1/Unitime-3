import React from 'react'
import { DropTarget } from 'react-dnd'
import {connect} from 'react-redux'
import {swapModule, toggleDragging} from '../actions/creator.js'

const Types = {
    MODULE: 'module',
}

const dropTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
    const {swapModule, toggleDragging} = component.props;
    let sourceIndex = props.position;
    let targetIndex = item.position;
    swapModule(sourceIndex, targetIndex);
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

class DroppableModule extends React.Component {
  render() {
    const {connectDropTarget} = this.props;
    return connectDropTarget(
      <td>
      </td>
    )
  }
}
const mapDispatch = function toDispatch(dispatch) {
  return {
      toggleDragging: () => dispatch(toggleDragging()),
      swapModule: (sourceIndex, targetIndex) => dispatch(swapModule({sourceIndex, targetIndex}))
  }
}

export default connect(null, mapDispatch)(
    DropTarget(Types.MODULE, dropTarget, collect)(DroppableModule)
)
