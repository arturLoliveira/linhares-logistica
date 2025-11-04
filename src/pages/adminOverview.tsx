import { useState, useEffect } from 'react';
import styles from '../styles/area-cliente.module.css'; 


type StatsData = {
    coletasHoje: number;
    devolucoesPendentes: number;
    coletasEntregues: number; 
};

function AdminOverview() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('admin_token');
            setIsLoading(true);
            setError('');

            try {
                const response = await fetch('https://linhares-logistica-backend.onrender.com/api/admin/stats', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar estatísticas.');
                }
                
                const data: StatsData = await response.json();
                setStats(data);

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []); 

    return (
        <div>
            <h2 className={styles.tituloPrincipal}>Dashboard</h2>
            <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                Seja bem-vindo ao painel de administração.
            </p>
            <div className={styles.statsContainer}>
                {isLoading ? (
                    <p>Carregando estatísticas...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : stats ? (
                    <>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.coletasHoje}</span>
                            <span className={styles.statLabel}>Coletas Cadastradas Hoje</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.devolucoesPendentes}</span>
                            <span className={styles.statLabel}>Devoluções Pendentes</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.coletasEntregues}</span>
                            <span className={styles.statLabel}>Coletas Entregues (Total)</span>
                        </div>
                    </>
                ) : null}
            </div>
            
            <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>
                Use o menu ao lado para gerenciar as operações do sistema.
            </p>
        </div>
    );
}

export default AdminOverview;