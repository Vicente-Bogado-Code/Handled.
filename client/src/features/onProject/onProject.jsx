import { setCurrentProject } from "../api/createRequest/setCurrentProject";
import { getSecondaryNotes } from "../api/getDataRequests/getSecNotes"
import { newSecondaryNote } from "../api/createRequest/newSecNote"
import { saveNoteContent } from "../api/alterRequests/saveNoteContent";
import { deleteSecNote } from "../api/deleteRequests/deleteSecNote";
import { useState, useEffect, useRef, use } from 'react';
//
import SecondaryProjectComp from "./ secNote";
import Window from "./window";
import TipTap from "./TipTap";
import Toolbar from "./toolBar";
import placeholder from "./placeholder";
import CounterToSave from "./savingIn";
import MainPlaceHolder from "./placeholder";
import NoteSettings from "./settings components/noteSettings";
//
import './css/onProject.css'
//
import { ArrowLeft,Plus,Minus,ChevronDown, ChevronRight, Undo2Icon } from 'lucide-react';

export default function CurrentProjectComp({ project_id , handleGoBack}) {
  const [editor,setEditor] = useState(null)
  const [projectName, setProjectName] = useState("");
  const [mySecNotes, setMySecNotes] = useState([]);
  const mySecNotesRef = useRef(mySecNotes)
  const [nameOfNewSnote, setNameOfSnote] = useState("");
  const [windows,setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null)
  const activeSnote = mySecNotes.find(note => note.id === activeWindowId);
  const activeSnoteId = activeSnote ? activeSnote.id : null;
  const currentNoteContent = activeSnote ? activeSnote.content : "";
  const currentNoteImportance = activeSnote ? activeSnote.importance : "";
  const currentNoteName = activeSnote ? activeSnote.name : "";
  const Snotes = mySecNotes.filter(note => note.importance === "S")
  const Dnotes = mySecNotes.filter(note => note.importance === "D")
  const Mnote =  mySecNotes.filter(note => note.importance === "M")
  const [title,setTitle] = useState("")
  const [isCreating,setIsCreating] = useState(false)
  const [isDeleting,setIsDeleting] = useState(false)
  const [modifiedNotesId,setModifiedNotesId] = useState([])
  const modifiedNotesIdRef = useRef(modifiedNotesId)
  const timerRef = useRef(null)
  const secondsRef = useRef(10)
  const [seconds, setSeconds] = useState(10)
  const [saving,setSaving] = useState(false)
  const [visualDnotes, setVisualDnotes] = useState(true)
  const [visualSnotes,setVisualSnotes] = useState(true)
  const [isOnNoteSettings, setIsOnNoteSettings] = useState(false)
  const [isDeletingNotes, setIsDeletingNotes] = useState(false)
  const [idsToBeDeleted, setIdsToBeDeleted] = useState([])
  const allNotesIds = mySecNotes.map(note => note.id)

  useEffect(() =>{
    mySecNotesRef.current = mySecNotes;
  }, [mySecNotes])
  useEffect(() =>{
    modifiedNotesIdRef.current = modifiedNotesId;
  }, [modifiedNotesId])

  useEffect(() => {
    setCurrentProject(project_id).then(response => {
      if (response.Status === "Current project set") {
        setProjectName(response.projectName);

        getSecondaryNotes().then(response => setMySecNotes(response.Snotes)); 
      }
    });
  }, [project_id]);

  //Content
  async function handleCreateSnote(name,content,imp){
    if (name === ""){return}
    const response = await newSecondaryNote(name,content,imp)
    if (response.Status === "Secondary note created")
    {
      setMySecNotes(prev => [...prev, response.Snote])
    }
  }
  //
  function startAutoSaveTimer(EveryXseconds){
    clearInterval(timerRef.current)
    secondsRef.current = 10;
    setSeconds(10)

    timerRef.current = setInterval(() =>{
      setSaving(true)
      secondsRef.current--;
      setSeconds(secondsRef.current)
      if (secondsRef.current === EveryXseconds){
        clearInterval(timerRef.current)
        console.log("Saved after ",EveryXseconds," seconds!")
        for (let i = 0; i < modifiedNotesIdRef.current.length; i++){
          const note = mySecNotesRef.current.find(n => n.id === modifiedNotesIdRef.current[i]);
          const noteC = note ? note.content : null
          handleSaveContent(note.id,noteC)
        }
        setModifiedNotesId([]);
        setSaving(false)
      }
    },1000)
    };
  
  function handleContentChange(newContent){
    const inIt = modifiedNotesId.find(id => id === activeSnoteId);
    if (inIt === undefined){
      setModifiedNotesId(prev => [...prev, activeSnoteId])
    }
    setMySecNotes(prev =>
      prev.map(note =>
        note.id === activeSnoteId ? {...note, content: newContent} : note
      )
    )
    startAutoSaveTimer(0)
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
  //Delete Snote
  async function handleDeleteSnote(idsToBeDeletedArray){
    clearInterval(timerRef.current)
    for (let i = 0; i < idsToBeDeletedArray.length; i++){
      const currentId = idsToBeDeletedArray[i]
      const response = await deleteSecNote(currentId)
      if (response.Status === "Note deleted"){
            setMySecNotes(prev => prev.filter(n => n.id !== currentId));
            setModifiedNotesId(prev => prev.filter(id => id !== currentId))
            setWindows(prev => prev.filter(w => w.id !== currentId));
            setActiveWindowId(null);
            startAutoSaveTimer(0)
    }

    }
  }
  

  return (
  <div className="mainDiv">
    <nav className="onProjectNav">
      <div className="goBackDiv">
        <button className="backBtnOnNav" onClick={() => {
        handleGoBack("");
        if (activeSnote){handleSaveContent(activeSnote.id,currentNoteContent);}
        }}><Undo2Icon size={18} />Go back</button>
      </div>
      <div className="titleDiv">
        <h3 className="titleOnNav">{projectName}</h3>
      </div>
      {Mnote.length > 0 ? <div className="mainNoteBtnDiv">
        <p className="mainNoteLabel">main note:</p>
        {Mnote.map(Mnote => <SecondaryProjectComp
         key={Mnote.id}
         importance={"M"}
         name={Mnote.name}
         noteId={Mnote.id}
         content={Mnote.content}
         windows={windows}
         setWindow={setWindows}
         activeWindowId={activeWindowId}
         setActiveWindowId={setActiveWindowId}
         modifiedNotesIds={modifiedNotesId}
         isOnSettings={isOnNoteSettings}
         setIsOnSettings={setIsOnNoteSettings}
         isDeletingNotes={isDeletingNotes}
         idsToBeDeleted={idsToBeDeleted}
         setIdsToBeDeleted={setIdsToBeDeleted}
         />)}
      </div> : null}
      <p className="mainNoteLabel">secondary note/s:</p>
      <div className="newSnoteForm">
         <button className="addNoteBtn" onClick={() => {isCreating === false ? setIsCreating(true) : setIsCreating(false)}}>{isCreating === true ? <Minus size={18}/> : <Plus size={18}/>}</button>
      </div>
      <div className={isCreating === true ? "newNoteFormDiv" : "hide"} >
          <p className="labelOnNewNote">Secondary note name</p> 
          <input type="text" placeholder="Note name? (max 20 characters)"
           maxLength={20} 
           value={nameOfNewSnote}
           onChange={e => setNameOfSnote(e.target.value)}
           className="noteNameInput"
           />
           <p className="labelOnNewNote">Title (optional)</p>
           <input type="text" placeholder={`${projectName}...`}
           value={title}
           onChange={e => setTitle(e.target.value)} 
           className="noteNameInput"
           />
           <button 
           className="createSnoteBtn"
           onClick={() => {handleCreateSnote(nameOfNewSnote,title,"S"); setTitle(""); setNameOfSnote("")}}
           >Add <Plus size={15}/></button>
      </div>

      <div className="secondaryNotesDiv">
        {Dnotes.length > 0 ? (<button className="DnotesBtn" onClick={() => { visualDnotes === false ? setVisualDnotes(true) : setVisualDnotes(false)}}>Default<span className={visualDnotes ? "CsetColor" : "CsetColorNonActive"}>{visualDnotes === true ? <ChevronDown size={22}/> : <ChevronRight size={22}/>}</span>{currentNoteImportance === "D" ? <p className="labelCrntNote">{currentNoteName}</p> : null}</button>) : null}
        <div className={visualDnotes === true ? null : "hide"}>
          {Dnotes.map(Dnote => <SecondaryProjectComp
          key={Dnote.id}
          importance={"D"}
          name={Dnote.name}
          noteId={Dnote.id}
          content={Dnote.content}
          windows={windows}
          setWindow={setWindows}
          activeWindowId={activeWindowId}
          setActiveWindowId={setActiveWindowId}
          modifiedNotesIds={modifiedNotesId}
          isOnSettings={isOnNoteSettings}
          setIsOnSettings={setIsOnNoteSettings}
          isDeletingNotes={isDeletingNotes}
          idsToBeDeleted={idsToBeDeleted}
          setIdsToBeDeleted={setIdsToBeDeleted}
         />)}
        </div>
        <div className="snotesDiv">
        <button className="DnotesBtn" onClick={() => { visualSnotes === false ? setVisualSnotes(true) : setVisualSnotes(false)}}>Created<span className={visualSnotes ? "CsetColor" : "CsetColorNonActive"}>{visualSnotes === true ? <ChevronDown size={22}/> : <ChevronRight size={22}/>}</span>{currentNoteImportance === "S" ? <p className="labelCrntNote">{currentNoteName}</p> : null}</button>
        <div className={visualSnotes === true ? null : "hide"}>
           {Snotes.map(Snote => <SecondaryProjectComp
           key={Snote.id}
           importance={"S"}
           name={Snote.name}
           noteId={Snote.id}
           content={Snote.content}
           windows={windows}
           setWindow={setWindows}
           activeWindowId={activeWindowId}
           setActiveWindowId={setActiveWindowId}
           modifiedNotesIds={modifiedNotesId}
           isOnSettings={isOnNoteSettings}
           setIsOnSettings={setIsOnNoteSettings}
           isDeletingNotes={isDeletingNotes}
           idsToBeDeleted={idsToBeDeleted}
           setIdsToBeDeleted={setIdsToBeDeleted}
         />)}
        </div>
      </div>
      </div>
    </nav>
    <main className="mainOnProject">
      {isOnNoteSettings ? <NoteSettings
       name={currentNoteName}
       id={activeSnoteId}
       importance={currentNoteImportance}
       setIsOnSettings={setIsOnNoteSettings}
       handleDeleteNote={handleDeleteSnote}
       setIsDeletingNotes={setIsDeletingNotes}
       idsToBeDeleted={idsToBeDeleted}
       setIdsToBeDeleted={setIdsToBeDeleted}
       allIds={allNotesIds}
       />
       : null} 
     <div className={isOnNoteSettings === true ? "hide" : (windows.length > 0 ? "navWindows" : "navWindowsOnPH")}>
      {windows.map(window => <Window 
      key={window.id}
      windowName={window.name}
      id={window.id}
      activeWindowId={activeWindowId}
      setActiveWindowId={setActiveWindowId}
      handleWindowClosing={handleWindowClosing}
      importance={window.importance}
      />)}
     </div>
     {!isOnNoteSettings ? <div className="currentWindowContentDiv">
      <CounterToSave 
      seconds={seconds}
      modifiedNotesId={modifiedNotesId}
      mySecNotesRef={mySecNotesRef}
      />
      <div className={activeSnoteId ? "toolBarDiv" : "hide"}>
          <Toolbar editor={editor} activeSnote={activeSnote ? activeSnote.id : null} currentContent={currentNoteContent}/>
      </div>
      <div className={activeSnoteId ? "windowContent" : "windowPH"}>
        {activeSnoteId ?
        <TipTap 
        currentContent={currentNoteContent}
        onContentChange={handleContentChange}
        activeSnote={activeSnote ? activeSnote.id : null}
        setEditor={setEditor}
        /> : <MainPlaceHolder/> }
      </div>

     </div> : null}
    </main>
  </div>
  );
}