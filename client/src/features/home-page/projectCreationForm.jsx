// ProjectCreationForm.jsx
import { FaGithub } from "react-icons/fa";
import { X, Settings, Plus, Link, Info } from "lucide-react";
import { getPreferences } from "../api/getDataRequests/getUserPreferences";
import { useEffect, useState } from "react";

export default function ProjectCreationForm({
    setIsCreating,
    projectName, setProjectName,
    description, setDescription,
    choiceRepo, setChoiceRepo,
    gh_repo, setGh_repo,
    advanceSettings, setAdvanceSettings,
    choiceMainNote, setChoiceMainNote,
    choiceREADMEnote, setChoiceREADMEnote,
    choiceCommitHistory, setChoiceCommitHistory,
    choicePublic, setChoicePublic,
    handleCreate
}) {
   
    const [currentIncludeMainNote, setCurrentIncludeMainNote] = useState(null)
    const [currentIncludeReadme, setCurrentIncludeReadme] = useState(null)
    const [currentBePublic, setCurrentBePublic] = useState(null)
    const [currentAutoSave, setCurrentAutoSave] = useState(null)
    const [currentAutoSaveInterval, setCurrentAutoSaveInterval] = useState(null)

    useEffect(() => {

        async function getMyPreferences() {

            const r = await getPreferences()

            if (r.Status === "Data retrieved") {
                setChoiceMainNote(r.userPreferences.defaultIncludeMnote)
                setChoiceREADMEnote(r.userPreferences.defaultIncludeReadme)
                setChoicePublic(r.userPreferences.defaultBePublic)
                setCurrentIncludeMainNote(r.userPreferences.defaultIncludeMnote)
                setCurrentIncludeReadme(r.userPreferences.defaultIncludeReadme)
                setCurrentBePublic(r.userPreferences.defaultBePublic)
                setCurrentAutoSave(r.userPreferences.defaultAutoSave)
                setCurrentAutoSaveInterval(r.userPreferences.defaultTimeAutoSave)
            }
        }
        getMyPreferences();}, [])
    return (
        <div className='createNewProjects'>
            <div className="newProjectForm">
                <div className='headerOnCreationProject'>
                    <div className='labelANdNewProjectLabel'>
                        <h2 className="newProjectLabel">What are you <span style={{color:"var(--accent"}}>working</span> on?</h2>
                        <p className='labelCanBeChanged'>All input values can be changed later</p>
                    </div>
                    <button onClick={() => { setIsCreating(false)}}
                        className='goBackOnCreating'> <X size={16} />
                    </button>
               </div>
                <input 
                type="text" placeholder="Project name? (max 25 characters)" className="nameInputCreate" maxLength={25}
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                />

                <textarea
                type="text" placeholder="Talk about your project (Max 150 characters)" className="descInputCreate" maxLength={350}
                value={description}
                onChange={e => setDescription(e.target.value)}
                />

               {choiceRepo ? <div className='gitLogonInput'>
                    <FaGithub size={28}/>
                    <input type="text" placeholder="https://github.com/username/repository" className="ghlinkInputCreate" value={gh_repo} onChange={e => setGh_repo(e.target.value)}/>
                </div> : null}
                {choiceRepo && choiceCommitHistory ? <div className="linkRepoToHandled">
                    <button className="connectRepoBtn" onClick={() => window.location.href = "https://github.com/apps/handled-integration"}>
                        <Link size={18}/>
                        <p>Connect github repository</p>
                    </button>
                    <a className="whyConnectLabel">How does handled tracks my commits?</a>
                </div> : null}

                <button className={advanceSettings ? 'advanceSetBtnActive' : "advanceSetBtn"} onClick={() =>{
                    {advanceSettings ? setAdvanceSettings(false) : setAdvanceSettings(true)}
                }}><Settings size={16}/>Advance settings</button>
                
               {advanceSettings ? 
               <div className='advSettingsDiv'>
                <label className='checkBoxOnAdvSettings settingRow'>
                    <input type="checkbox"
                    checked={currentIncludeMainNote}
                    onChange={(e) => {currentIncludeMainNote ? setCurrentIncludeMainNote(false) : setCurrentIncludeMainNote(true)}}
                    />
                     Include MAIN note
                     <div className='infoTooltip'>
                         If active, a main (M) note will be created by default on your project
                         <p className='labelOnHover'>You can change this option value anytime</p> 
                    </div>
                </label>
                <label className='checkBoxOnAdvSettings settingRow'>
                    <input type="checkbox"
                    checked={currentIncludeReadme}
                    onChange={(e) => {currentIncludeReadme ? setCurrentIncludeReadme(false) : setCurrentIncludeReadme(true)}}
                    />
                     Include README note
                     <div className='infoTooltip'>
                         If active, a README (D) note will be created by default on your project
                         <p className='labelOnHover'>You can change this option value anytime</p> 
                    </div>
                </label>
                <label className='checkBoxOnAdvSettings settingRow'>
                    <input type="checkbox"
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
                    <input type="checkbox"
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
                    <input type="checkbox"
                    checked={currentBePublic}
                    onChange={(e) => {currentBePublic ? setCurrentBePublic(false) : setCurrentBePublic(true)}}
                    />
                     Make this project public
                     <div className='infoTooltip'>
                         If active, anyone with a link can access your project and see it's content
                         <p className='labelOnHover'>You can change this option value anytime</p> 
                    </div>
                </label>
               </div> : null}
                <button type="submit" id="createProjectBtn" onClick={() => {
                    handleCreate([currentIncludeMainNote,currentIncludeReadme,currentBePublic, choiceRepo === true ? choiceCommitHistory : false,currentAutoSave,currentAutoSaveInterval]);
                    setIsCreating(false);}}><Plus size={16}/></button>
           </div>
        </div>
    );
}