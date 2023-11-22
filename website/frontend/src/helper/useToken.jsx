import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const token = localStorage.getItem('token');

        const expiryTime = localStorage.getItem('expiryTime');
        const now = new Date();
        if (now.getTime() > Number(expiryTime) + 60000000) {
            localStorage.removeItem('token');
            localStorage.removeItem('expiryTime');
        }

        return token != null;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken));

        setToken(userToken.token);
    };

    return {
        setToken: saveToken,
        token
    }
}