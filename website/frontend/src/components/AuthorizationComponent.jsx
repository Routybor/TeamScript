import React from 'react';
import CustomInputComponent from './CustomInputComponent';
import "./AuthorizationComponent.css";

const AuthorizationComponent = () => {

    return (
        <div className='authorization'>
            <form className="form">
                <CustomInputComponent
                    labelText="Email"
                    id="email"
                    // handleChange={e => setUserName(e.target.value)}
                    type="text"
                />
                <CustomInputComponent
                    labelText="Password"
                    id="password"
                    // handleChange={e => setPassword(e.target.value)}
                    type="password"
                />
                {/* <Button className='logInButton'>LOG IN</Button> */}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AuthorizationComponent;