
export default function Window({windowName, id, activeWindowId, setActiveWindowId,handleWindowClosing}){
    return(
        <div className="windowBtnDiv">
            <button 
            className={id === activeWindowId ? "windowActive" : "windowCSS"}
            onClick={() => 
                {
                 setActiveWindowId(id);
                }
            }
            
            >{windowName} <button className='deleteWindow' onClick={
               (e) => {
                e.stopPropagation()
                handleWindowClosing(id);
               }}>x</button></button>
        </div>
    );
}