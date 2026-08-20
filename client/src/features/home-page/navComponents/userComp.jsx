import { useState, useEffect, use } from "react";
import "./css/userSettings.css";
import { User, Lock, Trash2, Info, Save, X, Edit } from "lucide-react";
import { getMyData } from "../../api/getDataRequests/getWhoAmI";
import { changeAccountData } from "../../api/alterRequests/changeAccountData";
import { deleteMyAccount } from "../../api/deleteRequests/deleteAccount";

export default function UserSettings({ username, setUsername, onLogout, setDesc }) {
  const [isEditing, setIsEditing] = useState(false);
  const [dbEmail, setDbEMail] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  let [dbDesc, setDbDesc] = useState(null);
  const [inputedEmail, setInputedEmail] = useState("");
  const [inputedUsername, setInputedUsername] = useState("");
  const [inputedDesc, setInputedDesc] = useState("")
  let [error, setError] = useState(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    async function getMe() {
      const r = await getMyData();
      if (r.Status === "Data retrieved") {
        setDbUser(r.Me.username);
        setDbEMail(r.Me.email);
        setDbDesc(r.Me.description)
        setInputedDesc(r.Me.description)
        setInputedEmail(r.Me.email)
        setInputedUsername(r.Me.username)
      } else {
        alert("Server failed, try again later.");
      }
    }
    getMe();
  }, []);

  async function handleChangeData(newName, newEmail,newDesc) {
    await changeAccountData(newName, newEmail,newDesc);
  }

  function verifyInput(username, email) {
    if (email.length === 0){return null}
    if (username === " ") {
      return "Username can't be empty";
    }
    if (username.length < 4) {
      return "Username must be at least 4 characters";
    }
    if (username.length === 20) {
      return "Username can't be longer than 20 characters";
    }
    if (username.includes(" ")) {
      return "Username can't contain spaces";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return "Email is invalid";
    }
    if(email.length > 100){return "Email is to long"}
    return null;
  }
  return (
    <div className="userSettingsMain">
      <div className="settingsHeader">
        <h2>Manage account</h2>
        <p>Manage your account and preferences.</p>
      </div>

      <section className="userSettingsSection">
        <div className="userSettingsSectionHeader">
          <User size={20} />
          <div>
            <h2>Profile</h2>
            <p>Your account data.</p>
          </div>
        </div>

        <div className="profileSettingsContent">
          <div className="avatar">
            <div className="settingsAvatar">
              <User size={42} />
            </div>
          </div>
          <div className="profileFields">
            <div className="settingsField">
              <label>Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={inputedUsername}
                  maxLength={20}
                  onChange={(ev) => setInputedUsername(ev.target.value)}
                />
              ) : (
                <input type="text" className="inputPh" readOnly value={username} />
              )}
            </div>

            <div className="settingsField">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="text"
                  value={inputedEmail}
                  onChange={(ev) => setInputedEmail(ev.target.value)}
                />
              ) : (
                <input type="text" className="inputPh" value={dbEmail ? dbEmail : ""} readOnly />
              )}
            </div>
             <div className="settingsField">
              <label>Description</label>
              {isEditing ? (
                <textarea
                  className="descInput"
                  style={{color:"white"}}
                  maxLength={100}
                  type="text"
                  value={inputedDesc}
                  onChange={(ev) => setInputedDesc(ev.target.value)}
                />
              ) : (
                <textarea type="text" className="descInput" value={dbDesc ?? "No description"} readOnly />
              )}
            </div>
          </div>
        </div>
        <div>
          {isEditing ? (
            <div className="changeDataBtnsDiv">
              <button
                className="settingsButtonSave"
                onClick={() => {
                  console.log(inputedUsername,inputedEmail)
                  const e = verifyInput(inputedUsername, inputedEmail);
                  if (e === null) {
                    handleChangeData(inputedUsername, inputedEmail,inputedDesc);
                    setDbDesc(inputedDesc)
                    setUsername(inputedUsername)
                    setDesc(inputedDesc)
                    setIsEditing(false);
                    setError(null);
                    return;
                  }
                  setError(e);
                }}
              >
                <Save size={16} />
              </button>
              <button
                className="settingsButtonCancel"
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }}
              >
                <X size={16} />
              </button>
              {error ? (
                <p className="errorText">
                  <Info size={16} />
                  {error}
                </p>
              ) : null}
            </div>
          ) : (
            <button
              className="settingsButton"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} />
            </button>
          )}
        </div>
      </section>

      <section className="userSettingsSection dangerSection">
        <div className="userSettingsSectionHeader">
          <Trash2 size={20} className="trashCan" />
          <div>
            <h2>Danger zone</h2>
            <p>Actions here can permanently affect your account.</p>
          </div>
        </div>
        <div className="settingsRowExcep">
          <div>
            <h3>Delete account</h3>
            <p>Permanently delete your account and all associated data.</p>
          </div>
          <button
            className="dangerButton"
            onClick={() => setIsDeletingAccount(true)}
          >
            Delete account
          </button>
        </div>

        {isDeletingAccount ? (
          <div className="accountDeleteConfirmDiv">
            <p className="accountDeleteWarningText">
                This action is permanent and cannot be undone.
            </p>
            <div className="accountDeleteBtnRow">
              <button className="confirmDeleteAccountBtn" onClick={() => {deleteMyAccount(); onLogout()}}>
                Yes, delete my account
              </button>
              <button
                className="cancelDeleteAccountBtn"
                onClick={() => setIsDeletingAccount(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
