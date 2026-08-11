import { setCurrentProject } from "../api/setCurrentProject";
import { useState, useEffect } from 'react';
import { getSecondaryNotes } from "../api/getSecNotes"
import { newSecondaryNote } from "../api/newSecNote"
import { saveNoteContent } from "../api/saveNoteContent";
import SecondaryProjectComp from "./ secNote";
import './css/onProject.css'

export default function CurrentProjectComp({ project_id , handleGoBack}) {
  const [projectName, setProjectName] = useState("");
  const [mySecNotes, setMySecNotes] = useState([]);
  const [nameOfNewSnote, setNameOfSnote] = useState("");
  const [currentSnoteId, setCurrentSnoteId] = useState(0);
  const [currentNoteContent, setCurrentNoteContent] = useState("");

  useEffect(() => {
    setCurrentProject(project_id).then(response => {
      if (response.Status === "Current project set") {
        setProjectName(response.projectName);

        getSecondaryNotes().then(response => setMySecNotes(response.Snotes)); 
      }
    });
  }, [project_id]);
  

  async function handleCreateSnote(name,content){
    const response = await newSecondaryNote(name,content)
    if (response.Status === "Secondary note created")
    {
      setMySecNotes(prev => [...prev, response.Snote])
    }
  }
  async function handleSaveContent(Snote_id,content) {
    const response = await saveNoteContent(Snote_id,content)    
  }


  return (
  <div className="mainDiv">
    <nav className="onProjectNav">
      <button className="backBtnOnNav" onClick={() => {handleGoBack(""), handleSaveContent(currentSnoteId,currentNoteContent)}}>🠔 Go back</button>
      <div className="titleDiv">
        <h3 className="titleOnNav">{projectName}</h3>
      </div>
      <div className="mainNoteBtnDiv">
        <p className="mainNoteLabel">main note:</p>
        <button className="buttonOnNav">{projectName} main</button>
      </div>
      <div className="newSnoteForm">
         <p className="mainNoteLabel">secondary note/s:</p>
         <input type="text" placeholder="Note name? (max 20 characters)" maxLength={20}  className="noteNameInput"
         value={nameOfNewSnote}
         onChange={e => setNameOfSnote(e.target.value)}
         />
         <button className="addNoteBtn" onClick={() => handleCreateSnote(nameOfNewSnote,null)}>+ ADD NOTE</button>
      </div>

      <div className="secondaryNotesDiv">
        <p className="mainNoteLabel">default</p>
        <button className="secondaryNote">Commit history</button>
        <p className="mainNoteLabel">created</p>
        {mySecNotes.map(Snote => <SecondaryProjectComp key={Snote.id} name={Snote.name} setNoteId={setCurrentSnoteId} noteId={Snote.id} content={Snote.content} setContentValue={setCurrentNoteContent}/>)}
      </div>
    </nav>
    <main className="mainOnProject">
     <div className="navWindows">

     </div>
     <div className="currentWindowContentDiv">

      <div className="windowContent">
        <textarea className="testTextArea" value={currentNoteContent} onChange={c => setCurrentNoteContent(c.target.value)}></textarea>
      </div>

     </div>
    </main>
  </div>
  );
}