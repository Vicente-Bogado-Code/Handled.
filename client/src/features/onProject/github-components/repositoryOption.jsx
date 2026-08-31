import { Link } from "lucide-react";
import "./chooseRepo.css"
import { FaGithub } from "react-icons/fa";
import { assingRepoIdToProject } from "../../api/third-party-APIs/github_api";

export default function RepositoryAsOption({name,fullName,httpLink, thisRepoId, setRepositoriesFound}){
    async function handleAssigment(id){
        const r = await assingRepoIdToProject(id)
        if (r.Status === "Repository id set correctly"){
           setRepositoriesFound([])
        }
        else{
            alert(r.Status)
        }
    }
    return(
        <div className="optionMainDiv">
             <FaGithub size={30} color="white"/>
            <div className='optionRepository'>
                    <div className='optionRepositoryData'>
                        <h2 className="nameOnOptionRepository">{name}</h2>
                        <label className="fullNameOnOptionRepository">{fullName}</label>
                        <a className="httpLinkOnOptionRepository" href={httpLink}>{httpLink}</a>
                    </div>
                    <button className="buttonOnOptionRepository" onClick={() => handleAssigment(thisRepoId)}><Link size={18}/>Connect</button>
                </div>
        </div>
    );
}