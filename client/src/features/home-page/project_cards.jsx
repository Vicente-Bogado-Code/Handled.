import { useState } from 'react';
import '/src/features/home-page/css/project_cards.css'

export default function ProjectCard({id, name, description, repoLink, status, atDate, onClickHandle}) {
    const statusText = status === "active" ? "Mark as done" : "Mark as active"
    return (
        <div className="projectCard">
            <div className="projectCardHeader">
                <h3 className="projectCardName">{name}</h3>
                <span className={`statusBadge status-${status}`}>{status}</span>
            </div>
            <p className="projectCardDesc">{description}</p>
            <p className="dateOnCards">Created on {atDate}</p>
            <div className='footerOnCards'>
            <a href={repoLink} target="_blank" rel="noreferrer" className="repoLink">
                View repository
            </a>
            <button className={`statusText-${status}`} onClick={() => onClickHandle(id)}>{statusText}</button>

            </div>
        </div>
    );
}
