import { useEffect, useState } from 'react';
import './projectSettings.css'
import { Trash, Undo2, Check, TriangleAlert, Info, Copy, Link, Pointer, GitBranch, GitCommit } from 'lucide-react';
import { FaGithub } from "react-icons/fa"
import { getLinkedRepositoryData } from '../../api/third-party-APIs/github_api';
import { getAccesibleRepositories } from '../../api/third-party-APIs/github_api';
import ChooseRepository from '../github-components/repoChoice';
import ListAllowedRepositories from '../github-components/listAllowedRepos';

export default function ProjectSettings({
    name,
    id,
    repoLink,
    status,
    atDate,
    setIsOnProjectSettings,
    handleChangeRepo, handleDeleteProject, handleChangeProjectName,
    hasMnote,hasReadmeNote,hasTrackCommit,hasIsPublic,hasAutoSave,hasAutoSaveInterval, hasTheme,
    handleChangeProjectPreferences,
    hasRepoLinked, setHasRepoLinked,
    lrName, setLrName,
    fullLrName, setFullLrName,
    defaultBranch, setDefaultBranch
}){
    const [newRepo, setNewRepo] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [savedRepo,setSavedRepo] = useState(false)
    const [newName, setNewName] = useState(name)
    const [savedName, setSavedName] = useState(false) 
    const [settingsAutoSaveValue, setSettingsAutoSaveValue] = useState(hasAutoSave)
    const [settingsAutoSaveInterval, setSettingsAutoSaveInterval] = useState(hasAutoSaveInterval)
    const [settingsIsPublic, setSettingsIsPublic] = useState(hasIsPublic)
    const [settingsTheme, setSettingsTheme] = useState(hasTheme)
    const DB_trackCommits = hasTrackCommit;
    const [settingsTrackCommits, setSettingsTrackCommits] = useState(hasTrackCommit)
    const [isSaved, setIsSaved] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [repositoriesFound, setRepositoriesFound] = useState([])
    return(
        <div className="projectSettingsDiv">
            {repositoriesFound.length > 0 ? <ListAllowedRepositories allowedRepositories={repositoriesFound} isConnecting={isConnecting} setIsConnecting={setIsConnecting} setHasRepoLinked={setHasRepoLinked} setLrName={setLrName} setLrFullName={setFullLrName} setDefaultBranch={setDefaultBranch} setRepositoriesFound={setRepositoriesFound} projectId={id}/> : null}
            <div className="labelOnProjectSettings">
                <div className="projectSettingsTitleDiv">
                    <p className="projectIdLbl">Project id: {id}</p>
                    <h2 className="projectTitleLbl" title={name}>{name}</h2>
                    <p className="projectDateLbl">Created on {atDate}</p>
                </div>
                <div className="projectStatusDiv">
                    <span className="toAccentProjectSettings">{status}</span>
                </div>
            </div>
             <div className='projectInputDiv settingsCategorySeparator'>
                    <label className='projectInputLabel'>Project name</label>
                    <div className='projectInputNicon'>
                        <input type="text" className='changeProjectNameInput' 
                        value={newName}
                        onChange={(e) => {setNewName(e.target.value); setSavedName(false)}}
                        />
                    </div>
                    <label className='projectInputLabel'>Github repository link</label>
                     <label className='projectInputLabel' style={{color:"var(--text-secondary)", marginLeft:10}}>--This is just a link to your repository webpage on GitHub. To connect a repository to handled, click "Connect repository" on <span style={{color:"var(--text-primary)"}}>Repository and commits</span></label>
                     <div className='projectInputNicon'>
                        <input type="text" className='changeProjectNameInput' placeholder={repoLink === "not given" ? "This project has no repository linked" : repoLink}
                        value={newRepo}
                        onChange={(e) => {setNewRepo(e.target.value); setSavedRepo(false)}}
                        />
                        <button className='saveProjectbtn'
                         onClick={async () => {
                         if (newName !== ""){await handleChangeProjectName(newName,id); setSavedName(true)}
                         if (newRepo !== ""){const b = await handleChangeRepo(newRepo,id); setSavedRepo(b)}
                        }}>
                            {savedRepo || savedName ? <Check size={16}/> : "Save"}
                        </button>
                    </div>
                </div>

            <div className="generalSettingsDiv settingsCategorySeparator">
                <label className='projectInputLabel'>Notes and preferences</label>
                <div className="settingsToggleRow">
                    <span className="settingsToggleLabel">Autosave</span>
                    <button
                        className={`settingsToggleSwitch ${settingsAutoSaveValue ? "toggleOn" : ""}`}
                        onClick={() => {setSettingsAutoSaveValue(!settingsAutoSaveValue); setIsSaved(false)}}
                    >
                        <div className="settingsToggleKnob"></div>
                    </button>
                </div>
                {settingsAutoSaveValue && (
                    <div className="autoSaveIntervalRow">
                        <span className="settingsToggleLabel">-- INTERVAL</span>
                        <div className="autoSaveIntervalOptions">
                            {[5,10,30,60].map((interval) => (
                                <button
                                    
                                    key={interval}
                                    className={`intervalOptionBtn ${settingsAutoSaveInterval === interval ? "intervalSelected" : ""}`}
                                    onClick={() => {setSettingsAutoSaveInterval(interval); setIsSaved(false);}}
                                >
                                    {interval}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="settingsToggleRow">
                    <span className="settingsToggleLabel">Make it public</span>
                    <button
                        className={`settingsToggleSwitch ${settingsIsPublic ? "toggleOn" : ""}`}
                        onClick={() => {setSettingsIsPublic(!settingsIsPublic); setIsSaved(false)}}
                    >
                        <div className="settingsToggleKnob"></div>
                    </button>
                </div>
                {settingsIsPublic ? <div className="settingsToggleRow">
                    <div className='shreURLdiv'>
                        <div style={{display:"flex", alignItems:"center"}}>
                        <Link size={18}/>
                        <p className='shareURL'>URLtoShareProject/username/projectname</p>
                        </div>
                        <Copy size={16} style={{cursor:"pointer"}}/>
                    </div>
                </div> : null}

                <div className="editorThemeRow">
                    <span className="settingsToggleLabel">Editor background</span>
                    <div className="editorThemeSwatches">
                        <button
                            className={`editorThemeSwatch editorThemeWhite ${settingsTheme === 0 ? "swatchSelected" : ""}`}
                            onClick={() => {setSettingsTheme(0); setIsSaved(false)}}
                        >
                            Aa
                        </button>
                        <button
                            className={`editorThemeSwatch editorThemeBlack ${settingsTheme === 1 ? "swatchSelected" : ""}`}
                            onClick={() => {setSettingsTheme(1); setIsSaved(false)}}
                        >
                            Aa
                        </button>
                    </div>
                </div>
                <button className={!isSaved ? 'saveSettingsBtn' : 'saveSettingsSavedBtn'} onClick={ async () => {
                    const r = await handleChangeProjectPreferences(
                        settingsTrackCommits,
                        settingsIsPublic,
                        settingsAutoSaveValue,
                        settingsAutoSaveInterval === null ? 10 : settingsAutoSaveInterval,
                        settingsTheme)
                    setIsSaved(r)
                }}>{isSaved ? <Check size={16}/> : "Save"}</button>
            </div>

            <div className="changeProjectDataDiv">
                <div className='projectInputDiv settingsCategorySeparator'>
                    <label className='projectInputLabel'>Repository and commits</label>
                    <div className='projectInputNicon'>
                        {!hasRepoLinked ? <button className='connectGHrepoBtn' onClick={async () => {
                            setIsConnecting(true)
                           const alreadyInstalled = await getAccesibleRepositories()
                           if (alreadyInstalled.Status === "Fetched repositories"){
                                setRepositoriesFound(alreadyInstalled.repositories)
                                setIsConnecting(true)
                            }
                            else if (alreadyInstalled.Status === "No installation id found")
                            {
                                window.location.href = "https://github.com/apps/handled-integration"
                            }      
                        }}>
                        <FaGithub size={20}/>Connect repository</button> :
                        <div className='whenRepoConnected'>
                            <div><Check size={18} style={{color:"var(--cool-green)"}}/><label className='correcltyCntcRepoLbl'>Repository connected</label></div>
                            <div style={{margin:0}}><FaGithub size={30} color='white'/><h2 className='connectedToLbl'>Connected to {lrName}</h2></div>
                            <p className='fullNameLbl'>{fullLrName}</p>
                            <label style={{color:"var(--text-secondary)", fontSize:"13px", marginBottom:4}}>Source</label>
                            <div><GitBranch size={20} style={{color:"var(--text-secondary)"}}/><p className='defaultBrnchLbl'>{defaultBranch}</p></div>
                        </div>
                        }
                    </div>
                   {hasRepoLinked ? <div className="settingsToggleRow">
                        <span className="settingsToggleLabel"><GitCommit size={18}/>Track commits (if false, Handled will stop tracking commits, but the note "Commit history" will still have the old ones)</span>
                        <button
                            className={`settingsToggleSwitch ${settingsTrackCommits ? "toggleOn" : ""}`}
                            onClick={() => {setSettingsTrackCommits(!settingsTrackCommits); setIsSaved(false)}}
                        >
                            <div className="settingsToggleKnob"></div>
                        </button>
                    </div> : null}
                <a className='trackingCommitsLblHelp' href='#'><Info size={16}/>How does handled track my commits?</a> 
                </div>

                <label className='projectInputLabel'>Other</label>
                {!isDeleting ? (
                    <button className="deleteProjectSettingsBtn" onClick={() => setIsDeleting(true)}>
                        <Trash size={15}/>Delete project
                    </button>
                ) : (
                    <div className="deleteConfirmCard">
                        <div className="deleteConfirmHeader">
                            <TriangleAlert size={15}/>
                            <p className="deleteConfirmLbl">This project will be permanently deleted</p>
                        </div>
                        <div className="deleteConfirmActions">
                            <button className="cancelDeleteBtn" onClick={() => setIsDeleting(false)}>Cancel</button>
                            <button className="confirmDeleteBtn" onClick={() => {
                                handleDeleteProject(id);
                                setIsOnProjectSettings(false);
                                setIsDeleting(false);
                            }}>Delete</button>
                        </div>
                    </div>
                )}
                <button onClick={() => setIsOnProjectSettings(false)} className="exitProjectSettingsBtn">
                    <Undo2 size={15}/>Go back to project
                </button>
            </div>
        </div>
    );
}