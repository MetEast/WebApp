import React from 'react';
import Navbar from './components/Navbar';

const Layout: React.FC = ({ children }): JSX.Element => {
    return <>
        {children}
        <Navbar />
    </>
};

export default Layout;