import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
	{ path: '/', label: 'Home', show: 'always' },
	{ path: '/profile', label: 'Profil', show: 'auth' },
	{ path: '/login', label: 'Login', show: 'guest' },
	{ path: '/register', label: 'Registrieren', show: 'guest' },
];

const TopMenu = () => {
	const navigate = useNavigate();
	const isAuth = Boolean(localStorage.getItem('token'));

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	return (
		<nav className="w-full flex items-center justify-between px-6 py-3 bg-teal-950/80 border-b border-teal-800 shadow-md">
			<div className="flex gap-6">
				{navLinks
					.filter(
						(link) =>
							link.show === 'always' ||
							(link.show === 'auth' && isAuth) ||
							(link.show === 'guest' && !isAuth)
					)
					.map((link) => (
						<Link
							key={link.path}
							to={link.path}
							className="text-teal-200 hover:text-amber-400 font-semibold transition-colors"
						>
							{link.label}
						</Link>
					))}
				{isAuth && (
					<button
						onClick={handleLogout}
						className="text-teal-200 hover:text-amber-400 font-semibold transition-colors ml-2"
					>
						Logout
					</button>
				)}
			</div>
			<span className="text-teal-400 font-bold tracking-widest">SLIoT</span>
		</nav>
	);
};

export default TopMenu;