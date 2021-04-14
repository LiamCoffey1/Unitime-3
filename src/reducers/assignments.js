
function initState(){ //INITIAL DATA
	const state = { 
        assignments: []
	}
	return state;
}

function setAssignments(state, data) { 
	return {...state, assignments: data.assignments};
}

//needed for deleting
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

//add new assigment with values and random uuid
function addAssignments(state, data){
	let assignments= state.assignments
	assignments.push({...data, id: uuidv4()})
	return {...state, assignments}
}

//delete by uuid
function deleteAssignment(state, data){
	let assignments = state.assignments.filter(value => {
		return value.id !== data.id;
	})
	return {...state, assignments}
}

function creator(state = initState(),action){
	const {type,data} = action;
	switch(type){
		case 'SET_ASSIGNMENTS':
			return setAssignments(state, data);
		case 'DELETE_ASSIGNMENT':
			return deleteAssignment(state, data);
		case 'ADD_ASSIGNMENTS':
            return addAssignments(state, data);
		default:
			return state
	}
}	



export default creator

