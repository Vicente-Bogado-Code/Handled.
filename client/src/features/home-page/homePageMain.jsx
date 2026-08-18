import './css/homePageMain.css'
import './css/createProjectForm.css'
//
import MyProjects from './navComponents/myProjectsComp';
import UserSettings from './navComponents/userComp';
import SettingsComp from './navComponents/settingsComp';
import Contact from './navComponents/contactComp';
//
import { useState,useEffect } from 'react';
import { createProject } from '../api/createRequest/createProject';
import { getMyProjects } from '../api/getDataRequests/getMyProjects';
import { getDate } from '../otherJSfunctions/getExactTime';
import { changeStatus } from '../api/alterRequests/changeStatus';
import { changeGhRepo } from '../api/alterRequests/alterOther';
import { deleteProject } from '../api/deleteRequests/deleteProject';
import { changeProjectDesc } from '../api/alterRequests/changeDescName';
import { changeProjectName } from '../api/alterRequests/changeDescName';
import { Settings, X, User, FolderOpen, Mail, LogOut, HandHelping } from 'lucide-react';
import { FaGithub } from "react-icons/fa"

export default function HomePage({ username, onLogout, handleProjectClick}) {
    const [projectName, setProjectName] = useState("")
    const [description, setDescription] = useState("")
    const [gh_repo, setGh_repo] = useState("")
    const [status,setStatus] = useState("")
    const [myProjects,setMyProjects] = useState([])
    const [isCreating,setIsCreating] = useState(false)
    const [advanceSettings, setAdvanceSettings] = useState(false)
    const [choiceRepo, setChoiceRepo] = useState(true)
    const [choiceCommitHistory,setChoiceCommitHistory]= useState(true)
    const [choiceMainNote, setChoiceMainNote] = useState(true)
    const [choiceREADMEnote, setChoiceREADMEnote] = useState(true)
    const [choicePublic, setChoicePublic] = useState(false)
    const [showActive, setShowActive] = useState(true)
    const [showDone, setShowDone] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [onWindow, setOnWindow] = useState(0) //0 Projects, 1 User, 2 settings, 3 contact
    useEffect(() => { getMyProjects().then(data => setMyProjects(data.projects)); }, [])

    function verifyInput(){
        if (projectName === ""){return "Project name can't be empty"}
        if (description === ""){return "Project description can't be empty"}
        return null
    }
    //
    async function handleCreate() {
        const currentTime = getDate();
        console.log(currentTime)
        const error = verifyInput()
        if (error){return}
        const response = await createProject(projectName,description,gh_repo,currentTime)
        if (response.Status === "Project created"){
            setMyProjects(previous => [...previous, response.projects])
            setProjectName("");
            setDescription("");
            setGh_repo("");
        }
    }
    //
    async function handleStatus(project_id){
        const response = await changeStatus(project_id)
        if (response.Status === "Status changed"){
            setMyProjects(prev => prev.map(project => project.project_id === project_id ? {...project, status:response.new_status} : project))}
    }
    async function handleChangeRepo(newLink, id){
        const request = await changeGhRepo(newLink,id)
        if (request.Status === "Link changed"){ setMyProjects(prev => prev.map(p => p.project_id === id ? {...p, repoLink:newLink} : p)) }
        else if (request.Status === "Invalid GitHub link"){alert("Invalid GitHub link given")}
    }
    //
    async function handleDeleteProject(id) {
    const request = await deleteProject(id)
    if (request.Status === "Project deleted"){ setMyProjects(prev => prev.filter(p => p.project_id !== id))}
    }
    //
    async function handleChangeDesc(id,newDesc) {
    const response = await changeProjectDesc(id,newDesc)
    if (response.Status === "Description changed"){ setMyProjects(prev => prev.map(p => p.project_id === id ? {...p, description:newDesc} : p))}
    }
    async function handleChangeName(id,newName) {
        const response = await changeProjectName(id,newName)
        if (response.Status === "Name changed"){setMyProjects(prev => prev.map(p => p.project_id === id ? {...p, name:newName} : p))}
    }

    const activeProjects = myProjects.filter(project => project.status === "active").filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const markedAsDone = myProjects.filter(project => project.status === "done").filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

    let projectsFound;
    if (markedAsDone.length + activeProjects.length === 0){projectsFound = false} else{projectsFound = true}

    return (
        <div className="homePageWrapper">
            <aside className="sidebar">
                <div className="profileSection">
                    <div className="avatarCircle"><User size={18}/></div>
                    <p className="username"> {username}</p>
                </div>
                <nav className="sidebarNav">
                    <div>
                        <button onClick={() => {setOnWindow(0)}} className={onWindow === 0 ? "activeWindow" : "nonActiveW"}> <FolderOpen size={18}/>My projects</button>
                        <button onClick={() => {setOnWindow(1)}} className={onWindow === 1 ? "activeWindow" : "nonActiveW"}><User size={18}/> User</button>
                        <button onClick={() => {setOnWindow(2)}} className={onWindow === 2 ? "activeWindow" : "nonActiveW"}><Settings size={18}/>Settings</button>
                    </div>
                    <div>
                        <button onClick={() => {setOnWindow(3)}} className={onWindow === 3 ? "activeWindow" : "nonActiveW"}><Mail size={18}/>Contact</button>
                        <button onClick={onLogout} className='nonActiveW'><LogOut size={18}/>Logout</button>
                    </div>
                    <div>
                         <a className='sourceCodeBtn' href='https://github.com/Vicente-Bogado-Code/Handled.' target='_blank' ><FaGithub size={18}/>Handled source code</a>
                         <button onClick={() => {setOnWindow(4)}} className={onWindow === 4 ? "activeWindow" : "nonActiveW"}> <HandHelping size={18}/>Contribute</button>
                    </div>
                </nav>
            </aside>

            <main className='homePageMainDiv'>
                {onWindow === 0 ? <MyProjects
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    projectName={projectName}
                    setProjectName={setProjectName}
                    description={description}
                    setDescription={setDescription}
                    choiceRepo={choiceRepo}
                    setChoiceRepo={setChoiceRepo}
                    gh_repo={gh_repo}
                    setGh_repo={setGh_repo}
                    advanceSettings={advanceSettings}
                    setAdvanceSettings={setAdvanceSettings}
                    choiceMainNote={choiceMainNote}
                    setChoiceMainNote={setChoiceMainNote}
                    choiceREADMEnote={choiceREADMEnote}
                    setChoiceREADMEnote={setChoiceREADMEnote}
                    choiceCommitHistory={choiceCommitHistory}
                    setChoiceCommitHistory={setChoiceCommitHistory}
                    choicePublic={choicePublic}
                    setChoicePublic={setChoicePublic}
                    handleCreate={handleCreate}
                    username={username}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showActive={showActive}
                    setShowActive={setShowActive}
                    showDone={showDone}
                    setShowDone={setShowDone}
                    projectsFound={projectsFound}
                    activeProjects={activeProjects}
                    markedAsDone={markedAsDone}
                    handleStatus={handleStatus}
                    handleProjectClick={handleProjectClick}
                    handleChangeRepo={handleChangeRepo}
                    handleDeleteProject={handleDeleteProject}
                    handleChangeDesc={handleChangeDesc}
                    handleChangeName={handleChangeName}
                /> : onWindow === 1 ? <UserSettings/> : onWindow === 2 ? <SettingsComp/> : onWindow === 3 ? <Contact/> : null}
               
            </main>
        </div>
    );
}