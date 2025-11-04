import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/area-cliente.module.css'; 

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        try {
            const response = await fetch('${import.meta.env.VITE_API_URL}/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha no login');
            }

            localStorage.setItem('admin_token', data.token);

            navigate('/admin/dashboard');

        } catch (err) {
            setErro((err as Error).message);
        }
    };

    return (
        <div className={styles.areaCliente}> 
            <h2 className={styles.tituloPrincipal}>Login do Administrador</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="senha">Senha</label>
                    <input 
                        type="password" 
                        id="senha" 
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.formButton}>Entrar</button>
                {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}
            </form>
        </div>
    );
}

export default AdminLogin;