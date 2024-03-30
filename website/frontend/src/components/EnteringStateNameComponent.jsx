import React from "react";
import CustomInputComponent from "./CustomInputComponent";



const EnteringStateNameComponent = () => {
    return (
        <CustomInputComponent
            defaultValue="statename"
            type="text"
            id="statename"
        // $biginput={true}
        />
    );

}

export default EnteringStateNameComponent;