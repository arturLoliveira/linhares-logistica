import { useState, useEffect } from 'react';
import styles from '../styles/area-cliente.module.css';
import { QRCodeSVG } from 'qrcode.react';

function ListaColetas() {
    type Coleta = {
        id: number;
        numeroEncomenda: string;
        numeroNotaFiscal: string;
        nomeCliente: string;
        cpfCnpjDestinatario: string;
        status: string;
        valorFrete: number;
        driverToken: string; 
    };

    const [coletas, setColetas] = useState<Coleta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('PENDENTE');
    const [qrCodeVisivel, setQrCodeVisivel] = useState<string | null>(null);

    const fetchColetas = async () => {
        const token = localStorage.getItem('admin_token');
        setIsLoading(true);
        setErro('');
        const url = `https://linhares-logistica-backend.onrender.com/api/admin/coletas?status=${filtroStatus}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar coletas.');
            const data = await response.json();
            setColetas(data);
        } catch (err) {
            setErro((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchColetas();
    }, [filtroStatus]);

    const handlePrint = () => {
        window.print();
    };


    return (
        <div style={{width: '100%'}}>
            <h4>Visualizar Coletas</h4>
            
            <div className={styles.filtroContainer}>
                <button className={filtroStatus === 'PENDENTE' ? styles.filtroAtivo : ''} onClick={() => setFiltroStatus('PENDENTE')}>Pendentes</button>
                <button className={filtroStatus === 'COLETADO' ? styles.filtroAtivo : ''} onClick={() => setFiltroStatus('COLETADO')}>Coletados</button>
                <button className={filtroStatus === 'EM_TRANSITO' ? styles.filtroAtivo : ''} onClick={() => setFiltroStatus('EM_TRANSITO')}>Em Trânsito</button>
                <button className={filtroStatus === 'EM_ROTA_ENTREGA' ? styles.filtroAtivo : ''} onClick={() => setFiltroStatus('EM_ROTA_ENTREGA')}>Em Rota</button>
                <button className={filtroStatus === 'CONCLUIDA' ? styles.filtroAtivo : ''} onClick={() => setFiltroStatus('CONCLUIDA')}>Concluídas</button>
                <button className={filtroStatus === '' ? styles.filtroAtivo : ''} onClick={() => setFiltroStatus('')}>Ver Todas</button>
            </div>

            {isLoading && <p>Carregando coletas...</p>}
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            
            {!isLoading && !erro && coletas.length === 0 && (
                <p>Nenhuma coleta encontrada com este status.</p>
            )}

            {!isLoading && !erro && coletas.length > 0 && (
                <table className={styles.tabelaDevolucoes}>
                    <thead>
                        <tr>
                            <th>Encomenda</th>
                            <th>NF</th>
                            <th>Cliente</th>
                            <th>Valor (R$)</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coletas.map((coleta) => (
                            <tr key={coleta.id}>
                                {/* --- CÉLULAS COM data-label ADICIONADO --- */}
                                <td data-label="Encomenda">{coleta.numeroEncomenda}</td>
                                <td data-label="NF">{coleta.numeroNotaFiscal}</td>
                                <td data-label="Cliente">{coleta.nomeCliente}</td>
                                <td data-label="Valor (R$)">{coleta.valorFrete.toFixed(2)}</td>
                                <td data-label="Status">
                                    <span className={`${styles.statusBadge} ${styles[coleta.status.toLowerCase()]}`}>
                                        {coleta.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td data-label="Ações">
                                    <button 
                                        className={styles.botaoAcao}
                                        onClick={() => setQrCodeVisivel(coleta.numeroEncomenda)}
                                    >
                                        Ver QR Code
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            {/* Modal do QR Code */}
            {qrCodeVisivel && (
                <div className={styles.modalOverlay} onClick={() => setQrCodeVisivel(null)}>
                    <div id="printable-qr-code" className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>QR Code para Encomenda {qrCodeVisivel}</h3>
                        <p>Imprima e cole na etiqueta. O motorista deve escanear este código.</p>
                        
                        <QRCodeSVG 
                            value={`https://transportelinhares.vercel.app/driver/update?id=${qrCodeVisivel}&token=${coletas.find(c => c.numeroEncomenda === qrCodeVisivel)?.driverToken}`}
                            size={256}
                            style={{margin: '20px auto', display: 'block'}}
                        />
                        
                        <div className={styles.modalActions}>
                            <button onClick={() => setQrCodeVisivel(null)} className={styles.formButtonSecondary}>Fechar</button>
                            <button onClick={handlePrint} className={styles.formButton}>Imprimir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function FormAdminCadastraColeta() {
    const [nomeCliente, setNomeCliente] = useState('');
    const [emailCliente, setEmailCliente] = useState('');
    const [enderecoColeta, setEnderecoColeta] = useState('');
    const [tipoCarga, setTipoCarga] = useState('');
    const [cpfCnpjRemetente, setCpfCnpjRemetente] = useState('');
    const [cpfCnpjDestinatario, setCpfCnpjDestinatario] = useState('');
    const [numeroNotaFiscal, setNumeroNotaFiscal] = useState('');
    const [valorFrete, setValorFrete] = useState('');
    const [pesoKg, setPesoKg] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');

    const handleSubmitColeta = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMensagem('');
        const dadosColeta = {
            nomeCliente, emailCliente, enderecoColeta, tipoCarga,
            cpfCnpjRemetente, cpfCnpjDestinatario, numeroNotaFiscal,
            valorFrete, pesoKg, dataVencimento
        };
        try {
            const response = await fetch('https://linhares-logistica-backend.onrender.com/api/coletas/solicitar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosColeta),
            });
            if (!response.ok) {
                 const data = await response.json();
                 throw new Error(data.error || 'Falha ao cadastrar a coleta.');
            }
            const novaColeta = await response.json();
            setMensagem(`Coleta cadastrada com sucesso! Nº Encomenda: ${novaColeta.numeroEncomenda}`);
            setNomeCliente(''); setEmailCliente(''); setEnderecoColeta(''); setTipoCarga('');
            setCpfCnpjRemetente(''); setCpfCnpjDestinatario(''); setNumeroNotaFiscal('');
            setValorFrete(''); setPesoKg(''); setDataVencimento('');
        } catch (error) {
            setMensagem((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmitColeta} style={{marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '40px'}}>
            <h4>Cadastrar Nova Coleta</h4>
            <p>O funcionário preenche estes dados quando a carga é recebida.</p>
            
            <div className={styles.formGroup}><label htmlFor="carga_valor">Valor do Frete (R$)</label><input type="number" step="0.01" id="carga_valor" value={valorFrete} onChange={(e) => setValorFrete(e.target.value)} placeholder="Ex: 150.00" required /></div>
            <div className={styles.formGroup}><label htmlFor="nf_coleta">Número da Nota Fiscal</label><input type="text" id="nf_coleta" value={numeroNotaFiscal} onChange={(e) => setNumeroNotaFiscal(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="rem_coleta">CPF/CNPJ Remetente</label><input type="text" id="rem_coleta" value={cpfCnpjRemetente} onChange={(e) => setCpfCnpjRemetente(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="dest_coleta">CPF/CNPJ Destinatário</label><input type="text" id="dest_coleta" value={cpfCnpjDestinatario} onChange={(e) => setCpfCnpjDestinatario(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="nome_coleta">Nome do Cliente (Remetente)</label><input type="text" id="nome_coleta" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="email_coleta">E-mail do Cliente (Remetente)</label><input type="email" id="email_coleta" value={emailCliente} onChange={(e) => setEmailCliente(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="end_coleta">Endereço de Coleta</label><input type="text" id="end_coleta" value={enderecoColeta} onChange={(e) => setEnderecoColeta(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="carga_peso">Peso (Kg) (Opcional)</label><input type="number" step="0.1" id="carga_peso" value={pesoKg} onChange={(e) => setPesoKg(e.target.value)} placeholder="Ex: 25.5"/></div>
             <div className={styles.formGroup}><label htmlFor="carga_vencimento">Data de Vencimento (Opcional)</label><input type="date" id="carga_vencimento" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} /></div>
            <div className={styles.formGroup}><label htmlFor="carga_coleta">Tipo da Carga (Opcional)</label><input type="text" id="carga_coleta" value={tipoCarga} onChange={(e) => setTipoCarga(e.target.value)}/></div>
            
            <button type="submit" className={styles.formButton} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Coleta'}
            </button>
            {mensagem && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{mensagem}</p>}
        </form>
    );
}

// --- (COMPONENTE 3: Formulário para Adicionar Evento de Rastreio) ---
function FormAdminAdicionaHistorico() {
    const [notaFiscal, setNotaFiscal] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [novoStatus, setNovoStatus] = useState('EM_TRANSITO');
    const [mensagem, setMensagem] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddHistorico = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMensagem('');
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch(`https://linhares-logistica-backend.onrender.com/api/admin/coletas/${notaFiscal}/historico`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: novoStatus, localizacao: localizacao })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Falha ao adicionar histórico.');
            }

            setMensagem('Histórico adicionado com sucesso! (A lista será atualizada no próximo recarregamento)');
            setNotaFiscal('');
            setLocalizacao('');

        } catch (err) {
            setMensagem((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleAddHistorico} style={{marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '40px'}}>
            <h4>Adicionar Evento de Rastreio</h4>
            <div className={styles.formGroup}>
                <label htmlFor="nf_status">Número da Nota Fiscal</label>
                <input 
                    type="text" 
                    id="nf_status" 
                    value={notaFiscal}
                    onChange={(e) => setNotaFiscal(e.target.value)}
                    placeholder="NF da coleta que será atualizada"
                    required 
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="localizacao">Localização Atual</label>
                <input 
                    type="text" 
                    id="localizacao" 
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    placeholder="Ex: Centro de Distribuição - BH/MG"
                    required 
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="status">Novo Status</label>
                <select 
                    id="status" 
                    value={novoStatus} 
                    onChange={(e) => setNovoStatus(e.target.value)}
                    className={styles.formInput}
                >
                    <option value="COLETADO">Coletado</option>
                    <option value="EM_TRANSITO">Em Trânsito</option>
                    <option value="EM_ROTA_ENTREGA">Em Rota de Entrega</option>
                    <option value="CONCLUIDA">Concluída</option>
                    <option value="CANCELADA">Cancelada</option>
                </select>
            </div>
            <button type="submit" className={styles.formButton} disabled={isLoading}>
                {isLoading ? 'Adicionando...' : 'Adicionar Evento'}
            </button>
            {mensagem && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{mensagem}</p>}
        </form>
    );
}


// --- (Página Principal) ---
function AdminColetas() {
    return (
        <div style={{width: '100%'}}>
            <h2 className={styles.tituloPrincipal}>Gerenciar Coletas</h2>

            <ListaColetas />
            
            <FormAdminCadastraColeta />
            <FormAdminAdicionaHistorico />
        </div>
    );
}
export default AdminColetas;