import { Link } from "lucide-react";
import "./chooseRepo.css"
import { FaGithub } from "react-icons/fa";

export default function RepositoryAsOption({name,fullName,httpLink}){
    return(
        <div className="optionMainDiv">
             <FaGithub size={30} color="white"/>
            <div className='optionRepository'>
                    <div className='optionRepositoryData'>
                        <h2 className="nameOnOptionRepository">{name}</h2>
                        <label className="fullNameOnOptionRepository">{fullName}</label>
                        <a className="httpLinkOnOptionRepository">{httpLink}</a>
                    </div>
                    <button className="buttonOnOptionRepository"><Link size={18}/>Connect</button>
                </div>
        </div>
    );
}