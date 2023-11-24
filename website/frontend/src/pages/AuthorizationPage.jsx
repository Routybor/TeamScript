import React from "react";

import AuthorizationComponent from "../components/AuthorizationComponent";

const AuthorizationPage = ({ setToken }) => {
    return (
        <AuthorizationComponent setToken={setToken}>

        </AuthorizationComponent>
    );
}

export default AuthorizationPage;