import React from 'react'
import {Link} from 'react-router-dom';
import "./Notes.css"

  class Notes extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			notesArr: [],
			noteID: 0,
			selectedNote: 0,
			heading: '',
		}
	}

	notesAdder = () => {
		var note = this.state.notesArr
		var newNote = {id: this.state.noteID, heading: '', content: ''}
		note.push(newNote)
		this.setState({
			notesArr: note,
			noteID: this.state.noteID+1,
			heading:'',
			content:'',
			selectedNote: 0,
			noteClicked: false,
		})
	}
	
	displayNotes = () => {
		if(this.state.notesArr.length !=0) {
			return (
				this.state.notesArr.map((note, index) => 
					<button key={index} className='noteBarStyle' onClick={() => this.findChosenNote(index)}>
						{note.heading == '' ? 'Note'+(index+1) : note.title}
					</button>
				)
			)
		}
	}
	
	findChosenNote = (index) => {
		this.setState({
			selectedNote: index,
			noteClicked: true,
		})
	}
	
	displayTextarea = () => {
		if(this.state.noteClicked) {
			return ( 
				<div className='textareaStyle'>
					<form onSubmit={this.handleSubmit}>
						<label>
							Heading:
							<input type="text" value={this.state.heading} onChange={this.handleChangeHeading} />
						</label>
							<input type="text" value={this.state.content} onChange={this.handleChange} />
						<input type="submit" value="Submit" />
					</form>
				</div>
			)
		}
	}
	
	handleChangeHeading = (event) => {
		this.setState({heading: event.target.value});
	}
	
	handleSubmit = (event) => {
		console.log('HERE')
		var note = this.state.notesArr
		note[this.state.selectedNote].heading = this.state.heading;
		event.preventDefault();
	}
	
  render() {
    return (
        <div>
			<div className = "bar">
				<button className='addNotesBtn' onClick={this.notesAdder}>+ Add Button</button>
				{this.displayNotes()}
			</div>
			{this.displayTextarea()}
			
        </div>
    )
  } 
 }
 
  
  export function SideBarNotes(props) {
	return <div className = "side-bar1">
            <Link to = "./notes">
            <li>Notes1</li>
			</Link>
			<Link to = "Map">
			<li>Notes2</li>
            </Link>
			<Link to = "Notes">
			<li>Notes3</li>
            </Link>
			<Link to = "Assignments">
			<li>Assignments</li>
            </Link>
            </div>
  }

  
export default Notes;