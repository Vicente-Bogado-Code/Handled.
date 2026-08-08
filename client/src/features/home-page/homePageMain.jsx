import '/src/features/home-page/css/homePageMain.css'
import ProjectCard from './project_cards';
import { useState,useEffect } from 'react';
import { createProject } from '../api/createProject';
import { getMyProjects } from '../api/getMyProjects';
import { getDate } from '../otherJSfunctions/getExactTime';
import { changeStatus } from '../api/changeStatus';


export default function HomePage({ username, onLogout}) {
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

    async function handleStatus(project_id){
        const response = await changeStatus(project_id)
        if (response.Status === "Status changed"){
            setMyProjects(prev =>
                prev.map(project =>
                    project.project_id === project_id
                    ? {...project, status: response.new_status}
                    : project
                )
            )
        }
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
                            type="text" placeholder="Project name? (max 30 characters)" className="inputsOnHome" maxLength={30}
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                            />

                            <input
                            style={{borderColor: descBorderColor}}
                            type="text" placeholder="What will your project do? (Max 50 characters)" className="inputsOnHome" maxLength={50}
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
                    <h2 className="sectionTitle">Your <span className="activeSpan">active</span> projects</h2>
                    <div className="projectsGrid">
                        {activeProjects.map(p => (<ProjectCard key={p.project_id} {...p} id={p.project_id} onClickHandle={handleStatus}/>)
                    )}
                    </div>
                </div>
                <div className='showMyProjects'>
                    <h2 className="sectionTitle">Marked as <span className='doneSpan'>done</span></h2>
                    <div className="projectsGrid">
                        {markedAsDone.map(p => (<ProjectCard key={p.project_id} {...p} id={p.project_id} onClickHandle={handleStatus}/>))}
                    </div>
                </div>
            </main>
        </div>
    );
}