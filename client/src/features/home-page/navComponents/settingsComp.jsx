import { useState } from 'react';
import './css/settingsComp.css';
import { Save, Clock, FileText, Info } from 'lucide-react';

export default function SettingsComp() {
    const [theme, setTheme] = useState("system");
    const [autosaveEnabled, setAutosaveEnabled] = useState(true);
    const [autosaveInterval, setAutosaveInterval] = useState(10);
    const [defaultMainNote, setDefaultMainNote] = useState(true);
    const [defaultReadmeNote, setDefaultReadmeNote] = useState(true);
    const [defaultPublic, setDefaultPublic] = useState(false);

    return (
        <div className="appSettingsMain">

            <section className="settingsSection">
                <div className="settingsSectionHeader">
                    <Save size={20} />
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
                        onClick={() => setAutosaveEnabled(!autosaveEnabled)}
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
                                onClick={() => setAutosaveInterval(10)}
                            >
                                <Clock size={14} /> 10s
                            </button>
                            <button
                                className={autosaveInterval === 30 ? "intervalOptionActive" : "intervalOption"}
                                onClick={() => setAutosaveInterval(30)}
                            >
                                <Clock size={14} /> 30s
                            </button>
                            <button
                                className={autosaveInterval === 60 ? "intervalOptionActive" : "intervalOption"}
                                onClick={() => setAutosaveInterval(60)}
                            >
                                <Clock size={14} /> 1m
                            </button>
                        </div>
                    </div>
                ) : null}
            </section>

            <section className="settingsSection">
                <div className="settingsSectionHeader">
                    <FileText size={20} />
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
                        onClick={() => setDefaultMainNote(!defaultMainNote)}
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
                        onClick={() => setDefaultReadmeNote(!defaultReadmeNote)}
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
                        onClick={() => setDefaultPublic(!defaultPublic)}
                    >
                        <span className="toggleKnob" />
                    </button>
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

        </div>
    );
}