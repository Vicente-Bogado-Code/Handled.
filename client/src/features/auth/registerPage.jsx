export default function RegisterPage({onSwitchMode}){
    return(
         <div className="registerDataDiv">
        <h2 className='strKpngTrack'>Start <span id='track'>handling</span> it</h2>
       <form className="registerForm">
            <div className="registerDiv">
                <label htmlFor="registerUsername" className='inputsLabels'>Create an username</label>
                 <input type="text" id="registerUsername" className='inputs'/>

                 <label htmlFor="registerPassword" className='inputsLabels'>Create a password</label>
                 <input type="password" id="registerPassword" className='inputs'/>

                 <label htmlFor="registerEmail" className='inputsLabels'>Type your email (optional)</label>
                 <input type="email" id="registerEmail" className='inputs'/>
                 <button type="submit" id="registerSubmitBtn">Register</button>
                 <button type="button" className="btn" onClick={onSwitchMode}>
                  Already have an account? Log in
                 </button>
            </div>
       </form>
       <p id='handleDataDesc'>
            Just a username. That's it.
            Handled only needs a username to give you your own space for your projects — no email required to sign up. Adding one is optional, mostly useful if you ever lose your password, but that's entirely up to you. There's no data collection here beyond what you actually put in — no tracking or selling anything. Handled was built to help developers.
       </p>
    </div>
    );
}
