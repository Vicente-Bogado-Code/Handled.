export default function CounterToSave({seconds,modifiedNotesId,mySecNotesRef}){
    const arrayOfNames = [];
    for (let i = 0; i < modifiedNotesId.length; i++){
        const note = mySecNotesRef.current.find(wholeNote => wholeNote.id === modifiedNotesId[i]);
        const noteN = note.name;
        arrayOfNames.push(`${noteN}, `)
    }
    return(
        <div className="counterMainDiv">
            {arrayOfNames.length === 0 ? null : 
            <p className="autoSavingText">
                Automatically saving [<span className="namesOnSavingArray">{arrayOfNames}</span>] in {seconds}s</p>}
        </div>
    );
}