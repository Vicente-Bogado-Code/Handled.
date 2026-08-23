import { CircleArrowDown,ClockArrowDown } from "lucide-react"
import { useEffect } from "react"
export default function CounterToSave({seconds,modifiedNotesId,mySecNotesRef,autoSave, handleSaveContent, currentSnoteId,currentSnoteContent,handleSaveNow}){
    useEffect(() => {
        function handleKeyDown(e){
            if ((e.ctrlKey || e.metaKey) && e.key === "s"){
                e.preventDefault()
                handleSaveContent(currentSnoteId,currentSnoteContent)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleSaveContent, currentSnoteId, currentSnoteContent])
    const arrayOfNames = [];
    for (let i = 0; i < modifiedNotesId.length; i++){
    const note = mySecNotesRef.current.find(wholeNote => wholeNote.id === modifiedNotesId[i]);
    if (!note.auto_save) continue;
    const noteN = note.name;
    arrayOfNames.push(`${noteN}, `)
}
    return(
        <div className="counterMainDiv">
            {arrayOfNames.length === 0 ? null : 
            (autoSave ? <div>
            <p className="autoSavingText">
                Automatically saving 
                [ <span className="namesOnSavingArray">{arrayOfNames.length}</span> ]
                 files in {seconds}s </p>
            </div> : null)}

           {arrayOfNames.length > 0 && autoSave? <div className="saveOrCancelNowDiv">
                <button className="saveNowBtn" onClick={handleSaveNow}>Save now</button>
            </div> :
            <div className="allSavedAutoSonDivLbl"> 
               {modifiedNotesId.length === 0 ? <p className="labelOnSavignIn">Files saved<CircleArrowDown size={18} color="greenYellow"/></p> :
               <p className="labelOnSavignIn">Unsaved changes<CircleArrowDown size={18} style={{color:"red"}}/></p>}
                {autoSave ? <p className="labelOnSavignIn">Auto save ON<ClockArrowDown size={18} color="greenYellow"/></p> :
                <p className="labelOnSavignIn">Auto save OFF<ClockArrowDown size={18} style={{color:"red"}}/> <label className="cntlSlabelhelp">(<span className="toAccent">ctrl + s </span>to save current note)</label> </p> 
                }
            </div>
            }
        </div>
    );
}