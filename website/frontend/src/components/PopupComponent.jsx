import React from "react";
import "./PopupComponent.css";

const PopupComponent = ({ active, setActive, children }) => {
    return (
        <div className={active ? 'popup active' : 'popup'} onClick={() => setActive(false)}>
            <div className={active ? 'popup-inner active' : 'popup-inner'} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default PopupComponent;