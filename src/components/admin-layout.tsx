import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/admin-layout.module.css';

import { 
    FaTachometerAlt, FaTruckLoading, FaUndo, 
    FaUsers, FaSignOutAlt 
} from 'react-icons/fa';
import type { JSX } from 'react';


const NavItem = ({ to, icon, label }: { to: string, icon: JSX.Element, label: string }) => {
    return (
        <NavLink 
            to={to} 
            className={({ isActive }) => 
                `${styles.sidebarLink} ${isActive ? styles.active : ''}`
            }
        >
            {icon}
            <span>{label}</span>
        </NavLink>
    );
};

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
    };

    return (
        <div className={styles.adminLayout}>
            <nav className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Painel Admin</h2>
                <div className={styles.sidebarNav}>
                    <NavItem to="/admin/dashboard" icon={<FaTachometerAlt />} label="Dashboard" />
                    <NavItem to="/admin/coletas" icon={<FaTruckLoading />} label="Coletas" />
                    <NavItem to="/admin/devolucoes" icon={<FaUndo />} label="Devoluções" />
                    <NavItem to="/admin/clientes" icon={<FaUsers />} label="Clientes" />
                </div>
                
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <FaSignOutAlt />
                    <span style={{marginLeft: '0.75rem'}}>Sair</span>
                </button>
            </nav>
            <main className={styles.contentArea}>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;