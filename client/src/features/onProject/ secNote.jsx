import './css/onProject.css'
import './css/notesBtn.css'
import { Trash2, Circle,ClockArrowDown, Settings2, Check} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SecondaryProjectComp({importance,name,noteId,content,windows,setWindow,activeWindowId,setActiveWindowId,modifiedNotesIds,isOnSettings, setIsOnSettings,isDeletingNotes,idsToBeDeleted,setIdsToBeDeleted, wantsAutoSave}){
    const inIt = modifiedNotesIds.find(id => id === noteId);
    const willBeDeleted = idsToBeDeleted.find(id => id === noteId)
    return(
    <div className="secNoteOnNavDiv">
        <button
        className={!willBeDeleted ? (!isDeletingNotes ? (activeWindowId === noteId ? "activeSnote" : (inIt ? "secondaryNoteUnsaved" : "secondaryNote")) : "deletingNotes") : "willBeDeletedClass" } onClick={
        () => {
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
        <span className='Slabel'>{importance}</span>
         <span style={{width:"fit-content"}}>{name}</span>
                    {!isDeletingNotes ? <div className='statusSettings'>
                        <Circle className='savedLabel' size={10} fill='currentColor'/> 
                        {wantsAutoSave ? <ClockArrowDown style={{color:"greenyellow"}} size={15}/> : <ClockArrowDown style={{color:"red"}} size={15}/>}
                    {activeWindowId === noteId ? <button className='settingsBtn' onClick={(e) =>{
                        setActiveWindowId(noteId)
                        setIsOnSettings(!isOnSettings);
                        e.stopPropagation();
                    }}>
                    <Settings2 size={15}/>
                    </button> : null}
                    </div> : <button className='addToBeDeletedbtn' onClick={() => setWillBeDeleted(!willBeDeleted)}> {willBeDeleted ? <Check size={16}/> : <Trash2 size={16}/> }</button>}
            </button>
          </div>
    );
}