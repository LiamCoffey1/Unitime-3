

import React from 'react';
import {Form} from 'react-bootstrap';
import { ChromePicker } from 'react-color';
export default class ColorPicker extends React.Component {
    state = {
        showPicker: false
    }
    constructor(props){
        super(props);
        this.ref = React.createRef();
    }
    renderColorTTBox(color) {
        return <span onClick = {e=>this.toggleTTColor()} style = {{color}} className = "fa fa-square colorBox"/>
    }
    toggleTTColor(){
        if(!this.state.showPicker && this.ref) {
            this.setState({showPicker: !this.state.showPicker})
				setTimeout(() => {
					this.ref.current.focus();
				}, 100);
		}	
    }
    onBlur = () => {
		setTimeout(() => {
			this.setState({showPicker: false});
		}, 200);
	}
    render() {
        let {color, title} = this.props;
        return <div>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label style = {{width: '100%'}}>{title}</Form.Label>
                {this.renderColorTTBox(color)}
            </Form.Group>
                {this.state.showPicker && <div style = {{transform: 'translateY(-100px)'}} tabIndex="0" ref = {this.ref} onBlur = {this.onBlur} ><ChromePicker className = "absolute" color = {color} onChangeComplete={ color => {
                       this.props.onColorChange(color.hex);
                } }/></div>}
            </div>
    }
}