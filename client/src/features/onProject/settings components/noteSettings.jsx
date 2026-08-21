import { useState } from 'react';
import './noteSettings.css'
import { Trash, Edit2, Undo2, Check, Save, Info } from 'lucide-react';
import { deleteSecNote } from '../../api/deleteRequests/deleteSecNote';

export default function NoteSettings({name,id,importance,setIsOnSettings, handleDeleteNote, setIsDeletingNotes, idsToBeDeleted, setIdsToBeDeleted, allIds}){
    const [newName, setNewName] = useState(name)
    const [isDeleting, setIsDeleting] = useState(false)
    const [savedName,setSavedName] = useState(false)
    return(
        <div className="noteSettingsDiv">
            <div className="labelOnNoteSettings">
                <div className="noteSettingsTitleDiv">
                    <p className="idLbl">Note id: {id}</p>
                    <h2 className="titleLlbl">{name}</h2>
                </div>
                <div className="noteTypeDiv">
                    <p className="typeLbl">Type</p>
                    <span className="toAccentNoteSettings">{importance}</span>
                </div>
            </div>

            <div className="changeDataDiv">
                <div className='inputDiv'>
                    <label className='inputLabel'>Change name</label>
                    <div className='inputNicon'>
                        <Edit2 size={16}/>
                        <input type="text" maxLength={20} className='changeNameInput' value={newName}
                        onChange={(e) => {setNewName(e.target.value); setSavedName(false)}}
                        />
                        <button className='saveNotebtn'
                         onClick={() => {
                         setSavedName(true);
                        }}>
                            {savedName ? <Check size={16}/> : <Save size={16}/>}
                        </button>
                    </div>
                </div>
                {!isDeleting ? <button className="deleteNoteBtn" onClick={() => {setIsDeleting(true);
                    setIsDeletingNotes(true);
                    setIdsToBeDeleted(prev => [...prev, id])
                }}> <Trash size={16}/>Delete note/s</button> :
                <div className='deleteOrNotNoteSettings'> 
                    <button className='fireDeleteFuncBtn' onClick={() => {
                        handleDeleteNote(idsToBeDeleted);
                        setIsOnSettings(false)
                        setIsDeleting(false);
                        setIdsToBeDeleted([])
                    }}>Yes, delete</button>
                    <button onClick={() => {setIsDeleting(false); setIsDeletingNotes(false); setIdsToBeDeleted([])}} className='dontFireDeletebtn'>No, go back</button>
                </div>
                }
               {idsToBeDeleted.length > 0 ? <p className='currentlyDeletingNumber'><Info size={16}/>Currently deleting {idsToBeDeleted.length} notes</p> : null}
                {isDeleting ? 
                <div className='selectFiltersDiv'>
                    <button className='selectAllbtn' onClick={() =>{
                        for (let i = 0; i < allIds.length; i++){
                            const id = allIds[i]
                            setIdsToBeDeleted(prev => [...prev, id])
                        }
                    }}>select all</button>
                    <button className='selectNonebtn' onClick={() => setIdsToBeDeleted([])}>select none</button>
                </div> : null}
                <button onClick={() => {setIsOnSettings(false); setIsDeletingNotes(false); setIdsToBeDeleted([]);}} className="exitBtn"> <Undo2 size={16}/>Go back to project</button>
            </div>
        </div>
    );
}