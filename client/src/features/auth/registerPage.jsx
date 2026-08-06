import { registerUser } from './api/auth';
import { useState } from 'react';

export default function RegisterPage({onSwitchMode, onLoginSuccess}){
     const [username,setUsername] = useState("")
     const [password, setPassword] = useState("")
     const [email, setEmail] = useState("")
     const [error,setError] = useState("")

     function validateRegister(username, password, email) {
     if (username.includes(" ")) { return "Username cannot contain spaces"; }
     if (username.length < 4) { return "Username must have at least 4 characters"; }
     if (password.includes(" ")) { return "Password cannot contain spaces"; }
     if (password.length < 5) { return "Password must have at least 5 characters"; }
     if (!/\d/.test(password)) { return "Password must contain at least one number"; }
     if (email !== "" && !/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) { return "Invalid email format"; }
     return null;
    }
     async function handleRegistration() {
     const check = validateRegister(username,password,email)
     if (check){
        setError(`»${check}`);
        return
     }
     const response = await registerUser(username,password,email)
     if (response.Status === "Created"){
          onLoginSuccess(response)
     }
     }

    return(
         <div className="registerDataDiv">
        <h2 className='strKpngTrack'>Start keeping <span id='track'>track</span></h2>
       <div className="registerForm">
            <div className="registerDiv">

                <label htmlFor="registerUsername" className='inputsLabels'>Create an username</label>
                 <input  
                 value={username}
                 onChange={(e) => setUsername(e.target.value)} 
                 type="text" id="registerUsername" className='inputs'
                 />
                 <label htmlFor="registerPassword" className='inputsLabels'>Create a password</label>
                 <input 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 type="password" id="registerPassword" className='inputs'/>

                 <label htmlFor="registerEmail" className='inputsLabels'>Type your email (optional)</label>
                 <input 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 type="email" id="registerEmail" className='inputs'/>


                 <button id="registerSubmitBtn" onClick={handleRegistration} >Register</button>
                 <button type="button" className="btn" onClick={onSwitchMode}>
                  Already have an account? Log in
                 </button>
            </div>
       </div>
       <p id='handleDataDesc'>
            Both inputs are CASE SENSITIVE. <br />
            Just a username. That's it.
            Handled only needs a username to give you your own space for your projects — no email required to sign up. Adding one is optional, mostly useful if you ever lose your password, but that's entirely up to you.
       </p>
       <div className='errorDiv'>
         <p> 
          {error}
         </p>
       </div>
    </div>
    );
}
