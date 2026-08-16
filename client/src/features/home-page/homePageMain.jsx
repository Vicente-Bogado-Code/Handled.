import '/src/features/home-page/css/homePageMain.css'
//
import ProjectCard from './project_cards';
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

export default function HomePage({ username, onLogout, handleProjectClick}) {
    const [projectName, setProjectName] = useState("")
    const [description, setDescription] = useState("")
    const [gh_repo, setGh_repo] = useState("")
    const [status,setStatus] = useState("")
    // 
    const [nameBorderColor, setNameBorderColor] = useState("white")
    const [descBorderColor, setDescBorderColor] = useState("white")
    //
    const [myProjects,setMyProjects] = useState([]);

    useEffect(() => { getMyProjects().then(data => setMyProjects(data.projects)); }, [])

    function verifyInput(){
        if (projectName === ""){
            setNameBorderColor("red")
            return "Project name can't be empty"}
        else{setNameBorderColor("white")}
        if (description === ""){
            setDescBorderColor("red")
            return "Project description can't be empty"}
        else{setDescBorderColor("white")}
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
                    <div className='createNewProjects'>
                        <h2 className="sectionTitle">New project</h2>
                        <div className="newProjectForm">
                            <input 
                            style={{borderColor: nameBorderColor}}
                            type="text" placeholder="Project name? (max 20 characters)" className="inputsOnHome" maxLength={20}
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                            />

                            <input
                            style={{borderColor: descBorderColor}}
                            type="text" placeholder="Tell us about your project (Max 150 characters)" className="inputsOnHome" maxLength={150}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            />

                            <button type="submit" id="createProjectBtn" onClick={handleCreate}>Create</button>
                        </div>
                    </div>
                    <div className='optionalInputDiv'>
                        <h2 className="sectionTitle">You can also set:</h2>
                        <div className="newProjectForm">
                            <input type="text" placeholder="Link of GitHub repository? (You can also add it later)" className="inputsOnHome"
                            value={gh_repo}
                            onChange={e => setGh_repo(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='showMyProjects'>
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
                <div className='showMyProjects'>
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
            </main>
        </div>
    );
}