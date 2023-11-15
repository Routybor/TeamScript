import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import "./CustomInputComponent.css";



const CustomInputComponent = (props) => {

    return (
        <div className="inputField">
            <FormControl fullWidth>
                {props.labelText !== undefined ? (
                    <InputLabel
                    >
                        {props.labelText}
                    </InputLabel>
                ) : null}
                <Input
                    id={props.id}
                    // onChange={props.handleChange}
                    type={props.type}
                />
            </FormControl>
        </div>
    );
}

export default CustomInputComponent;