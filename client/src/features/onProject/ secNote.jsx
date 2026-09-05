import './css/onProject.css'
import './css/notesBtn.css'
import { Trash2, Circle,ClockArrowDown, Settings2, Check, CircleArrowDown, File, ClockFading,FileText} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SecondaryProjectComp({importance,name,noteId,content,windows,setWindow,activeWindowId,setActiveWindowId,modifiedNotesIds,isOnSettings, setIsOnSettings,isDeletingNotes,idsToBeDeleted,setIdsToBeDeleted,projectWanstAutoSave, wantsAutoSave,setIsOnProjectSettings,setDraggedNote,setDraggedNoteName}){
    wantsAutoSave = projectWanstAutoSave ? wantsAutoSave : false
    const inIt = modifiedNotesIds.find(id => id === noteId);
    const willBeDeleted = idsToBeDeleted.find(id => id === noteId)
    return(
    <div className="secNoteOnNavDiv">
        <button
        draggable
        onDragStart={() => {
            setDraggedNote(noteId); 
            if (!windows.find(window => window.id === noteId)){setDraggedNoteName(name)}
            else {setDraggedNoteName(null)}
        }}
        className={!willBeDeleted ? (!isDeletingNotes ? (activeWindowId === noteId ? "activeSnote" : (inIt ? "secondaryNoteUnsaved" : "secondaryNote")) : "deletingNotes") : "willBeDeletedClass" } onClick={
        () => {
            setIsOnProjectSettings(false)
            {if (!isOnSettings && !isDeletingNotes) {const alreadyExists = windows.find(window => window.id === noteId)
                if (!alreadyExists){
                    setWindow(prev => [...prev, {"id":noteId,"name":name}]);
                }
            }}
            if (!isDeletingNotes){setActiveWindowId(noteId);}
            if (isDeletingNotes){
                const willAlreadybeDeleted = idsToBeDeleted.find(id => id === noteId);
                if (!willAlreadybeDeleted){
                    setIdsToBeDeleted(prev => [...prev, noteId])
                    return
                } else{
                   const newArray = idsToBeDeleted.filter(id => id !== noteId)
                   setIdsToBeDeleted(newArray) 
                }
            }
        }}>
        <span className='Slabel'>txt</span>
         <span className="noteNameOnNav" title={name}>{name}</span>
                    {!isDeletingNotes ? <div className='statusSettings'>
                        <Circle className='savedLabel' size={10} fill='currentColor'/> 
                        {wantsAutoSave ? <ClockArrowDown style={{color:"green"}} size={15}/> : null}
                    {activeWindowId === noteId ? <div className='settingsBtn' onClick={(e) =>{
                        setActiveWindowId(noteId)
                        setIsOnSettings(!isOnSettings);
                        setIsOnProjectSettings(false);
                        e.stopPropagation();
                    }}>
                    <Settings2 size={15}/>
                    </div> : null}
                    </div> : <div className='addToBeDeletedbtn'> {willBeDeleted ? <Check size={16}/> : <Trash2 size={16}/> }</div>}
            </button>
          </div>
    );
}