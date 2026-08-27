import { registerUser } from '../api/authRequests/auth';
import { useEffect, useState } from 'react';
import { Info } from "lucide-react"
export default function RegisterPage({onSwitchMode, onLoginSuccess}){
     const [username,setUsername] = useState("")
     const [password, setPassword] = useState("")
     const [email, setEmail] = useState("")
     const [error,setError] = useState("")
     useEffect(() => {
       function onKeyDown(e){
          if (e.key === "Enter") handleRegistration()
        }
        document.addEventListener("keydown",onKeyDown)
        return () => document.removeEventListener("keydown",onKeyDown)
     }, [username,password,email] )

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
        setError(check);
        return
     }
     const response = await registerUser(username,password,email)
     if (response.Status === "Created"){
          onLoginSuccess(response.username)
     }
     else{
          setError(response.Status)
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

                 <label htmlFor="registerEmail" className='inputsLabels'>Email (optional)</label>
                 <input 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 type="email" id="registerEmail" className='inputs'/>


                 <button id="registerSubmitBtn" onClick={handleRegistration}>Register</button>
                 <button type="button" className="btn" onClick={onSwitchMode}>
                  Already have an account? Log in
                 </button>
            </div>
       </div>
       <p id='handleDataDesc'>
            Both inputs are CASE SENSITIVE. <br /> <br />
            No email required to sign up. Adding one is optional, mostly useful if you ever lose your password <br /> <br />
            Handled is open source! You can check it out here: <a href="https://github.com/Vicente-Bogado-Code/Handled."> Source code</a>.
       </p>
       <div className='errorDiv'>
         {error ? <p> 
          <Info size={16}/>{error}
         </p> : null}
       </div>
    </div>
    );
}