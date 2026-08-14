import { X } from 'lucide-react'

export default function Window({windowName, id, activeWindowId, setActiveWindowId,handleWindowClosing}){
    return(
        <div className={id === activeWindowId ? "windowActive" : "windowCSS"}>
            <button 
            onClick={() =>  {setActiveWindowId(id);}}
            >{windowName}</button>
             
            <button onClick={
               (e) => {
                e.stopPropagation()
                handleWindowClosing(id);
               }}><X size={16} className='dltWinBtn'/></button>
        </div>
    );
}