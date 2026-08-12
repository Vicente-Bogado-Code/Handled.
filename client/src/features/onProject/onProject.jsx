import { setCurrentProject } from "../api/setCurrentProject";
import { useState, useEffect } from 'react';
import { getSecondaryNotes } from "../api/getSecNotes"
import { newSecondaryNote } from "../api/newSecNote"
import { saveNoteContent } from "../api/saveNoteContent";
import SecondaryProjectComp from "./ secNote";
import Window from "./window";
import './css/onProject.css'

export default function CurrentProjectComp({ project_id , handleGoBack}) {
  const [projectName, setProjectName] = useState("");
  const [mySecNotes, setMySecNotes] = useState([]);
  const [nameOfNewSnote, setNameOfSnote] = useState("");
  const [currentSnoteId, setCurrentSnoteId] = useState(0);
  const [windows,setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null)
  const activeSnote = mySecNotes.find(note => note.id === activeWindowId);
  const currentNoteContent = activeSnote ? activeSnote.content : "";

  useEffect(() => {
    setCurrentProject(project_id).then(response => {
      if (response.Status === "Current project set") {
        setProjectName(response.projectName);

        getSecondaryNotes().then(response => setMySecNotes(response.Snotes)); 
      }
    });
  }, [project_id]);

  //Content
  async function handleCreateSnote(name,content){
    const response = await newSecondaryNote(name,content)
    if (response.Status === "Secondary note created")
    {
      setMySecNotes(prev => [...prev, response.Snote])
    }
  }
  function handleContentChange(newContent){
    setMySecNotes(prev =>
      prev.map(note =>
        note.id === activeWindowId ? {...note, content: newContent} : note
      )
    )
  }
  async function handleSaveContent(Snote_id,content) {
    const response = await saveNoteContent(Snote_id,content)    
  }

  //Close window
  function handleWindowClosing(clickedWindowId){
    if (clickedWindowId === activeWindowId){
      setActiveWindowId(null)
    }
    setWindows(prev => prev.filter(window => window.id !== clickedWindowId));
  }
  
  

  return (
  <div className="mainDiv">
    <nav className="onProjectNav">
      <button className="backBtnOnNav" onClick={() => {handleGoBack(""), handleSaveContent(activeSnote.id,currentNoteContent)}}>🠔 Go back</button>
      <div className="titleDiv">
        <h3 className="titleOnNav">{projectName}</h3>
      </div>
      <div className="mainNoteBtnDiv">
        <p className="mainNoteLabel">main note:</p>
        <button className="buttonOnNav"> <span className="Slabel">M</span> {projectName}</button>
      </div>
      <p className="mainNoteLabel">secondary note/s:</p>
      <div className="newSnoteForm">
         <input type="text" placeholder="Note name? (max 20 characters)" maxLength={20}  className="noteNameInput"
         value={nameOfNewSnote}
         onChange={e => setNameOfSnote(e.target.value)}
         />
         <button className="addNoteBtn" onClick={() => handleCreateSnote(nameOfNewSnote,null)}>+ ADD NOTE</button>
      </div>

      <div className="secondaryNotesDiv">
        <p className="mainNoteLabel">default</p>
        <button className="secondaryNote"><span className="Slabel">D</span>Commit history</button>
        <p className="mainNoteLabel">created</p>
        {mySecNotes.map(Snote => <SecondaryProjectComp
         key={Snote.id}
         importance={"S"}
         name={Snote.name}
         noteId={Snote.id}
         content={Snote.content}
         windows={windows}
         setWindow={setWindows}
         activeWindowId={activeWindowId}
         setActiveWindowId={setActiveWindowId}/>)}
      </div>
    </nav>
    <main className="mainOnProject">
     <div className="navWindows">
      {windows.map(window => <Window 
      key={window.id}
      windowName={window.name}
      id={window.id}
      activeWindowId={activeWindowId}
      setActiveWindowId={setActiveWindowId}
      handleWindowClosing={handleWindowClosing}
      />)}
     </div>
     <div className="currentWindowContentDiv">

      <div className="windowContent">
        <textarea
         className="testTextArea"
         value={currentNoteContent}
         onChange={change => handleContentChange(change.target.value)}
           ></textarea>
      </div>

     </div>
    </main>
  </div>
  );
}