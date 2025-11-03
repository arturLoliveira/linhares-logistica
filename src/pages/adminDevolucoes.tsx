import { useState, useEffect } from 'react';
import styles from '../styles/area-cliente.module.css';


function ListaDevolucoes() {
    
    type Devolucao = {
        id: number;
        nomeCliente: string;
        emailCliente: string;
        numeroNFOriginal: string;
        motivoDevolucao: string | null;
        dataSolicitacao: string;
    };

    const [devolucoes, setDevolucoes] = useState<Devolucao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState('');

    
    useEffect(() => {
        const fetchDevolucoes = async () => {
            const token = localStorage.getItem('admin_token');
            try {
                const response = await fetch('http://localhost:3001/api/admin/devolucoes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar solicitações.');
                }
                
                const data = await response.json();
                setDevolucoes(data);

            } catch (err) {
                setErro((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDevolucoes();
    }, []); 

    if (isLoading) {
        return <p>Carregando solicitações de devolução...</p>;
    }

    if (erro) {
        return <p style={{ color: 'red' }}>{erro}</p>;
    }

    return (
        <div style={{width: '100%'}}>
            <h4>Solicitações de Devolução Pendentes</h4>
            {devolucoes.length === 0 ? (
                <p>Nenhuma solicitação de devolução encontrada.</p>
            ) : (
                <table className={styles.tabelaDevolucoes}>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Cliente</th>
                            <th>Email</th>
                            <th>NF Original</th>
                            <th>Motivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devolucoes.map((dev) => (
                            <tr key={dev.id}>
                                <td>{new Date(dev.dataSolicitacao).toLocaleDateString()}</td>
                                <td>{dev.nomeCliente}</td>
                                <td>{dev.emailCliente}</td>
                                <td>{dev.numeroNFOriginal}</td>
                                <td>{dev.motivoDevolucao || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function AdminDevolucoes() {
    return (
        <div>
            <h2 className={styles.tituloPrincipal}>Solicitações de Devolução</h2>
            <ListaDevolucoes />
        </div>
    );
}
export default AdminDevolucoes;