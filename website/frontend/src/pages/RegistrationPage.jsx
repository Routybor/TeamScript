import React, {useState} from "react";
import CustomInputComponent from '../components/CustomInputComponent';
import { Button } from "@mui/material";
import config from '../config';

const RegistrationPage = ({setToken}) => {
        const [username, setUserName] = useState();
        const [email, setEmail] = useState();
        const [password, setPassword] = useState();

        async function loginUser(credentials) {
            try {
                const response = await fetch(`${config.host}/auth/addNewUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
                });
        
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error logging in:', error);
                throw error;
            }
        } 

        const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            email,
            password
        });

        setToken(token);
        const now = new Date();
        localStorage.setItem('expiryTime', JSON.stringify(now.getTime()));
        window.location.reload();
        window.location.assign(window.location.origin);
    }
    
    
    return (
        <div className="registration">
            <div className="topTriangle" style={{}}></div>
            <table>
                <tr>
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="40" height="100" style={{ marginLeft: "130px", marginTop: "-15px" }}><path d="M23,15h-.667c-.25,0-.498,.019-.745,.057l-7.046-5.284,1.688-1.616c.399-.382,.413-1.016,.031-1.414-.383-.399-1.017-.412-1.414-.031l-4.173,3.995c-.208,.208-.491,.315-.788,.29-.298-.024-.56-.175-.739-.425-.274-.38-.19-.975,.168-1.334l4.703-4.429c.891-.837,2.284-1.042,3.374-.495l2.316,1.158c.69,.345,1.464,.527,2.235,.527h1.056c.553,0,1-.447,1-1s-.447-1-1-1h-1.056c-.463,0-.928-.109-1.342-.316l-2.314-1.158c-1.824-.913-4.153-.574-5.641,.828l-.618,.582-.7-.638c-.919-.837-2.109-1.298-3.39-1.298-.771,0-1.54,.182-2.227,.525l-2.314,1.158c-.415,.207-.88,.316-1.343,.316H1c-.553,0-1,.447-1,1s.447,1,1,1h1.056c.771,0,1.545-.183,2.236-.527l2.316-1.158c1.022-.514,2.458-.375,3.374,.462l.587,.535-2.646,2.492c-1.073,1.072-1.244,2.767-.398,3.938,.52,.723,1.553,1.259,2.444,1.259,.793,0,1.554-.312,2.104-.863l1.006-.963,6.346,4.759c-.031,.022-6.198,4.646-6.198,4.646-.723,.562-1.732,.562-2.47-.011l-6.091-4.568c-.859-.645-1.925-1-3-1h-.667c-.553,0-1,.447-1,1s.447,1,1,1h.667c.645,0,1.284,.213,1.8,.6l6.077,4.558c.725,.564,1.594,.846,2.461,.846,.862,0,1.723-.279,2.437-.835l6.093-4.568c.515-.387,1.154-.6,1.799-.6h.667c.553,0,1-.447,1-1s-.447-1-1-1Z" /></svg>
                    </td>
                    <td>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '1000px', marginTop: '-25px' }}>TeamScript</p>
                    </td>
                </tr>
            </table>
            <h1>Create Account</h1>

            <CustomInputComponent
                labelText="Name"
                id="name"
                formControlProps={{
                    fullWidth: true
                }}
                handleChange={e => setUserName(e.target.value)}
                type="text"
            />

            <CustomInputComponent
                labelText="Email"
                id="email"
                formControlProps={{
                    fullWidth: true
                }}
                handleChange={e => setEmail(e.target.value)}
                type="text"
            />  

            <CustomInputComponent
                labelText="Password"
                id="password"
                formControlProps={{
                    fullWidth: true
                }}
                handleChange={e => setPassword(e.target.value)}
                type="text"
            />

            <Button onClick = {handleSubmit} style={{marginTop: '3%'}}>Sign Up</Button>

            <div className="bottomTriangle"></div>
        </div>
    );
}

export default RegistrationPage;