import {DAYS, TIMES} from '../Constants'
export function updateModule(data){
    const {
        code,
        location,
        endTime,
        time,
        day,
        colors,
        previousPosition
    } = data;
    let dayIndex = DAYS.indexOf(day);
    let startIndex = TIMES.indexOf(time);
    let endIndex = TIMES.indexOf(endTime);
    let position = startIndex*5 + dayIndex;
    let colspan = endIndex - startIndex;
    return {
        type: 'UPDATE_MODULE',
        data: {
            code,
            colors,
            location,
            position,
            colspan,
            previousPosition
        }
    }
}

export function setTimetable(data) {
    const {user,timetable} = data;
    return {
        type: 'SET_TIMETABLE',
        data: {
            user,
            timetable
        }
    }
}

export function swapModule(data) {
    const {sourceIndex,targetIndex} = data;
    return {
        type: 'SWAP_MODULES',
        data: {
          sourceIndex,
          targetIndex
        }
    }
}

export function toggleDragging() {
    return {
        type: 'TOGGLE_DRAGGING'
    }
}

export function clearTimetable() {
    return {
        type: 'CLEAR_TIMETABLE'
    }
}

export function deleteModule(data) {
    const {
        position, colspan
    } = data;
    return {
        type: 'DELETE_MODULE',
        data: {
            position, colspan
        }
    }
}

export function addModule(data){
    const {
        code,
        location,
        endTime,
        time,
        day,
        colors,
    } = data;
    let dayIndex = DAYS.indexOf(day);
    let startIndex = TIMES.indexOf(time);
    let endIndex = TIMES.indexOf(endTime);
    let position = startIndex*5 + dayIndex;
    let colspan = endIndex - startIndex;
    return {
        type: 'ADD_MODULE',
        data: {
            colors,
            code,
            location,
            position,
            colspan
        }
    }
}
