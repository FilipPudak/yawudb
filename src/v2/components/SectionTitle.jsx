import React from "react";
import { ReactComponent as Logo } from "../../svgs/underworlds_logo.svg";

function SectionTitle({ title, ...rest }) {
    return (
        <div className={`flex items-center text-gray-500 ${rest.className}`}>
            <hr className="flex-grow" />
            <Logo className="mx-2 fill-current" />
            <h3>{title}</h3>
            <Logo className="mx-2 fill-current" />
            <hr className="flex-grow" />
        </div>
    );
}

export default React.memo(SectionTitle);
