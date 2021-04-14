import React from 'react'
import "./Modal.css"

export function InfoModal(props) {
    const { title, onClose, children } = props;
    return <div className="infoModal">
        <div className="background">
            {title && <h1 className="title">{title}</h1>}
            <span onClick={onClose} className="close-times fa fa-times"></span>
            {children}
            <button onClick={onClose} style={{ float: 'right' }} className="btn btn-outline-primary">Close</button>
        </div>
    </div>
}

export function LoadingModal(props) {
    const { text } = props;
    return <div className="loadingModal">
        <div className="background">
            <div style = {{textAlign: 'center'}}>
                <span className = "fas fa-cog fa-spin"/>
                <h1 className="text">{text}</h1>
            </div>
        </div>
    </div>
}

export class ActionModal extends React.Component {
    render() {
        return <div className="actionModal">
            <div className="background">
                <h1>{this.props.title}</h1>
                <span onClick={this.props.onClose} className="close-times fa fa-times"></span>
                {this.props.children}
                <div className="bottomBar">
                    <button onClick={this.props.onClose} style={{ float: 'left' }} className="btn btn-outline-primary">Cancel</button>
                    <button onClick={this.props.onAction} className="btn btn-primary" style={{ float: 'right', width: '160px', marginBottom: '30px' }}>{this.props.actionText}</button>
                </div>

            </div>
        </div>
    }
}

export class WarningModal extends React.Component {
    render() {
        return <div className="warningModal">
            <div className="background">
                <h1>{this.props.title}</h1>
                <span onClick={this.props.onClose} className="close-times fa fa-times"></span>
                {this.props.children}
                <button onClick={this.props.onContinue} className="btn btn-primary" style={{ float: 'right', width: '160px', marginTop: '30px' }}>Continue</button>
                <button onClick={this.props.onClose} style={{ float: 'left', marginTop: '30px' }} className="btn btn-outline-primary">Go back</button>
            </div>
        </div>
    }
}