import { TextField } from "@mui/material";

function TextFieldComponent(props) {
  return (
    <TextField
      fullWidth
      value={props.value}
      id="standard-basic"
      label="Enter your text here"
      multiline
      onChange={props.updateData}
    />
  );
}

export default TextFieldComponent;