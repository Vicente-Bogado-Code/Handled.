import '/src/features/home-page/css/project_cards.css'

export default function ProjectCard({ name, description, repoLink, status,atDate }) {
    return (
        <div className="projectCard">
            <div className="projectCardHeader">
                <h3 className="projectCardName">{name}</h3>
                <span className={`statusBadge status-${status}`}>{status}</span>
            </div>
            <p className="projectCardDesc">{description}</p>
            <p className="dateOnCards">Created on {atDate}</p>
            <a href={repoLink} target="_blank" rel="noreferrer" className="repoLink">
                View repository
            </a>
        </div>
    );
}
