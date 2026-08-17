import './css/homePageMain.css'
import './css/createProjectForm.css'
//
import ProjectCard from './project_cards';
//
import { useState,useEffect, use } from 'react';
import { createProject } from '../api/createRequest/createProject';
import { getMyProjects } from '../api/getDataRequests/getMyProjects';
import { getDate } from '../otherJSfunctions/getExactTime';
import { changeStatus } from '../api/alterRequests/changeStatus';
import { changeGhRepo } from '../api/alterRequests/alterOther';
import { deleteProject } from '../api/deleteRequests/deleteProject';
import { changeProjectDesc } from '../api/alterRequests/changeDescName';
import { changeProjectName } from '../api/alterRequests/changeDescName';
import { Plus, Settings, X } from 'lucide-react';
import { FaGithub } from "react-icons/fa"

export default function HomePage({ username, onLogout, handleProjectClick}) {
    const [projectName, setProjectName] = useState("")
    const [description, setDescription] = useState("")
    const [gh_repo, setGh_repo] = useState("")
    const [status,setStatus] = useState("")
    const [myProjects,setMyProjects] = useState([])
    const [isCreating,setIsCreating] = useState(false)
    const [advanceSettings, setAdvanceSettings] = useState(false)
    //advance stns
    const [choiceRepo, setChoiceRepo] = useState(true)
    const [choiceCommitHistory,setChoiceCommitHistory]= useState(true)
    const [choiceMainNote, setChoiceMainNote] = useState(true)
    const [choiceREADMEnote, setChoiceREADMEnote] = useState(true)
    const [choicePublic, setChoicePublic] = useState(false)

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


    const activeProjects = myProjects.filter(project => project.status === "active");
    const markedAsDone = myProjects.filter(project => project.status === "done")

    return (
        <div className="homePageWrapper">
            <aside className="sidebar">
                <div className="profileSection">
                    <div className="avatarCircle">{username.charAt(0)}</div>
                    <p className="username"> {username}</p>
                </div>
                <nav className="sidebarNav">
                    <button>My projects</button>
                    <button>Settings</button>
                    <button onClick={onLogout}>Logout</button>
                </nav>
            </aside>

            <main className='homePageMainDiv'>
                <div className='projectCreation'>
                    <button className='startCreatingProjctBtn' onClick={() =>{{setIsCreating(true)}}}>
                        Create new project
                    </button>
                    {isCreating ? (
                        <div className='createNewProjects'>
                            <div className="newProjectForm">
                                <div className='headerOnCreationProject'>
                                    <div className='labelANdNewProjectLabel'>
                                        <h2 className="newProjectLabel">What are we <span style={{color:"var(--accent"}}>working</span> on?</h2>
                                        <p className='labelCanBeChanged'>All input values can be changed later</p>
                                    </div>
                                    <button onClick={() => { setIsCreating(false)}}
                                        className='goBackOnCreating'> <X size={16} />
                                    </button>
                               </div>
                                <input 
                                type="text" placeholder="Project name? (max 20 characters)" className="nameInputCreate" maxLength={20}
                                value={projectName}
                                onChange={e => setProjectName(e.target.value)}
                                />

                                <textarea
                                type="text" placeholder="Tell us about your project (Max 150 characters)" className="descInputCreate" maxLength={150}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                />

                               {choiceRepo ? <div className='gitLogonInput'>
                                    <FaGithub size={28}/>
                                    <input type="text" placeholder="https://github.com/username/repository" className="ghlinkInputCreate" value={gh_repo} onChange={e => setGh_repo(e.target.value)}/>
                                </div> : null}

                                <button className={advanceSettings ? 'advanceSetBtnActive' : "advanceSetBtn"} onClick={() =>{
                                    {advanceSettings ? setAdvanceSettings(false) : setAdvanceSettings(true)}
                                }}><Settings size={16}/>Advance settings</button>
                                
                               {advanceSettings ? 
                               <div className='advSettingsDiv'>
                                <label className='checkBoxOnAdvSettings settingRow'>
                                    <input type="checkBox"
                                    checked={choiceMainNote}
                                    onChange={(e) => {choiceMainNote ? setChoiceMainNote(false) : setChoiceMainNote(true)}}
                                    />
                                     Include MAIN note
                                     <div className='infoTooltip'>
                                         If active, a main (M) note will be created by default on your project
                                         <p className='labelOnHover'>You can change this option value anytime</p> 
                                    </div>
                                </label>
                                <label className='checkBoxOnAdvSettings settingRow'>
                                    <input type="checkBox"
                                    checked={choiceREADMEnote}
                                    onChange={(e) => {choiceREADMEnote ? setChoiceREADMEnote(false) : setChoiceREADMEnote(true)}}
                                    />
                                     Include README note
                                     <div className='infoTooltip'>
                                         If active, a README (D) note will be created by default on your project
                                         <p className='labelOnHover'>You can change this option value anytime</p> 
                                    </div>
                                </label>
                                <label className='checkBoxOnAdvSettings settingRow'>
                                    <input type="checkBox"
                                     checked={choiceRepo}
                                     onChange={(e) => {choiceRepo ? setChoiceRepo(false) : setChoiceRepo(true)}}
                                     />
                                     Include GitHub repository link
                                     <div className='infoTooltip'>
                                         If active, you will be able to link a GitHub (only) repository to this project
                                         <p className='labelOnHover'>You can change this option value anytime</p> 
                                    </div>
                                </label>
                                {choiceRepo ? <label className='checkBoxOnAdvSettingsYesRepo settingRow'>
                                    --
                                    <input type="checkBox"
                                    checked={choiceCommitHistory}
                                    onChange={(e) => {choiceCommitHistory ? setChoiceCommitHistory(false) : setChoiceCommitHistory(true)}}
                                    />
                                     Include commit history on a note
                                     <div className='infoTooltip'>
                                         If active, a Commit history (D) note will be created by default to track the commits of the given repository
                                         <p className='labelOnHoverRed'>This option value is PERMANENT (can't be changed later)</p> 
                                    </div>
                                </label> : null}
                                <label className='checkBoxOnAdvSettings settingRow'>
                                    <input type="checkBox"
                                    checked={choicePublic}
                                    onChange={(e) => {choicePublic ? setChoicePublic(false) : setChoicePublic(true)}}
                                    />
                                     Make this project public
                                     <div className='infoTooltip'>
                                         If active, anyone with a link can access your project and see it's content
                                         <p className='labelOnHover'>You can change this option value anytime</p> 
                                    </div>
                                </label>
                               </div> : null}
                                <button type="submit" id="createProjectBtn" onClick={handleCreate}><Plus size={16}/></button>
                           </div>
                        </div>) :
                        <div> 
                            <h2>Is not creating</h2>
                        </div>
                        }
                </div>
                <div className='allFoundedProjects'>
                <div className='showMyActiveProjects'>
                    <h2 className="sectionTitle">Your <span className="activeSpan">active</span> project/s</h2>
                    <div className="projectsGrid">
                        {activeProjects.map(p => (<ProjectCard key={p.project_id} {...p} 
                        id={p.project_id}
                        onClickHandle={handleStatus}
                        onClickProject={handleProjectClick}
                        changeRepo={handleChangeRepo}
                        deleteProject={handleDeleteProject}
                        changeProjectDesc={handleChangeDesc}
                        changeProjectName={handleChangeName}/>)
                    )}
                    </div>
                </div>
                <div className='showMyDoneProjects'>
                    <h2 className="sectionTitle">Your marked as <span className='doneSpan'>done</span> project/s</h2>
                    <div className="projectsGrid">
                        {markedAsDone.map(p => (<ProjectCard key={p.project_id} {...p}
                        id={p.project_id}
                        onClickHandle={handleStatus}
                        onClickProject={handleProjectClick}
                        changeRepo={handleChangeRepo}
                        deleteProject={handleDeleteProject}
                        changeProjectDesc={handleChangeDesc}
                        changeProjectName={handleChangeName}/>)
                    )}
                    </div>
                </div>
                </div>
            </main>
        </div>
    );
}