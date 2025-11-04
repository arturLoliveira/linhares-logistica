import { useState } from 'react';
import styles from '../styles/area-cliente.module.css';

function FormAdminCadastraCliente() {
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMensagem('');
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch('https://linhares-logistica-backend.onrender.com/api/admin/clientes/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cpfCnpj, nome, email })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao cadastrar.');
            }

            setMensagem(`Cliente ${data.nome || data.cpfCnpj} cadastrado com sucesso!`);
            
            setCpfCnpj(''); setNome(''); setEmail('');

        } catch (err) {
            setMensagem((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h4>Cadastrar Novo Cliente (Destinatário)</h4>
            <p>Cadastre um cliente e sua senha de acesso ao rastreamento.</p>
            
            <div className={styles.formGroup}>
                <label htmlFor="cliente_cpfcnpj">CPF/CNPJ do Cliente (Destinatário)</label>
                <input type="text" id="cliente_cpfcnpj" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="cliente_nome">Nome do Cliente (Opcional)</label>
                <input type="text" id="cliente_nome" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="cliente_email">Email do Cliente (Opcional)</label>
                <input type="email" id="cliente_email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            
            <button type="submit" className={styles.formButton} disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </button>
            {mensagem && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{mensagem}</p>}
        </form>
    );
}

function AdminClientes() {
    return (
        <div>
            <h2 className={styles.tituloPrincipal}>Gerenciar Clientes</h2>
            <FormAdminCadastraCliente />
        </div>
    );
}
export default AdminClientes;