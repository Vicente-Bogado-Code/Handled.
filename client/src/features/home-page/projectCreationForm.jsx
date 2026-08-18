// ProjectCreationForm.jsx
import { FaGithub } from "react-icons/fa";
import { X, Settings, Plus } from "lucide-react";

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
    return (
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
                type="text" placeholder="Project name? (max 25 characters)" className="nameInputCreate" maxLength={25}
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
                    <input type="checkbox"
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
                    <input type="checkbox"
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
                    --
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
                <button type="submit" id="createProjectBtn" onClick={() => {handleCreate(); setIsCreating(false);}}><Plus size={16}/></button>
           </div>
        </div>
    );
}