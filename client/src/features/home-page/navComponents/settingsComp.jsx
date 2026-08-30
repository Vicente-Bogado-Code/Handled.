import { useEffect, useState } from 'react';
import './css/settingsComp.css';
import { Save, Clock, FileText, Info, Check, Settings } from 'lucide-react';
import { getPreferences,savePreferences } from '../../api/getDataRequests/getUserPreferences';
import { FaGithub } from 'react-icons/fa';

export default function SettingsComp() {
    const [theme, setTheme] = useState("system");
    const [autosaveEnabled, setAutosaveEnabled] = useState(null);
    const [autosaveInterval, setAutosaveInterval] = useState(null);
    const [defaultMainNote, setDefaultMainNote] = useState(null);
    const [defaultReadmeNote, setDefaultReadmeNote] = useState(null);
    const [defaultPublic, setDefaultPublic] = useState(null);
    const [isSaved,setIsSaved] = useState(false)
    useEffect(() =>{
        async function getPref(){
            const r = await getPreferences()
            if (r.Status === "Data retrieved"){
                setAutosaveEnabled(r.userPreferences.defaultAutoSave)
                setAutosaveInterval(r.userPreferences.defaultTimeAutoSave)
                setDefaultMainNote(r.userPreferences.defaultIncludeMnote)
                setDefaultReadmeNote(r.userPreferences.defaultIncludeReadme)
                setDefaultPublic(r.userPreferences.defaultBePublic)
            }
            else{
                alert(r.Status)
            }
        }
        getPref()
    }, [])

    async function handleSave(das,dtas,dimn,dirm,dbp) {
        const r = await savePreferences(das,dtas,dimn,dirm,dbp)        
    }

    return (
        <div className="appSettingsMain">
            <label className='rememberLabel'>Remember to save changes by clicking "Save" at the end of the page</label>
            <section className="settingsSection">
                <div className="settingsSectionHeader">
                    <div>
                        <h2>Autosave</h2>
                        <p>Set a default waiting time for auto saving.</p>
                    </div>
                </div>

                <div className="settingsRow">
                    <div>
                        <h3>Enable autosave</h3>
                        <p>Automatically save note changes as you type.</p>
                    </div>
                    <button
                        className={autosaveEnabled ? "toggleSwitchOn" : "toggleSwitch"}
                        onClick={() => {setAutosaveEnabled(!autosaveEnabled); setIsSaved(false)}}
                    >
                        <span className="toggleKnob" />
                    </button>
                </div>

                {autosaveEnabled ? (
                    <div className="settingsRow">
                        <div>
                            <h3>Autosave interval</h3>
                            <p>How long to wait after you stop typing before saving.</p>
                        </div>
                        <div className="intervalOptionsRow">
                            <button
                                className={autosaveInterval === 10 ? "intervalOptionActive" : "intervalOption"}
                                onClick={() => {setAutosaveInterval(10); setIsSaved(false)}}
                            >
                                <Clock size={14} /> 10s
                            </button>
                            <button
                                className={autosaveInterval === 30 ? "intervalOptionActive" : "intervalOption"}
                                onClick={() => {setAutosaveInterval(30); setIsSaved(false)}}
                            >
                                <Clock size={14} /> 30s
                            </button>
                            <button
                                className={autosaveInterval === 60 ? "intervalOptionActive" : "intervalOption"}
                                onClick={() => {setAutosaveInterval(60); setIsSaved(false)}}
                            >
                                <Clock size={14} /> 1m
                            </button>
                        </div>
                    </div>
                ) : null}
            </section>

            <section className="settingsSection">
                <div className="settingsSectionHeader">
                    <div>
                        <h2>New project defaults</h2>
                        <p>Pre-fill these options whenever you create a new project.</p>
                    </div>
                </div>

                <div className="settingsRow">
                    <div>
                        <h3>Include main note</h3>
                        <p>Automatically create a main note on new projects.</p>
                    </div>
                    <button
                        className={defaultMainNote ? "toggleSwitchOn" : "toggleSwitch"}
                        onClick={() => {setDefaultMainNote(!defaultMainNote); setIsSaved(false)}}
                    >
                        <span className="toggleKnob" />
                    </button>
                </div>

                <div className="settingsRow">
                    <div>
                        <h3>Include README note</h3>
                        <p>Automatically create a README note on new projects.</p>
                    </div>
                    <button
                        className={defaultReadmeNote ? "toggleSwitchOn" : "toggleSwitch"}
                        onClick={() => {setDefaultReadmeNote(!defaultReadmeNote); setIsSaved(false)}}
                    >
                        <span className="toggleKnob" />
                    </button>
                </div>

                <div className="settingsRow">
                    <div>
                        <h3>Make new projects public by default</h3>
                        <p>You can still change this per project when creating it.</p>
                    </div>
                    <button
                        className={defaultPublic ? "toggleSwitchOn" : "toggleSwitch"}
                        onClick={() => {setDefaultPublic(!defaultPublic); setIsSaved(false)}}
                    >
                        <span className="toggleKnob" />
                    </button>
                </div>
            </section>
            <section className="settingsSection">
                 <div className="settingsSectionHeader">
                    <FaGithub size={20} color='white' />
                    <div>
                        <h2>github connection</h2>
                        <p>Manage handled's github app</p>
                    </div>
                </div>
                  <div className="settingsRow">
                    <button className='manageAppBtn' onClick={() => window.location.href = "https://github.com/apps/handled-integration"}><Settings size={16}/>Manage app</button>
                </div>
            </section>
            <section className="settingsSection">
                 <div className="settingsSectionHeader">
                    <Info size={20} />
                    <div>
                        <h2>Information</h2>
                        <p>Information about the software</p>
                    </div>
                </div>
                  <div className="settingsRow">
                    <div className='infoSoftWareDiv'>
                        <h3>Version</h3>
                        <p className='version'>0.1.0</p>
                    </div>
                </div>

            </section>
                <button className={isSaved ? 'saveBtnSaved' : 'saveBtn'}onClick={() => {
                    handleSave(autosaveEnabled,autosaveInterval,defaultMainNote,defaultReadmeNote,defaultPublic);
                    setIsSaved(true)
                    }}>{isSaved ? <Check size={18}/> : null}{isSaved ? "" : "Save changes"}</button>
        </div>
    );
}