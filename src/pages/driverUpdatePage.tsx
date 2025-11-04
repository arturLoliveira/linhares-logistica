import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import styles from '../styles/area-cliente.module.css'; 
function DriverUpdatePage() {
    const [searchParams] = useSearchParams();

    const numeroEncomenda = searchParams.get('id');
    const token = searchParams.get('token');

    const [localizacao, setLocalizacao] = useState('');
    const [status, setStatus] = useState('COLETADO');
    const [mensagem, setMensagem] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErro('');
        setMensagem('');

        try {
            const response = await fetch('${import.meta.env.VITE_API_URL}/api/driver/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numeroEncomenda,
                    token,
                    status,
                    localizacao
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao atualizar.');
            }

            setMensagem('Status atualizado com sucesso!');

        } catch (err) {
            setErro((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!numeroEncomenda || !token) {
        return (
            <div className={styles.areaCliente}>
                <h2 className={styles.tituloPrincipal}>Erro</h2>
                <p style={{color: 'red', textAlign: 'center'}}>Link inválido. Por favor, escaneie o QR Code novamente.</p>
            </div>
        );
    }
    if (mensagem) {
         return (
            <div className={styles.areaCliente}>
                <h2 className={styles.tituloPrincipal}>Sucesso!</h2>
                <p style={{color: 'green', textAlign: 'center'}}>{mensagem}</p>
            </div>
        );
    }

    return (
        <div className={styles.areaCliente}>
            <h2 className={styles.tituloPrincipal}>Atualizar Encomenda</h2>
            <h3 style={{textAlign: 'center', marginTop: '-1rem'}}>Nº: {numeroEncomenda}</h3>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="localizacao">Sua Localização Atual</label>
                    <input 
                        type="text" 
                        id="localizacao" 
                        value={localizacao}
                        onChange={(e) => setLocalizacao(e.target.value)}
                        placeholder="Ex: Sede Ouro Branco"
                        required 
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="status">Marcar como:</label>
                    <select 
                        id="status" 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                        className={styles.formInput}
                    >
                        <option value="COLETADO">Coletado (Retirado no cliente)</option>
                        <option value="EM_TRANSITO">Em Trânsito (Chegou no CD)</option>
                        <option value="EM_ROTA_ENTREGA">Em Rota de Entrega (Saiu para o destino)</option>
                        <option value="CONCLUIDA">Entregue</option>
                    </select>
                </div>
                <button type="submit" className={styles.formButton} disabled={isLoading}>
                    {isLoading ? 'Atualizando...' : 'Atualizar Status'}
                </button>
                {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}
            </form>
        </div>
    );
}
export default DriverUpdatePage;