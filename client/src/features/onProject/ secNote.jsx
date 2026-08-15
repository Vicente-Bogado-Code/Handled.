import './css/onProject.css'
import './css/notesBtn.css'
import { Trash2 } from 'lucide-react';

export default function SecondaryProjectComp({importance,name,noteId,content,windows,setWindow,activeWindowId,setActiveWindowId,setDeleting,modifiedNotesIds}){
    const inIt = modifiedNotesIds.find(id => id === noteId);
    return(
    <div className="secNoteOnNavDiv">
        <button
        className={activeWindowId === noteId ? "activeSnote" : (inIt ? "secondaryNoteUnsaved" : "secondaryNote")} onClick={
        () => {
            {const alreadyExists = windows.find(window => window.id === noteId)
                if (!alreadyExists){
                    setWindow(prev => [...prev, {"id":noteId,"name":name}]);
                }
            }
            setActiveWindowId(noteId);
        }}>
        <span className='Slabel'>{importance}</span> {name} </button>
        {activeWindowId === noteId ? (importance === "S" ? <button className='deleteBtn' onClick={() => setDeleting(true)}><Trash2 size={16} /></button> : null ) : null}
    </div>
    );
}