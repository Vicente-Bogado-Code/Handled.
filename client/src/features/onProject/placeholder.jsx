import './css/onProject.css'
import { SearchX } from "lucide-react"

export default function MainPlaceHolder() {
    return (
        <div className="placeHolderDiv">
            <div className="placeHolderContent">
                <div className="placeHolderIcon">
                    <SearchX size={32} strokeWidth={1.7} />
                </div>

                <h3 className="placeHolderTitle">
                    No note selected
                </h3>

                <p className="placeHolderText">
                    Choose a note from the sidebar to start.
                </p>
            </div>
        </div>
    );
}