import './style.css';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Login } from './Login';
import { Profile } from './Profile/Profile';
import { Auth } from './types';
import  ProfilePage from '../ProfilePage';
import logo from 'src/logo.svg';

const LS_KEY = 'login-with-metamask:auth';

interface State {
	auth?: Auth;
}

const LoginPage: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
	const [state, setState] = useState<State>({});

	useEffect(() => {
		// Access token is stored in localstorage
		const ls = window.localStorage.getItem(LS_KEY);
		const auth = ls && JSON.parse(ls);
		setState({ auth });
	}, []);

	const handleLoggedIn = (auth: Auth) => {
		localStorage.setItem(LS_KEY, JSON.stringify(auth));
		setState({ auth });
	};

	const handleLoggedOut = () => {
		localStorage.removeItem(LS_KEY);
		setState({ auth: undefined });
	};

	const { auth } = state;

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<h1 className="App-title">
					Welcome to Login with MetaMask Test Page
				</h1>
			</header>
			<div className="App-intro">
				{auth ? (
					<Profile auth={auth} onLoggedOut={handleLoggedOut} />
				) : (
					<Login onLoggedIn={handleLoggedIn} />
				)}
			</div>
		</div>
	);
};

export default LoginPage;