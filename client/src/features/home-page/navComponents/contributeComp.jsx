import "./css/contributeComp.css"
import { Mail } from "lucide-react"
import { FaGithub } from "react-icons/fa"

export default function Contribute(){
    return (
        <section className="contributeMain">
            <div className="contributeHeader">
                <h2>Help make <span className="toAccent">handled</span> better</h2>
                <p>
                    I genuinely appreciate when people point out bugs or help
                    improve the software. Feel free to reach out or contribute directly.
                </p>
            </div>

            <div className="contributeLinks">

            <a
                href="https://github.com/Vicente-Bogado-Code/Handled./blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="contributeLink"
            >
                <FaGithub size={18} />
                Contribute on GitHub
            </a>

            <a
                href="mailto:bogadovincenzo4@gmail.com"
                className="contributeLink"
            >
                <Mail size={18} />
                Contact me
            </a>
           </div>
           <p className="myEmail">bogadovincenzo4 <span className="toAccent">[at]</span> gmail <span className="toAccent">[dot]</span> com</p>
    </section>
    );
}