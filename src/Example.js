import React from 'react';
import { connect } from 'http2';

///Stateful component
class Stateful extends React.Component {
   // initial state 
    state = {
        someVariable: false
    }
    render() {
        let variable = this.state.someVariable; // get state variable
        this.setState({someVariable: value}) // set state variable
        return(
            <p>test</p>
        )
    }
}

//Stateless component
function StateLess(props) {
    const{someVariable} = props;
    const [variable, setVariable] = useState('') // react hooks
    return(<p>test</p>)
}


//Component with firebase
class FirebaseComponent extends React.Component {
    doAction() {
        this.props.firebase.doSomething(); // do action from firebase HOC
    }
    render() {
        return(
            <p>test</p>
        )
    }
}
export default withFirebase(FirebaseComponent);


//Component connected to redux store
//Use this if we ever need access to the user
//or other stores
class ReduxComponent extends React.Component {
    render() {
        return(
            <p>test</p>
        )
    }
}
ReduxComponent.mapState = function toState(state){
    //state variable comes from the reducers and whatever
    //state they contain

    // this is the data we pass through props to our component
    return {
        user: state.user.data
    }
}
export default connect(ReduxComponent.mapState())(FirebaseComponent);




