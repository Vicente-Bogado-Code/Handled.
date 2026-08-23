import { useState } from 'react';
import './css/project_cards.css'
import './css/alternate.css'
import { FaGithub } from "react-icons/fa"
import { X, Check, Settings, Trash2, Pencil, SquarePen, CircleCheck, RotateCcw } from "lucide-react"

function SettingsComp({makingChanges, isDeleting, setIsDeleting, isChangingName, setIsChangingName, isChangingDesc, setIsChangingDesc, newDesc, setNewDesc, newName, setNewName, id, deleteProject, changeProjectDesc, changeProjectName}){
    return(
        <div className='settingsDiv'>
            {makingChanges === false ? <div className='butnsOnSettings'>
                <button className='deleteProjectBtn'
                onClick={(e) => 
                {
                    e.stopPropagation()
                   {isDeleting === false ? setIsDeleting(true) : setIsDeleting(false)}
                }
                }
                ><X size={16}/> Delete project</button>
                <button className='modifyProjectBtn' onClick={(e) => {
                    e.stopPropagation();
                    {isChangingName === true ? setIsChangingName(false) : setIsChangingName(true)}
                }}><Pencil size={16}/>Change project name</button>
                <button className='modifyProjectBtn' onClick={(e) => {
                    e.stopPropagation();
                    {isChangingDesc === true ? setIsChangingDesc(false) : setIsChangingDesc(true)}
                }}><SquarePen size={16}/>Change project description</button>
            </div> : 
            (isDeleting === true ? <div className='askDeleteOrKeepDiv'>
                <p className='labelOnDelete'>This project will be <strong style={{color:"red"}}>PERMANENTLY</strong> deleted</p>
                <button className='modifyProjectBtn' onClick={(e) => {
                    e.stopPropagation()
                    setIsDeleting(false)
                }}>No, go back</button>
                <button className='deleteProjectBtn' onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(id)
                }}>Yes, delete</button>
            </div> : (isChangingDesc === true ? <div className='changingDescDiv'>
                <textarea placeholder="Talk a bit about your project (Max 150 characters)" 
                    className="changingDescInput"
                    maxLength={150}
                    onClick={(e) => e.stopPropagation()}
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}/>
                <div className='btnsOKnGoBack'> <button className='updateBtn' onClick={(e) => {
                    e.stopPropagation()
                    changeProjectDesc(id,newDesc)
                    setIsChangingDesc(false)
                    setNewDesc("")
                }}>Update</button> <button className='goBackBtn' onClick={(e) => {
                    e.stopPropagation()
                    setIsChangingDesc(false)
                }}>Go back</button></div>
            </div> : 
            <div className='changingNameDiv'>
                <input type="text" placeholder="Project name? (max 25 characters)"
                    className="changinNameInput"  
                    maxLength={25}
                    onClick={(e) => e.stopPropagation()} 
                    value={newName}
                    onChange={e => setNewName(e.target.value)}/>
                <div className='btnsOKnGoBack'> <button className='updateBtn' onClick={(e) => {
                    e.stopPropagation()
                    changeProjectName(id,newName)
                    setIsChangingName(false)
                    setNewName("")
                }}>Update</button><button className='goBackBtn' onClick={(e) => {
                    e.stopPropagation()
                    setIsChangingName(false)
                }}>Go back</button></div>
            </div>))}
            {makingChanges === false ? <p className='labelOnStngs'>Access more advanced settings inside the project settings</p> : null}
        </div>
    );
}

export default function ProjectCard({
    id, name, description, repoLink, status, atDate, onClickHandle, onClickProject, changeRepo,deleteProject,changeProjectDesc, changeProjectName}) {
    const statusText = status === "active" ? "Mark as done" : "Mark as active"
    const gh_repo = repoLink === "not given" ? "Add repository" : "View repository"
    const [changingRepo,setChangingRepo] = useState(false)
    const [newRepoLink,setNewRepoLink] = useState("")
    const [onSettings, setOnSettings] = useState(false)
    const [isDeleting,setIsDeleting] = useState(false)
    const [isChangingName,setIsChangingName] = useState(false)
    const [isChangingDesc,setIsChangingDesc] = useState(false)
    const [newName,setNewName] = useState(name)
    const [newDesc, setNewDesc] = useState(description)
    let makingChanges = false;
    if (isDeleting === true || isChangingDesc == true || isChangingName == true){ makingChanges = true}
    return (
        <div className="projectCard" onClick={() => onClickProject(id)}>
            <div className="projectCardHeader">
                <button className='optionsBtn'
                 onClick={(e) => {
                    {onSettings === false ? setOnSettings(true) : setOnSettings(false)}
                    e.stopPropagation();
                    }}>
                    {onSettings === false ? <Settings className='sntsIcon' size={16}/> : <X size={16} className='exitOptions'/>}
                </button>
                <h3 className="projectCardName" title={name}>{name}</h3>
                <span className={`statusBadge status-${status}`}>{status}</span>
            </div>
            {onSettings === true ? <SettingsComp
                makingChanges={makingChanges}
                isDeleting={isDeleting}
                setIsDeleting={setIsDeleting}
                isChangingName={isChangingName}
                setIsChangingName={setIsChangingName}
                isChangingDesc={isChangingDesc}
                setIsChangingDesc={setIsChangingDesc}
                newDesc={newDesc}
                setNewDesc={setNewDesc}
                newName={newName}
                setNewName={setNewName}
                id={id}
                deleteProject={deleteProject}
                changeProjectDesc={changeProjectDesc}
                changeProjectName={changeProjectName}
            /> : 
            <div className='allDiv'>
            <p className="projectCardDesc">{description}</p>
            <p className="dateOnCards">Created on {atDate}</p>
            <div className='footerOnCards'>
                <div className='repoLogoNLinkDiv'>
                    <span className='ghLogoOnRepoLink'><FaGithub size={16}/></span>
                    {repoLink === "not given" ?
                     ( changingRepo === false ?
                            (<button className='repoLink' onClick={(e) => {setChangingRepo(true); e.stopPropagation()}}>
                            Add repository</button>)
                            : 
                            <div className='inputFormDiv'>
                                <input placeholder='paste your repo link here' className='inputChangeRepo' 
                                onClick={(e) => e.stopPropagation()}
                                value={newRepoLink}
                                onChange={c => setNewRepoLink(c.target.value)}
                                >
                                </input> 

                                <button className='confirmChangeRepo' onClick={
                                    (e) => {e.stopPropagation();
                                           changeRepo(newRepoLink,id)
                                           setChangingRepo(false)
                                           setNewRepoLink("")
                                    }}>
                                    <Check className='Xclass' size={16}/>
                                </button>

                                <button className='cancelChangeRepo' onClick={(e) => {e.stopPropagation(); setChangingRepo(false); setNewRepoLink("")}}>
                                    <X className='Xclass' size={16}/>
                                </button>
                            </div>) 
                     :
                     (<a href={repoLink} target="_blank" rel="noreferrer"
                      className="repoLink"
                      onClick={(e) => e.stopPropagation()}>
                      View repository
                    </a>)
                    }
                </div>
            {changingRepo === false ? <button className={`statusText-${status}`} onClick={(e) => {
                e.stopPropagation()
                onClickHandle(id)
            }}>{statusText}{statusText === "Mark as active" ? <RotateCcw size={16}/> : <CircleCheck size={16}/>}</button> : null}
            </div>
            </div>
            }
        </div>
    );
}