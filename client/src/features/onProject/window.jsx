import { X, Circle, CircleDashed,CircleArrowDown } from 'lucide-react'

export default function Window({windowName, id, activeWindowId, setActiveWindowId,handleWindowClosing, modifiedWindowsid}){
    return(
        <div className={id === activeWindowId ? "windowActive" : "windowCSS"}>
            {id === activeWindowId ? <Circle size={13} color='orange' fill='orange'/> : null}
            <button
            className="windowLabelBtn"
            title={windowName}
            onClick={() =>  {setActiveWindowId(id);}}
            ><span className="windowLabelText">{windowName}</span></button>

            <button className="windowCloseBtn" onClick={
               (e) => {
                e.stopPropagation()
                handleWindowClosing(id);
               }}><X size={14} className='dltWinBtn'/></button>
        </div>
    );
}