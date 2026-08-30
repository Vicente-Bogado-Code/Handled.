// ProjectCreationForm.jsx
import { FaGithub } from "react-icons/fa";
import { X, Settings, Plus, Link, Info, Undo2, TriangleAlert } from "lucide-react";
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
    const [validRepo, setValidRepo] = useState(true)
    function checkRepo(repo){
        if (repo === "") return true
        const validate = repo.startsWith("https://github.com/")
        return validate
    }

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
                type="text" placeholder="Project name" className="nameInputCreate"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                />

                <textarea
                type="text" placeholder="Talk about your project (Max 150 characters)" className="descInputCreate" maxLength={350}
                value={description}
                onChange={e => setDescription(e.target.value)}
                />

               {choiceRepo ? <div className='gitLogonInput'>
                <div className="actualGitLogoNinput">
                    <FaGithub size={28}/>
                    <input type="text" placeholder="e.g. https://github.com/Vicente-Bogado-Code/Handled." className="ghlinkInputCreate" value={gh_repo} onChange={e => setGh_repo(e.target.value)}
                    style={{borderColor: validRepo ? "var(--border)" : "red"}}
                    />
                </div>
                    {validRepo ? null:<label> <TriangleAlert size={16}/>Invalid link given</label>}
                </div> : null}

                <button className="advanceSetBtn"><Settings size={16}/>Project settings</button>
                
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
                         If active, you will be able to paste a link to GitHub (only) repository to this project
                         <p className='labelOnHover'>You can change this option value anytime</p> 
                    </div>
                </label>
               <label className='checkBoxOnAdvSettingsYesRepo settingRow' style={{marginLeft:5}}>
                    <input type="checkbox"
                    checked={choiceCommitHistory}
                    onChange={(e) => {choiceCommitHistory ? setChoiceCommitHistory(false) : setChoiceCommitHistory(true)}}
                    />
                     Let handled track my commit history.
                     <div className='infoTooltip'>
                         If active, a Commit history (D) note will be created by default to track the commits of the CONNECTED repository, not linked.
                         <p className='labelOnHover'>You can change this option value anytime</p> 
                    </div>
                </label>
                <label className='checkBoxOnAdvSettings settingRow'>
                    <input type="checkbox"
                    checked={currentBePublic}
                    onChange={(e) => {currentBePublic ? setCurrentBePublic(false) : setCurrentBePublic(true)}}
                    />
                     Make this project public
                     <div className='infoTooltip'>
                         If active, anyone with you project's link can access it and see it's content but not modify it.
                         <p className='labelOnHover'>You can change this option value anytime</p> 
                    </div>
                </label>
               </div>
                {projectName.length > 0 && description.length > 0 ? <button type="submit" id="createProjectBtn" onClick={() => {
                    const validateRepo = checkRepo(gh_repo)
                    if (validateRepo)
                    {
                    handleCreate([currentIncludeMainNote,currentIncludeReadme,
                    currentBePublic, choiceRepo === true ? choiceCommitHistory : false, currentAutoSave, currentAutoSaveInterval]);
                    setIsCreating(false)
                    }
                    else setValidRepo(false)
                }}
                    ><Plus size={16}/></button> : <button id="createProjectBtnNot"><Plus size={16}/></button>}
           </div> 
        </div>
    );
}