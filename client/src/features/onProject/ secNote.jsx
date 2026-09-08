import './css/onProject.css'
import './css/notesBtn.css'
import { Trash2, Circle,ClockArrowDown, Settings2, Check, CircleArrowDown, File, ClockFading,FileText, StarCheckIcon, FlagIcon, BookmarkIcon, StarIcon, Settings} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SecondaryProjectComp({importance,name,noteId,content,windows,setWindow,activeWindowId,setActiveWindowId,modifiedNotesIds,isOnSettings, setIsOnSettings,isDeletingNotes,idsToBeDeleted,setIdsToBeDeleted,projectWanstAutoSave, wantsAutoSave,setIsOnProjectSettings,setDraggedNote,setDraggedNoteName,power,important,handleChangeImportant}){
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
        <div className='txtNimpDiv'>
            {activeWindowId === noteId && !important ? <StarIcon size={14} onClick={() => handleChangeImportant(noteId,true)}/> : null}
            {important ? <StarIcon fill='currentColor' onClick={() => handleChangeImportant(noteId,false)} size={14}/> : null}
            <span className='Slabel'>txt</span>
        </div>
        
         <span className="noteNameOnNav" title={name}>{name}</span>
                    {!isDeletingNotes ? <div className='statusSettings'>
                        <Circle className='savedLabel' size={10} fill='currentColor'/> 
                        {power === "owner" ? (wantsAutoSave ? <ClockArrowDown style={{color:"green"}} size={15}/> : null) : null}
                    {activeWindowId === noteId ? <div className='settingsBtn' onClick={(e) =>{
                        setActiveWindowId(noteId)
                        setIsOnSettings(!isOnSettings);
                        setIsOnProjectSettings(false);
                        e.stopPropagation();
                    }}>
                    {power === "owner" ? <Settings size={15}/> : null}
                    </div> : null}
                    </div> : <div className='addToBeDeletedbtn'> {willBeDeleted ? <Check size={16}/> : <Trash2 size={16}/> }</div>}
            </button>
          </div>
    );
}