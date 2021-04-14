//USER REDUCER ON LOGIN WE WILL STORE USER DATA HERE SO WE CAN RETRIEVE EASILY

function initState(){ //INITIAL USER DATA
	let user = null
	try{
		user = JSON.parse(localStorage.authUser).user; //GET IF USER DATA IN LOCALSTORAGE
	}catch(e){}
	const state = { // Will be passed to props as user
		data: user // Will be passed to props as user.data
	}
	return state;
}

// Used for updating the user completely overrides
// current user data with data provided
function setUser(state, data) { 
    let userState = {
		data: {
			...data.user //Override user.data with data from dispatch data
		}
	};
	return userState;
}

function updateUser(state, data) {
	let user = state.data;
	let newState = {
		data: {
			...user,
			...data
		}
	}
	localStorage.setItem('authUser', JSON.stringify({user:{...newState.data}}));
	return newState;
}

// Used when a user logs out setting user data to null
function removeUser(state, data) { 
    let userState = {
		data: null // set user data to null aka. logged out
	};
	return userState;
}

// NOTE: on any dispatch to any reducer it will check all
// reducers for a certain action
function userState(state = initState(),action){
	//Deconstructor takes values type: Action type 
	//and data wich serves as payload parameter for reducer
	const {type,data} = action;
	switch(type){ //Switch table jumps to action provided
		case 'SET_USER':
			return setUser(state, data);
		case 'UPDATE_USER':
			return updateUser(state, data);
		case 'REMOVE_USER':
			return removeUser(state); // no data needed as we will just set to null
		default:
			return state // Do nothing if action is non-existent
	}
}	

export default userState

