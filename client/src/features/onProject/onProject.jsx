import './css/onProject.css'
import { setCurrentProject } from "../api/createRequest/setCurrentProject";
import { getSecondaryNotes } from "../api/getDataRequests/getSecNotes"
import { newSecondaryNote } from "../api/createRequest/newSecNote"
import { saveNoteContent } from "../api/alterRequests/saveNoteContent";
import { deleteSecNote } from "../api/deleteRequests/deleteSecNote";
import { changeNoteName } from "../api/alterRequests/changeNoteName";
import { changeAutoSave } from "../api/alterRequests/changeSpecNoteAutoSave";
import { getMyProjects } from "../api/getDataRequests/getMyProjects";
import { changeStatus } from "../api/alterRequests/changeStatus";
import { changeGhRepo } from "../api/alterRequests/alterOther";
import { deleteProject } from "../api/deleteRequests/deleteProject";
import { changeProjectDesc } from "../api/alterRequests/changeDescName";
import { changeProjectName } from "../api/alterRequests/changeDescName";
import { useState, useEffect, useRef } from 'react';
import { getProjectPreferences } from "../api/getDataRequests/getProjectPreferences";
import { changeProjectPreferences } from "../api/alterRequests/changeProjectPreferences";
import { getLinkedRepositoryData } from "../api/third-party-APIs/github_api";
import SecondaryProjectComp from "./ secNote";
import Window from "./window";
import TipTap from "./TipTap";
import Toolbar from "./toolBar";
import placeholder from "./placeholder";
import CounterToSave from "./savingIn";
import MainPlaceHolder from "./placeholder";
import NoteSettings from "./settings components/noteSettings";
import ProjectSettings from "./settings components/projectSettings";
import ChooseRepository from "./github-components/repoChoice";
import { ArrowLeft,Plus,Minus,ChevronDown, ChevronRight, Undo2Icon, SettingsIcon, ClockArrowDown,FilePlus, Pause, CircleArrowDown,X, TriangleAlert, Eye, Bell } from 'lucide-react';
import { Color } from "@tiptap/extension-text-style";

export default function CurrentProjectComp({ project_id , handleGoBack, repositoriesFound}) {
  const recievedAlmostDone = localStorage.getItem(`${project_id}recievedAlmostDone`) || localStorage.setItem(`${project_id}recievedAlmostDone`, false)
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
  const currentSnoteWantsSave = activeSnote ? activeSnote.auto_save : "";
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
  const allNotesNames = mySecNotes.map(note => note.name.toLowerCase())
  const [isOnProjectSettings, setIsOnProjectSettings] = useState(false)
  const [projectDesc, setProjectDesc] = useState("")
  const [projectRepo, setProjectRepo] = useState("")
  const [projectStatus, setProjectStatus] = useState("")
  const [projectDate, setProjectDate] = useState("")
  const [hasMainNote, setHasMainNote] = useState(null)
  const [hasReadmeNote, setHasReadmeNote] = useState(null)
  const [hasTrackCommitHistory, setHasTrackCommitHistory] = useState(null)
  const [hasIsPublic,setHasIsPublic] = useState(null)
  const [hasAutoSave, setHasAutoSave] = useState(null)
  const [autoSaveInterval, setAutoSaveInterval] = useState(null)
  const [hasTheme, setHasTheme] = useState(null)
  const [someCntChanged, setSomeContentChanged] = useState(false)
  const [wantsCounterToSave, setWantsCounterToSave] = useState(true)
  const [noteReferencer, setNoteReferencer] = useState(false)
  const [noteReferecerString, setNoteReferecerString] = useState("")
  const [wantsNotifications,setWantsNotifications] = useState(true)
  const avChainMethods = ["->","@>"]
  const avChainUses = ["ref","refLine"]
  const [hasRepoLinked,setHasRepoLinked] = useState(false)
  const [lrName, setLrName] = useState(null) //lr = linked repository
  const [fullLrName, setFullLrName] = useState(null)
  const [defaultBranch, setDefaultBranc] = useState(null)
  useEffect(() =>{
        async function setRepoId(params) {
           const r = await getLinkedRepositoryData();
            if(r.Status === "Repository id retrieved"){
                setHasRepoLinked(true)
                const repositoryData = r.repoData
                setLrName(repositoryData.name)
                setFullLrName(repositoryData.full_name)
                setDefaultBranc(repositoryData.default_branch)
            }
        }
        setRepoId();
   }, [])
  useEffect(() => {
    function onEnterDown(e){
      if (e.key === "Enter" && isCreating){
        console.log("Enter while creating")
        handleCreateSnote(nameOfNewSnote,title,"S");
        setTitle(""); 
        setNameOfSnote("");
      }
    }
     document.addEventListener("keydown",onEnterDown)
     return () => document.removeEventListener('keydown',onEnterDown)
  },[nameOfNewSnote])

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
        getMyProjects().then(data => {
          const p = data.projects.find(pr => pr.project_id === project_id)
          if (p){
            setProjectDesc(p.description)
            setProjectRepo(p.repoLink)
            setProjectStatus(p.status)
            setProjectDate(p.atDate)
          }
        }) 
        getProjectPreferences().then(r => {
              if (r.Status === "Data retrieved"){
                    setHasMainNote(r.projectPreferences[0].includeMnote)
                    setHasReadmeNote(r.projectPreferences[0].includeReadmeNote)
                    setHasTrackCommitHistory(r.projectPreferences[0].trackCommitHistory)
                    setHasIsPublic(r.projectPreferences[0].isPublic)
                    setHasAutoSave(r.projectPreferences[0].hasAutoSave)
                    setAutoSaveInterval(r.projectPreferences[0].autoSaveInterval)
                    setHasTheme(r.projectPreferences[0].theme)}
          })
      }
    });
  }, [project_id,isOnProjectSettings]);


  //Content
  async function handleCreateSnote(name,content,imp){
    if (name === ""){return}
    const response = await newSecondaryNote(name,content,imp)
    if (response.Status === "Secondary note created")
    {
      setMySecNotes(prev => [...prev, response.Snote])
    }
    setActiveWindowId(response.Snote.id)
    setWindows(prev => [...prev, {"id":response.Snote.id,"name":name}]);
  }
  //
  function startAutoSaveTimer(EveryXseconds){
    clearInterval(timerRef.current)
    secondsRef.current = autoSaveInterval;
    setSeconds(autoSaveInterval)

    timerRef.current = setInterval(() =>{
      setSaving(true)
      secondsRef.current--;
      setSeconds(secondsRef.current)
      if (secondsRef.current === EveryXseconds){
        clearInterval(timerRef.current)
        for (let i = 0; i < modifiedNotesIdRef.current.length; i++){
          const note = mySecNotesRef.current.find(n => n.id === modifiedNotesIdRef.current[i]);
          if (!note || note.auto_save === false) continue;
          const noteC = note ? note.content : null
          handleSaveContent(note.id,noteC)
          setModifiedNotesId(prev => prev.filter(obj => obj !== note.id))
        }
        setSaving(false)
      }
    },1000)
    };
  
  function handleContentChange(newContent){
    const inIt = modifiedNotesId.find(id => id === activeSnoteId);
    const wantsSaving = activeSnote.auto_save
    if (inIt === undefined){
      setModifiedNotesId(prev => [...prev, activeSnoteId])
    }
    setMySecNotes(prev =>
      prev.map(note =>
        note.id === activeSnoteId ? {...note, content: newContent} : note
      )
    )
    if (wantsSaving && hasAutoSave){startAutoSaveTimer(0)}
  }
  async function handleSaveContent(Snote_id,content) {
    const response = await saveNoteContent(Snote_id,content)
    setModifiedNotesId(prev => prev.filter(id => id !== activeSnoteId))
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

  async function handleChangeNoteName(newName,id){
    const r = await changeNoteName(newName,id)
    if (r.Status === "Name changed"){setMySecNotes(prev => prev.map(n => n.id === id ? {...n, name:newName} : n))}
  }

  async function handleChangeAutoSave(boolean, id) {
    const r = await changeAutoSave(boolean,id)
    if(r.Status === "Auto save changed"){
      setMySecNotes(prev => prev.map(n => n.id === id ? {...n, auto_save:boolean} : n ))}
  }
  async function handleChangeProjectName(newName,id) {
        const response = await changeProjectName(id,newName)
        if (response.Status === "Name changed"){setProjectName(newName)}
    }
  async function handleChangeProjectDesc(id,newDesc) {
    const response = await changeProjectDesc(id,newDesc)
    if (response.Status === "Description changed"){ setProjectDesc(newDesc)}
    }
  async function handleChangeRepo(newLink, id){
        const request = await changeGhRepo(newLink,id)
        if (request.Status === "Link changed"){ setProjectRepo(newLink); return true }
        else if (request.Status === "Invalid GitHub link"){alert("Invalid GitHub link given"); return false}
    }
  async function handleChangeStatus(project_id){
        const response = await changeStatus(project_id)
        if (response.Status === "Status changed"){setProjectStatus(response.new_status)}
    }
  async function handleDeleteThisProject(id) {
    const request = await deleteProject(id)
    if (request.Status === "Project deleted"){ handleGoBack("")}
    }
  async function handleChangeProjectPreferences(mnote,RMnote,commitH,ispublic,autoS,autoSinterval,theme) {
    const r = await changeProjectPreferences(mnote,RMnote,commitH,ispublic,autoS,autoSinterval,theme);
    if (r.Status === "Preferences updated"){
      return true
    }
    return false
  }

  async function handleSaveNow() {
     for (let i = 0; i < modifiedNotesIdRef.current.length; i++){
          const note = mySecNotesRef.current.find(n => n.id === modifiedNotesIdRef.current[i]);
          if (!note.auto_save) continue;
          const noteC = note ? note.content : null
          handleSaveContent(note.id,noteC)
          setModifiedNotesId(prev => prev.filter(id => id !== note.id))
        }
  }

  return (
  <div className={hasTheme === 1 ? "mainDiv" : "mainDivWhite"}>
    <nav className="onProjectNav">
      <div className="goBackAndSettingsDiv">
        <Undo2Icon size={18} className="goBackIcon" onClick={() => {handleGoBack("")}}/>
        <h3 className="titleOnNav" title={projectName}>{projectName}</h3>
        
        <SettingsIcon size={18} className="settingsIcon" 
        onClick={() => {
          setIsOnProjectSettings(!isOnProjectSettings);
          setIsOnNoteSettings(false);
        }}/>
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
         projectWanstAutoSave={hasAutoSave}
         wantsAutoSave={Mnote.auto_save}
         setIsOnProjectSettings={setIsOnProjectSettings}
         />)}
      </div> : null}
      <p className="mainNoteLabel">secondary note/s:</p>
      <div className="newSnoteForm">
         <button className="addNoteBtn" onClick={() => {isCreating === false ? setIsCreating(true) : setIsCreating(false)}}>{isCreating === true ? <Minus size={18}/> : <FilePlus size={18}/>}</button>
      </div>
      <div className={isCreating === true ? "newNoteFormDiv" : "hide"} >
        <div className="parentNewNoteForm">
        <p className="Slabel">S</p>
          <input type="text" placeholder="name?"
           maxLength={25} 
           value={nameOfNewSnote}
           onChange={e => setNameOfSnote(e.target.value)}
           className="noteNameInput"
           />
           <button 
           className="createSnoteBtn"
           onClick={() => {handleCreateSnote(nameOfNewSnote,title,"S"); setTitle(""); setNameOfSnote("")}}
           ><FilePlus size={15}/></button>
        </div>
      </div>

      <div className="secondaryNotesDiv">
        {Dnotes.length > 0 ? (<button className="DnotesBtn" onClick={() => { visualDnotes === false ? setVisualDnotes(true) : setVisualDnotes(false)}}>Default<span className={visualDnotes ? "CsetColor" : "CsetColorNonActive"}>{visualDnotes === true ? <ChevronDown size={22}/> : <ChevronRight size={22}/>}</span>{currentNoteImportance === "D" ? <p className="labelCrntNote" title={currentNoteName}>{currentNoteName}</p> : null}</button>) : null}
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
          projectWanstAutoSave={hasAutoSave}
          wantsAutoSave={Dnote.auto_save}
          setIsOnProjectSettings={setIsOnProjectSettings}
         />)}
        </div>
        <div className="snotesDiv">
        <button className="DnotesBtn" onClick={() => { visualSnotes === false ? setVisualSnotes(true) : setVisualSnotes(false)}}>Created<span className={visualSnotes ? "CsetColor" : "CsetColorNonActive"}>{visualSnotes === true ? <ChevronDown size={22}/> : <ChevronRight size={22}/>}</span>{currentNoteImportance === "S" ? <p className="labelCrntNote" title={currentNoteName}>{currentNoteName}</p> : null}</button>
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
           projectWanstAutoSave={hasAutoSave}
           wantsAutoSave={Snote.auto_save}
           setIsOnProjectSettings={setIsOnProjectSettings}
         />)}
        </div>
      </div>
      </div>
    </nav>
    <main className="mainOnProject">
      <CounterToSave 
      seconds={seconds}
      modifiedNotesId={modifiedNotesId}
      mySecNotesRef={mySecNotesRef}
      autoSave={hasAutoSave}
      handleSaveContent={handleSaveContent}
      currentSnoteId={activeSnoteId}
      currentSnoteContent={currentNoteContent}
      handleSaveNow={handleSaveNow}
      />
      {isOnNoteSettings ? <NoteSettings
       name={activeSnote.name}
       id={activeSnoteId}
       importance={currentNoteImportance}
       setIsOnSettings={setIsOnNoteSettings}
       handleDeleteNote={handleDeleteSnote}
       setIsDeletingNotes={setIsDeletingNotes}
       idsToBeDeleted={idsToBeDeleted}
       setIdsToBeDeleted={setIdsToBeDeleted}
       allIds={allNotesIds}
       handleChangeNoteName={handleChangeNoteName}
       wantsAutoSave={activeSnote.auto_save}
       handleChangeAutoSave={handleChangeAutoSave}
       setIsOnProjectSettings={setIsOnProjectSettings}
       projectWantsAutoSave={hasAutoSave}
       />
       : null} 
     {isOnProjectSettings && !isOnNoteSettings ? (<ProjectSettings
      name={projectName}
      id={project_id}
      description={projectDesc}
      repoLink={projectRepo}
      status={projectStatus}
      atDate={projectDate}
      setIsOnProjectSettings={setIsOnProjectSettings}
      handleChangeProjectName={handleChangeProjectName}
      handleChangeProjectDesc={handleChangeProjectDesc}
      handleChangeRepo={handleChangeRepo}
      handleChangeStatus={handleChangeStatus}
      handleDeleteProject={handleDeleteThisProject}
      hasAutoSave={hasAutoSave}
      hasAutoSaveInterval={autoSaveInterval}
      hasMnote={hasMainNote}
      hasReadmeNote={hasReadmeNote}
      hasIsPublic={hasIsPublic}
      hasTheme={hasTheme}
      hasTrackCommit={hasTrackCommitHistory}
      handleChangeProjectPreferences={handleChangeProjectPreferences}
      hasRepoLinked={hasRepoLinked}
      lrName={lrName}
      fullLrName={fullLrName}
      defaultBranch={defaultBranch}
     />) : null}
     <div className={isOnNoteSettings === true || isOnProjectSettings === true ? "hide" : (windows.length > 0 ? "navWindows" : "navWindowsOnPH")}>
      {windows.map(window => <Window 
      key={window.id}
      windowName={window.name}
      id={window.id}
      activeWindowId={activeWindowId}
      setActiveWindowId={setActiveWindowId}
      handleWindowClosing={handleWindowClosing}
      importance={window.importance}
      modifiedWindowsid={modifiedNotesId}
      />)}
     </div>
     {!isOnNoteSettings && !isOnProjectSettings ? 
     <div className="currentWindowContentDiv">
      {wantsNotifications ? (hasTrackCommitHistory && hasRepoLinked === false ?  <div className="notificationsDiv">
        <label style={{margin:0}}><Bell size={18}/></label>
        <button className="hideNotifications" onClick={() => setWantsNotifications(false)}><X size={20}/></button>
        <p><TriangleAlert size={16} color="red"/>  You want handled to track your commits, but you haven't connected a repository to this project!</p>
        <label>You can connect a repository on 
        <button className="goToPrjcSettingsBtn" onClick={() => {
          setIsOnProjectSettings(!isOnProjectSettings);
          setIsOnNoteSettings(false);
        }}>Repository and commits</button></label>     
      </div> : null) : null}

       {repositoriesFound.length === 0 ? null : <ChooseRepository repositoriesFound={repositoriesFound}/>}

      <div className={activeSnoteId ? (hasTheme === 1 ? "windowContent" : "windowContentWhite") : "windowPH"}>
       {activeSnoteId ? <Toolbar
         editor={editor}
         activeSnote={activeSnote ? activeSnote.id : null} 
         currentContent={currentNoteContent}  
         avChainMethods={avChainMethods}
         avChainUses={avChainUses}
         mySecNotes={mySecNotes}
         theme={hasTheme}
        setActiveWindowId={setActiveWindowId}/> : null}
        {activeSnoteId ?
        <TipTap 
        currentContent={currentNoteContent}
        onContentChange={handleContentChange}
        activeSnote={activeSnote ? activeSnote.id : null}
        setEditor={setEditor}
        currentSnoteWantsSave={currentSnoteWantsSave}
        projectWantsAutoSave={hasAutoSave}
        setNoteReferencerString={setNoteReferecerString}
        setActiveWindowId={setActiveWindowId}
        windows={windows}
        setWindows={setWindows}
        /> : <MainPlaceHolder/> }
      </div>

     </div> : null}
    </main>
  </div>
  );
}