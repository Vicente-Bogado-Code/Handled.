import './css/onProject.css'
import './css/notesBtn.css'

export default function SecondaryProjectComp({importance,name,noteId,content,windows,setWindow,activeWindowId,setActiveWindowId}){
    return(
        <button
        className={activeWindowId === noteId ? "activeSnote" : "secondaryNote"} onClick={
        () => {
            {const alreadyExists = windows.find(window => window.id === noteId)
                if (!alreadyExists){
                    setWindow(prev => [...prev, {"id":noteId,"name":name}]);
                }
            }
            setActiveWindowId(noteId);
        }}>
        <span className='Slabel'>{importance}</span> {name} </button>
    );
}