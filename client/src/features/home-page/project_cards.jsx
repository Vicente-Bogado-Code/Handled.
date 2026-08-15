import { useState } from 'react';
import '/src/features/home-page/css/project_cards.css'
import { FaGithub } from "react-icons/fa"
import { X } from 'lucide-react'
import { Check } from 'lucide-react';

export default function ProjectCard({id, name, description, repoLink, status, atDate, onClickHandle, onClickProject, changeRepo}) {
    const statusText = status === "active" ? "Mark as done" : "Mark as active"
    const gh_repo = repoLink === "not given" ? "Add repository" : "View repository"
    const [changingRepo,setChangingRepo] = useState(false)
    const [newRepoLink,setNewRepoLink] = useState("")
    return (
        <div className="projectCard" onClick={() => onClickProject(id)}>
            <div className="projectCardHeader">
                <h3 className="projectCardName">{name}</h3>
                <span className={`statusBadge status-${status}`}>{status}</span>
            </div>
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
                                <input placeholder='paste your link' className='inputChangeRepo' 
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
            <button className={`statusText-${status}`} onClick={(e) => {
                e.stopPropagation()
                onClickHandle(id)
            }}>{statusText}</button>

            </div>
        </div>
    );
}
