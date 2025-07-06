import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const navLinks = [
	{ path: '/', label: 'Home', show: 'always' },
	{ path: '/profile', label: 'Profil', show: 'auth' },
	{ path: '/login', label: 'Login', show: 'guest' },
	{ path: '/register', label: 'Registrieren', show: 'guest' },
];

const TopMenu = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isAuth = Boolean(localStorage.getItem('token'));
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!menuOpen) return;
		const handleClick = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(e.target as Node)
			) {
				setMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [menuOpen]);

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/login');
		setMenuOpen(false);
	};

	const handleNavClick = () => setMenuOpen(false);

	return (
		<nav className="w-full h-16 flex items-center justify-between px-6 bg-teal-950/80 border-b border-teal-800 shadow-md relative">
			<span className="text-teal-400 font-bold tracking-widest text-lg">SLIoT</span>
			<button
				ref={buttonRef}
				className="md:hidden flex items-center px-2 py-1 text-teal-200 hover:text-amber-400 focus:outline-none"
				onClick={() => setMenuOpen((open) => !open)}
				aria-label="Toggle menu"
			>
				<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<div
				ref={menuRef}
				className={`flex-col md:flex-row md:flex gap-6 items-center absolute md:static top-16 right-0 bg-teal-950/95 md:bg-transparent w-full md:w-auto z-20 transition-all duration-200 ${menuOpen ? 'flex' : 'hidden md:flex'}`}
			>
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
							className={`text-amber-200 hover:text-amber-400 border-b-2 font-semibold transition-colors px-4 py-2 md:p-0 ${location.pathname === link.path ? ' border-amber-400' : 'border-transparent '}`}
							onClick={handleNavClick}
						>
							{link.label}
						</Link>
					))}
				{isAuth && (
					<button
						onClick={handleLogout}
						className="text-amber-200 hover:text-amber-400 border-b-2 border-transparent font-semibold transition-colors px-4 py-2 md:p-0 ml-0 md:ml-2"
					>
						Logout
					</button>
				)}
			</div>
		</nav>
	);
};

export default TopMenu;