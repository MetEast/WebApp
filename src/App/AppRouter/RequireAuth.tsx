import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';

export interface IRequireAuthProps {
    children: JSX.Element;
}

const RequireAuth: React.FC<IRequireAuthProps> = ({ children }): JSX.Element => {
    const auth = useRecoilValue(authAtom);

    return auth.isLoggedIn ? children : <Navigate to="/login" />;
};

export default RequireAuth;
