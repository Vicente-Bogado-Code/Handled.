import './css/onProject.css'

export default function SecondaryProjectComp({name, noteId, setNoteId,content, setContentValue}){
    return(
        <button className="secondaryNote" onClick={() => {setNoteId(noteId),setContentValue(content)}} >{name}</button>
    );
}