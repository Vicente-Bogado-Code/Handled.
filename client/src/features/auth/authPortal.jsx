import '/src/features/auth/css/registerPage.css'
import '/src/features/auth/css/authPortalMain.css'
import '/src/features/auth/css/loginPage.css'
import RegisterPage from './registerPage';
import LoginPage from './loginPage';
import { use, useState } from 'react';

export default function AuthMainPortal() {
    const [mode, setMode] = useState('Register')
    function toggleMode(){
        setMode(prev => prev === 'Register' ? 'Login' : "Register")
    }
  return (
  <main className="mainRegisterDiv">
    <div className="registerContextDiv">
        <div className="text">
            <h1 className="builtBcs">Built because I kept losing track.</h1>
            <p className="littleDescription">Commits, notes, everything — actually organized, for once.</p>
            <p className="bigDescription">
                You know the feeling. You open your editor after a few days away
                and have no idea what you were doing, why that function is
                half-written, or what that commit from Tuesday was even supposed
                to fix. Bugs pile up in random text files, notes live in three
                different apps, and your Git history reads like a stranger wrote
                it. Handled ties your commits, notes, bugs and everything together in one
                place — so picking a project back up doesn't feel like archaeology.
            </p>
        </div>
    </div>
    {mode === 'Login' ?
     <LoginPage onSwitchMode={toggleMode}/> :
     <RegisterPage onSwitchMode={toggleMode}/>}
  </main>
  );
}