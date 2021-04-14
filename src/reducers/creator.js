
function initState(){ //INITIAL DATA
	const state = { 
        timetable: null,
        dragging: false
	}
	return state;
}

function toggleDragging(state) {
    return {
        ...state, 
        dragging: !state.dragging
    };
}

//Used when the user goes to creator 
//screen and populates state with user
//timetable and user 
function setTimeTable(state, data) { 
	return {...state, timetable: data.timetable};
}

//Incase we want to clear the whole timetable
function clearTimeTable(state, data) { 
    let userState = {
        ...state,
        timetable: {
            color: '#DD8F31',
            textColor: 'white',
            data: new Array(50).fill({ value: null })
        }
    };
	return userState;
}

function swapModules(state, data) {
    const {sourceIndex, targetIndex} = data;
    let timetable = state.timetable.data; // get copy of our timetale
    let sourceCol = timetable[sourceIndex].colspan;
    let targetCol = timetable[targetIndex].colspan;
    if(!sourceCol) {
        let data = timetable[targetIndex];
        deleteModule(state, {position: targetIndex, colspan: targetCol})
        addModule(state, {...data, position: sourceIndex})
    }  else {
        let temp1 = timetable[sourceIndex];
        let temp2 = timetable[targetIndex];
        deleteModule(state, {position: sourceIndex, colspan: sourceCol})
        deleteModule(state, {position: targetIndex, colspan: targetCol})
        addModule(state, {...temp1, position: targetIndex})
        addModule(state, {...temp2, position: sourceIndex})
    }
    return {
        ...state,
        timetable: {
            ...state.timetable,
            data: {
                ...state.timetable.data,
                timetable
            }
        }
    }

}

function setTimeTableColor(state, data) {
    let {color, textColor} = data;
    let {timetable} = state;
    if(color) {
        timetable.color = color;
    } else timetable.textColor = textColor
    return {
        ...state,
        timetable
    }
}

function updateModule(state, data) {
    const {code, location,  colspan, position, colors, previousPosition} = data;
    let timetable = state.timetable.data; // get copy of our timetale
    //delete module with position and colspan
    deleteModule(state,{...previousPosition});
    //add module with new colspan and new position
    addModule(state, {code, location, colspan, position, colors})
    return {
        ...state,
        timetable: {
            ...state.timetable,
            data: {
                ...state.timetable.data,
                timetable
            }
        }
    }
    
}

function addModule(state, data) {
    const {code, location,  colors, colspan, position} = data;
    let timetable = state.timetable.data;
    timetable[position] = {code, location, colspan, colors};
    for(let i = 1; i < colspan; i++) {
        let index = position + i*5;
        timetable[index] = {hidden: true}
    }
    return {
        ...state,
        timetable: {
            ...state.timetable,
            data: {
                ...state.timetable.data,
                timetable
            }
        }
    }
}

function deleteModule(state, data) {
    const {position, colspan} = data;
    console.log(data);
    let timetable = state.timetable.data;
    timetable[position] = {value: null}
    if(colspan) {
        let start = position;
        for(let i = 1; i < colspan; i++) {
            let index = start + i*5;
            timetable[index] = {value: null};
        }
    }
    return {
        ...state,
        timetable: {
            ...state.timetable,
            data: {
                ...state.timetable.data,
                timetable
            }
        }
    }
}

function creator(state = initState(),action){
	const {type,data} = action;
	switch(type){
		case 'SET_TIMETABLE':
            return setTimeTable(state, data);
        case 'CLEAR_TIMETABLE':
            return clearTimeTable(state, data);
        case 'SWAP_MODULES':
            return swapModules(state, data);
        case 'UPDATE_MODULE': 
            return updateModule(state, data);
        case 'SET_TIMETABLE_COLOR': 
            return setTimeTableColor(state, data);
		case 'ADD_MODULE':
            return addModule(state, data);
		case 'TOGGLE_DRAGGING':
            return toggleDragging(state);
		case 'DELETE_MODULE':
            return deleteModule(state, data);
		default:
			return state
	}
}	

export default creator

