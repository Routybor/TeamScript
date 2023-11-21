import React, { useState, useEffect } from 'react';
import { TextField } from "@mui/material";
import config from '../config';
import { textAPI } from '../ApiCalls';


function TextFieldComponent() {
    const [textFieldValue, setTextFieldValue] = useState('');
    const [pendingText, setPendingText] = useState('');
    const [sendTextEnabled, setSendTextEnabled] = useState(false);

    const receiveText = async () => {
        try {
            const data = await textAPI.receiveTextDB();
            setTextFieldValue(data.text_column);
        } catch (error) {
            console.error('Error in receive function:', error);
        }
    };

    const sendText = async (text) => {
        try {
            await textAPI.sendUpdatedTextDB(text);
            setTextFieldValue(text);
        } catch (error) {
            console.error('Error in receive function:', error);
        }
    };

    useEffect(() => {
        receiveText();
        config.socket.on('updateText', (Text) => {
            if (Text.text_column) {
                setTextFieldValue(Text.text_column);
            }
        });
        return () => {
            config.socket.off('updateText');
        };
    }, []);

    useEffect(() => {
        const sendPendingText = () => {
            if (sendTextEnabled) {
                sendText(pendingText);
            }
        };
        const sendToBackendTimer = setTimeout(sendPendingText, 200);
        return () => {
            clearTimeout(sendToBackendTimer);
        };
    }, [pendingText, sendTextEnabled]);

    const handleInputChange = (event) => {
        setTextFieldValue(event.target.value);
        setPendingText(event.target.value);
        setSendTextEnabled(true);
    };
    return (
        <TextField
            fullWidth
            value={textFieldValue}
            id="standard-basic"
            label="Enter your text here"
            multiline
            onChange={handleInputChange}
        />
    );
}

export default TextFieldComponent;