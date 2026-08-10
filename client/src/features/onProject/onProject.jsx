import { setCurrentProject } from "../api/setCurrentProject";
import { useState, useEffect } from 'react';
import './css/onProject.css'

export default function CurrentProjectComp({ project_id , handleGoBack}) {
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    setCurrentProject(project_id).then(response => {
      if (response.Status === "Current project set") {
        setProjectName(response.projectName);
      }
    });
  }, [project_id]);

  return (
  <div className="mainDiv">
    <nav className="onProjectNav">
      <button className="backBtnOnNav" onClick={() => handleGoBack("")}>🠔 Go back</button>
      <div className="titleDiv">
        <h3 className="titleOnNav">{projectName}</h3>
      </div>
      <div className="mainNoteBtnDiv">
        <p className="mainNoteLabel">main note:</p>
        <button className="buttonOnNav">{projectName} main</button>
      </div>
      <p className="mainNoteLabel">secondary note/s:</p>
      <button className="addNoteBtn">+ ADD NOTE</button>
      <div className="secondaryNotesDiv">
        <p className="mainNoteLabel">default</p>
        <button className="secondaryNote">Commit history</button>
        <p className="mainNoteLabel">created</p>
        <button className="secondaryNote">Math bug</button>
      </div>
    </nav>
    <main className="mainOnProject">
     <div className="navWindows">
      <button className="windowCSS">Math bug</button>
      <button className="windowCSS">Commit history</button>
      <button className="windowActive">Anwar's game of life main</button>
     </div>
     <div className="currentWindowContentDiv"> 
      <div className="windowContent"></div>
     </div>
    </main>
  </div>
  );
}