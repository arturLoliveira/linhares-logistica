import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import styles from '../styles/app.module.css';

function Layout() {
  return (
    <div className={styles.globalContainer}>
      <Header />
      <main className={styles.mainContainer}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;