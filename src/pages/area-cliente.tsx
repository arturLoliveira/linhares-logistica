import { useState } from 'react';
import styles from '../styles/area-cliente.module.css'; 
import { FaTruck, FaFileInvoice, FaPrint, FaBoxOpen, FaUndo } from 'react-icons/fa';

const handleDownloadPDF = async (url: string, filename: string, setLoading: (b: boolean) => void, setMensagem: (s: string) => void) => {
    setLoading(true);
    setMensagem('');
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Falha ao buscar o documento.');
        }
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        setMensagem('Download iniciado com sucesso!');
    } catch (error) {
        setMensagem((error as Error).message);
    } finally {
        setLoading(false);
    }
};

function FormRastreioDestinatario() {
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [numeroEncomenda, setNumeroEncomenda] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const [resultado, setResultado] = useState<any | null>(null);
    const [erro, setErro] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResultado(null);
        setErro('');
        try {
            const res = await fetch('https://linhares-logistica-backend.onrender.com/api/rastreamento/destinatario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numeroEncomenda, cpfCnpj }) 
            });
            if (!res.ok) {
                 const data = await res.json();
                 throw new Error(data.error || 'Coleta não encontrada.');
            }
            const data = await res.json();
            setResultado(data);
        } catch (err) {
            setErro((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p>Acesse com seu CNPJ/CPF e Número da Encomenda.</p>
             <div className={styles.formGroup}>
                <label htmlFor="num_encomenda_dest">Número da Encomenda</label>
                <input type="text" id="num_encomenda_dest" value={numeroEncomenda} onChange={e => setNumeroEncomenda(e.target.value)} placeholder="Ex: OC-1001" required />
            </div>
             <div className={styles.formGroup}>
                <label htmlFor="cnpj_dest">Seu CNPJ/CPF (Destinatário)</label>
                <input type="text" id="cnpj_dest" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} required />
            </div>
            <button type="submit" className={styles.formButton} disabled={isLoading}>{isLoading ? "Buscando..." : "Acessar"}</button>
            
            {erro && <p style={{ color: 'red', marginTop: '1rem' }}>{erro}</p>}
            
            {resultado && (
                <div className={styles.rastreioResultado}>
                    <div className={styles.statusAtual}><strong>Status Atual:</strong> {resultado.status.replace('_', ' ')}</div>
                    {resultado.historico && resultado.historico.length > 0 && (
                         <div className={styles.localAtual}><strong>Localização:</strong> {resultado.historico[0].localizacao}</div>
                    )}
                    <h5 className={styles.historicoTitulo}>Histórico de Rastreio</h5>
                    <ul className={styles.historicoLista}>
                        <hr />
                        {resultado.historico && resultado.historico.map((evento: any) => (
                             <li key={evento.id} className={styles.historicoItem}>
                                <hr />
                                <div className={styles.historicoData}>{new Date(evento.data).toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</div>
                                <div className={styles.historicoStatus}>{evento.status.replace('_', ' ')}</div>
                                <div className={styles.historicoLocal}>{evento.localizacao}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
}

function FormColetaEntrega() {
    const [nomeCliente, setNomeCliente] = useState('');
    const [emailCliente, setEmailCliente] = useState('');
    const [enderecoColeta, setEnderecoColeta] = useState('');
    const [tipoCarga, setTipoCarga] = useState('');
    const [cpfCnpjRemetente, setCpfCnpjRemetente] = useState('');
    const [cpfCnpjDestinatario, setCpfCnpjDestinatario] = useState('');
    const [numeroNotaFiscal, setNumeroNotaFiscal] = useState('');
    const [valorFrete, setValorFrete] = useState('');
    const [pesoKg, setPesoKg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');

    const handleSubmitColeta = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMensagem('');
        const dadosColeta = {
            nomeCliente, emailCliente, enderecoColeta, tipoCarga,
            cpfCnpjRemetente, cpfCnpjDestinatario, numeroNotaFiscal,
            valorFrete: valorFrete,
            pesoKg: pesoKg,
            dataVencimento: null
        };
        try {
            const response = await fetch('https://linhares-logistica-backend.onrender.com/api/coletas/solicitar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosColeta),
            });
            if (!response.ok) {
                 const data = await response.json();
                 throw new Error(data.error || 'Falha ao solicitar a coleta.');
            }
            const novaColeta = await response.json();
            setMensagem(`Coleta solicitada com sucesso! Seu N° de Encomenda é: ${novaColeta.numeroEncomenda}`);
            setNomeCliente(''); setEmailCliente(''); setEnderecoColeta(''); setTipoCarga('');
            setCpfCnpjRemetente(''); setCpfCnpjDestinatario(''); setNumeroNotaFiscal('');
            setValorFrete(''); setPesoKg('');
        } catch (error) {
            setMensagem((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmitColeta}>
            <p>Após o preenchimento do formulário será gerado o número da coleta.</p>
            <div className={styles.formGroup}><label htmlFor="carga_valor">Valor do Frete (R$) (Conforme cotação)</label><input type="number" step="0.01" id="carga_valor" value={valorFrete} onChange={(e) => setValorFrete(e.target.value)} placeholder="Ex: 150.00" required /></div>
            <div className={styles.formGroup}><label htmlFor="carga_peso">Peso (Kg) (Opcional)</label><input type="number" step="0.1" id="carga_peso" value={pesoKg} onChange={(e) => setPesoKg(e.target.value)} placeholder="Ex: 25.5"/></div>
            <div className={styles.formGroup}><label htmlFor="nome_coleta">Seu Nome</label><input type="text" id="nome_coleta" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="email_coleta">Seu E-mail</label><input type="email" id="email_coleta" value={emailCliente} onChange={(e) => setEmailCliente(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="end_coleta">Endereço de Coleta</label><input type="text" id="end_coleta" value={enderecoColeta} onChange={(e) => setEnderecoColeta(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="nf_coleta">Número da Nota Fiscal</label><input type="text" id="nf_coleta" value={numeroNotaFiscal} onChange={(e) => setNumeroNotaFiscal(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="rem_coleta">Seu CPF/CNPJ (Remetente)</label><input type="text" id="rem_coleta" value={cpfCnpjRemetente} onChange={(e) => setCpfCnpjRemetente(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="dest_coleta">CPF/CNPJ do Destinatário</label><input type="text" id="dest_coleta" value={cpfCnpjDestinatario} onChange={(e) => setCpfCnpjDestinatario(e.target.value)} required/></div>
            <div className={styles.formGroup}><label htmlFor="carga_coleta">Tipo da Carga (opcional)</label><input type="text" id="carga_coleta" value={tipoCarga} onChange={(e) => setTipoCarga(e.target.value)}/></div>
            <button type="submit" className={styles.formButton} disabled={isLoading}>{isLoading ? 'Enviando...' : 'Solicitar Coleta'}</button>
            {mensagem && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{mensagem}</p>}
        </form>
    );
}

function FormColetaDevolucao() {
    const [nomeCliente, setNomeCliente] = useState('');
    const [emailCliente, setEmailCliente] = useState('');
    const [numeroNFOriginal, setNumeroNFOriginal] = useState('');
    const [motivoDevolucao, setMotivoDevolucao] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMensagem('');
        try {
            const res = await fetch('https://linhares-logistica-backend.onrender.com/api/devolucoes/solicitar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nomeCliente, emailCliente, numeroNFOriginal, motivoDevolucao })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Falha ao enviar solicitação.');
            }
            setMensagem('Solicitação de devolução enviada! Você receberá um e-mail de confirmação.');
            setNomeCliente(''); setEmailCliente(''); setNumeroNFOriginal(''); setMotivoDevolucao('');
        } catch (err) {
            setMensagem((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p>Após o preenchimento, você receberá um e-mail de confirmação. O prazo é de até 3 dias.</p>
            <div className={styles.formGroup}><label htmlFor="nome_dev">Seu Nome</label><input type="text" id="nome_dev" value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} required /></div>
            <div className={styles.formGroup}><label htmlFor="email_dev">Seu E-mail</label><input type="email" id="email_dev" value={emailCliente} onChange={e => setEmailCliente(e.target.value)} required /></div>
            <div className={styles.formGroup}><label htmlFor="nf_dev">Nº da Nota Fiscal Original</label><input type="text" id="nf_dev" value={numeroNFOriginal} onChange={e => setNumeroNFOriginal(e.target.value)} required /></div>
            <div className={styles.formGroup}><label htmlFor="motivo_dev">Motivo da Devolução (opcional)</label><input type="text" id="motivo_dev" value={motivoDevolucao} onChange={e => setMotivoDevolucao(e.target.value)} /></div>
            <button type="submit" className={styles.formButton} disabled={isLoading}>{isLoading ? 'Enviando...' : 'Solicitar Devolução'}</button>
            {mensagem && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{mensagem}</p>}
        </form>
    );
}

function FormEmissaoFatura() {
    const [notaFiscal, setNotaFiscal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = 'https://linhares-logistica-backend.onrender.com/api/fatura/${notaFiscal}';
        handleDownloadPDF(url, `fatura_${notaFiscal}.pdf`, setIsLoading, setMensagem);
    };

    return (
        <form onSubmit={handleSubmit}>
            <p>Preencha as informações para gerar sua fatura/boleto de forma on-line.</p>
            <div className={styles.formGroup}>
                <label htmlFor="nf_fatura">Número da Nota Fiscal</label>
                <input type="text" id="nf_fatura" value={notaFiscal} onChange={e => setNotaFiscal(e.target.value)} required />
            </div>
            <button type="submit" className={styles.formButton} disabled={isLoading}>
                {isLoading ? 'Gerando...' : 'Gerar Fatura'}
            </button>
            {mensagem && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{mensagem}</p>}
        </form>
    );
}

function FormImprimirEtiqueta() {
    const [notaFiscal, setNotaFiscal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = 'https://linhares-logistica-backend.onrender.com/api/etiqueta/${notaFiscal}';
        handleDownloadPDF(url, `etiqueta_${notaFiscal}.pdf`, setIsLoading, setMensagem);
    };

    return (
        <form onSubmit={handleSubmit}>
            <p>Realize aqui as impressões das etiquetas identificadoras de volumes.</p>
            <div className={styles.formGroup}>
                <label htmlFor="nf_etiqueta">Número da Nota Fiscal</label>
                <input type="text" id="nf_etiqueta" value={notaFiscal} onChange={e => setNotaFiscal(e.target.value)} required />
            </div>
            <button type="submit" className={styles.formButton} disabled={isLoading}>{isLoading ? 'Gerando...' : 'Imprimir Etiqueta'}</button>
            {mensagem && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{mensagem}</p>}
        </form>
    );
}

const secoes = [
    { 
        id: 'rastreio_destinatario', 
        titulo: 'Rastreamento (Destinatário)', 
        icon: <FaTruck />,
        conteudo: <FormRastreioDestinatario />
    },
    { 
        id: 'coleta_entrega', 
        titulo: 'Solicitar Coleta de Entrega', 
        icon: <FaBoxOpen />,
        conteudo: <FormColetaEntrega />
    },
    { 
        id: 'coleta_devolucao', 
        titulo: 'Solicitar Coleta de Devolução', 
        icon: <FaUndo />,
        conteudo: <FormColetaDevolucao />
    },
    { 
        id: 'emissao_fatura', 
        titulo: 'Emissão de Fatura', 
        icon: <FaFileInvoice />,
        conteudo: <FormEmissaoFatura />
    },
    { 
        id: 'imprimir_etiqueta', 
        titulo: 'Imprimir Etiqueta', 
        icon: <FaPrint />,
        conteudo: <FormImprimirEtiqueta />
    }
];

function AreaCliente() {
    const [secaoAberta, setSecaoAberta] = useState<string | null>(null);

    const toggleSecao = (id: string) => {
        if (secaoAberta === id) {
            setSecaoAberta(null); 
        } else {
            setSecaoAberta(id);
        }
    };

    return (
        <div className={styles.areaCliente}>
            <h2 className={styles.tituloPrincipal}>Área do Cliente</h2>
            
            <div className={styles.accordion}>
                {secoes.map((secao) => (
                    <div key={secao.id} className={styles.accordionItem}>
                        <button 
                            className={styles.accordionHeader} 
                            onClick={() => toggleSecao(secao.id)}
                        >
                            <span className={styles.headerIcon}>{secao.icon}</span>
                            <span className={styles.headerTitulo}>{secao.titulo}</span>
                            <span className={styles.headerSeta}>
                                {secaoAberta === secao.id ? '−' : '+'}
                            </span>
                        </button>
                        <div 
                            className={`${styles.accordionContent} ${secaoAberta === secao.id ? styles.aberto : ''}`}
                        >
                            <div className={styles.contentPadding}>
                                {secao.conteudo}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AreaCliente;