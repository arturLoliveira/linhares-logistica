import { useState, useEffect, useCallback } from 'react';
import { FaTruck, FaFileInvoice, FaBoxOpen, FaUndo, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    List,
    ListItem,
    ListIcon,
    SimpleGrid,
    NumberInput,
    NumberInputField,
    InputGroup,
    InputLeftAddon,
    Flex,
    HStack,
    Badge,
    Spinner,
    Collapse,
    Center,
    Link,
    Tag,
} from '@chakra-ui/react';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

import ClienteAuth from '../components/clienteAuth';

type Historico = {
    id: number;
    data: string;
    status: string;
    localizacao: string;
};

type Coleta = {
    id: number;
    numeroEncomenda: string;
    numeroNotaFiscal: string;
    status: string;
    dataSolicitacao: string;
    historico: Historico[];
    statusDevolucaoProcessamento: 'PENDENTE' | 'APROVADA' | 'REJEITADA' | null;
    motivoRejeicaoDevolucao: string | null;
    statusPagamento: 'PENDENTE' | 'PAGO' | 'ATRASADO' | null;
    boletoUrl: string | null;
    valorFrete: number;
};

const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'CONCLUIDA': return 'green';
        case 'PENDENTE': return 'gray';
        case 'CANCELADA': return 'red';
        case 'EM_ROTA_ENTREGA': return 'yellow';
        case 'COLETADO':
        case 'EM_TRANSITO':
        case 'EM_DEVOLUCAO':
            return 'blue';
        default: return 'gray';
    }
};

const getPaymentColor = (status: Coleta['statusPagamento']) => {
    switch (status) {
        case 'PAGO': return 'green';
        case 'ATRASADO': return 'red';
        case 'PENDENTE': return 'orange';
        default: return 'gray';
    }
};


function MinhasColetas() {
    const [coletas, setColetas] = useState<Coleta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [expandedColetaId, setExpandedColetaId] = useState<number | null>(null);
    const toggleHistorico = (id: number) => {
        setExpandedColetaId(expandedColetaId === id ? null : id);
    };

    const fetchColetas = useCallback(async () => {
        const token = localStorage.getItem('cliente_token');
        if (!token) {
            setError('Faça login para ver suas coletas.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/cliente/minhas-coletas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao buscar coletas.');
            }

            const data: Coleta[] = await response.json();
            setColetas(data.sort((a, b) => new Date(b.dataSolicitacao).getTime() - new Date(a.dataSolicitacao).getTime()));
        } catch (err) {
            setError(`Erro ao carregar suas coletas: ${err instanceof Error ? err.message : String(err)}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchColetas();
    }, [fetchColetas]);

    const DevolucaoStatusAlert = ({ status, nf, motivo }: { status: Coleta['statusDevolucaoProcessamento'], nf: string, motivo: string | null }) => {
        if (!status) return null;

        const baseProps = { mt: 4, borderRadius: 'md', alignItems: 'flex-start', w: '100%' };

        switch (status) {
            case 'REJEITADA':
                return (
                    <Alert status="error" {...baseProps}>
                        <AlertIcon />
                        <Box flex="1">
                            <AlertTitle fontSize="md">Devolução Rejeitada</AlertTitle>
                            <AlertDescription fontSize="sm">
                                Sua solicitação de devolução com NF {nf} foi **REJEITADA** pela administração.
                                {motivo && (
                                    <Text mt={2} fontWeight="bold" color="red.700">
                                        Motivo: {motivo}
                                    </Text>
                                )}
                            </AlertDescription>
                        </Box>
                    </Alert>
                );
            case 'APROVADA':
                return (
                    <Alert status="success" {...baseProps}>
                        <AlertIcon />
                        <AlertTitle fontSize="md">Devolução Aprovada!</AlertTitle>
                        <AlertDescription fontSize="sm">
                            Sua solicitação de devolução foi **APROVADA**. Aguarde o contato da logística para agendar o recolhimento.
                        </AlertDescription>
                    </Alert>
                );
            case 'PENDENTE':
                return (
                    <Alert status="warning" {...baseProps}>
                        <AlertIcon />
                        <AlertTitle fontSize="md">Devolução Pendente</AlertTitle>
                        <AlertDescription fontSize="sm">
                            Sua solicitação de devolução está sob **análise** pela administração.
                        </AlertDescription>
                    </Alert>
                );
            default:
                return null;
        }
    };


    if (isLoading) {
        return <VStack p={5}><Spinner size="lg" color="blue.500" /><Text>Carregando suas coletas...</Text></VStack>;
    }

    if (error) {
        return <Alert status="error"><AlertIcon />{error}</Alert>;
    }

    if (coletas.length === 0) {
        return <Text>Nenhuma coleta ou entrega encontrada para este cliente.</Text>;
    }


    return (
        <VStack spacing={4} align="stretch" mt={4}>
            {coletas.map((coleta) => {

                let statusDisplay = coleta.status.replace(/_/g, ' ');
                let colorScheme = getStatusColor(coleta.status);

                if (coleta.statusDevolucaoProcessamento === 'REJEITADA') {
                    colorScheme = 'red';
                    statusDisplay = 'DEVOLUÇÃO REJEITADA';
                }

                return (
                    <Box
                        key={coleta.id}
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                        borderRadius="lg"
                        bg="white"
                    >
                        <HStack justifyContent="space-between" align="flex-start">
                            <VStack align="flex-start" spacing={1}>
                                <Text fontWeight="bold" fontSize="lg">
                                    NF: {coleta.numeroNotaFiscal}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Encomenda: {coleta.numeroEncomenda}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Solicitado em: {formatDate(coleta.dataSolicitacao)}
                                </Text>
                                <Button
                                    size="sm"
                                    mt={3}
                                    variant="link"
                                    colorScheme="blue"
                                    onClick={() => toggleHistorico(coleta.id)}
                                >
                                    {expandedColetaId === coleta.id ? 'Ocultar Histórico' : 'Ver Histórico Detalhado'}
                                </Button>

                                <Collapse in={expandedColetaId === coleta.id} animateOpacity>
                                    <Box mt={4} pt={4} borderTopWidth="1px" borderColor="gray.100">
                                        <Text fontWeight="medium" mb={2}>Histórico:</Text>
                                        <List spacing={2}>
                                            {coleta.historico.map((h) => (
                                                <ListItem key={h.id}>
                                                    <ListIcon
                                                        as={h.status === 'CONCLUIDA' ? MdCheckCircle : MdErrorOutline}
                                                        color={getStatusColor(h.status) + '.500'}
                                                    />
                                                    <Text as="span" fontWeight="bold" mr={2}>
                                                        {formatDate(h.data)}
                                                    </Text>
                                                    — {h.localizacao} ({h.status.replace(/_/g, ' ')})
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </Collapse>
                            </VStack>

                            <Badge colorScheme={colorScheme} p={2} borderRadius="md" fontSize="sm" whiteSpace="nowrap">
                                {statusDisplay}
                            </Badge>
                        </HStack>

                        <DevolucaoStatusAlert
                            status={coleta.statusDevolucaoProcessamento}
                            nf={coleta.numeroNotaFiscal}
                            motivo={coleta.motivoRejeicaoDevolucao}
                        />

                        <Collapse startingHeight={20} in={false} animateOpacity>
                            <Box pt={4}>
                                <Text fontWeight="medium" mb={2}>Histórico:</Text>
                                <List spacing={2}>
                                    {coleta.historico.map((h) => (
                                        <ListItem key={h.id}>
                                            <ListIcon as={h.status === 'CONCLUIDA' ? MdCheckCircle : MdErrorOutline} color={getStatusColor(h.status) + '.500'} />
                                            {formatDate(h.data)} - **{h.status.replace(/_/g, ' ')}** em {h.localizacao}
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Collapse>

                    </Box>
                );
            })}
        </VStack>
    );
}


function ListaFaturasPendentes() {
    const [faturas, setFaturas] = useState<Coleta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

    const fetchFaturasPendentes = useCallback(async () => {
        const token = localStorage.getItem('cliente_token');
        if (!token) return;

        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/cliente/minhas-coletas`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Falha ao buscar faturas.');

            const allColetas: Coleta[] = await response.json();
            const pendentes = allColetas.filter(c =>
                (c.statusPagamento === 'PENDENTE' || c.statusPagamento === 'ATRASADO')
            );

            setFaturas(pendentes);

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchFaturasPendentes();
    }, [fetchFaturasPendentes]);


    if (isLoading) return <Center py={5}><Spinner size="md" /></Center>;
    if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;
    if (faturas.length === 0) return <Text>Nenhuma fatura ou boleto pendente.</Text>;

    return (
        <Box>
            <Heading as="h4" size="md" mb={4}>
                Faturas com Pagamento Pendente
            </Heading>
            <VStack spacing={3} align="stretch">
                {faturas.map(fatura => (
                    <Box key={fatura.id} p={4} borderWidth="1px" borderRadius="md" bg="orange.50">
                        <HStack justifyContent="space-between" alignItems="center">
                            <VStack align="flex-start" spacing={0}>
                                <Text fontWeight="bold">NF: {fatura.numeroNotaFiscal}</Text>
                                <Text fontSize="sm" color="gray.700">Valor: {formatCurrency(fatura.valorFrete)}</Text>
                            </VStack>

                            <HStack spacing={2}>
                                <Tag colorScheme={getPaymentColor(fatura.statusPagamento)}>{fatura.statusPagamento}</Tag>
                                {fatura.boletoUrl && (
                                    <Button size="sm" colorScheme="green" as={Link} href={fatura.boletoUrl} target="_blank">
                                        Ver Boleto
                                    </Button>
                                )}
                            </HStack>
                        </HStack>
                    </Box>
                ))}
            </VStack>
        </Box>
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
    const toast = useToast();

    const handleSubmitColeta = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const dadosColeta = {
            nomeCliente, emailCliente, enderecoColeta, tipoCarga,
            cpfCnpjRemetente, cpfCnpjDestinatario, numeroNotaFiscal,
            valorFrete: valorFrete,
            pesoKg: pesoKg || null,
            dataVencimento: null
        };

        const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

        try {
            const response = await fetch(`${API_URL}/api/coletas/solicitar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosColeta),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Falha ao solicitar a coleta.');
            }
            const novaColeta = await response.json();

            toast({
                title: 'Solicitação recebida!',
                description: `Sua coleta foi agendada. N° de Encomenda: ${novaColeta.numeroEncomenda}`,
                status: 'success',
                duration: 7000,
                isClosable: true,
            });

            setNomeCliente(''); setEmailCliente(''); setEnderecoColeta(''); setTipoCarga('');
            setCpfCnpjRemetente(''); setCpfCnpjDestinatario(''); setNumeroNotaFiscal('');
            setValorFrete(''); setPesoKg('');
        } catch (error) {
            toast({
                title: 'Erro ao solicitar.',
                description: (error as Error).message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmitColeta}>
            <Text mb={4}>Após o preenchimento do formulário será gerado o número da coleta.</Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Valor do Frete (R$) (Conforme cotação)</FormLabel>
                        <InputGroup>
                            <InputLeftAddon>R$</InputLeftAddon>
                            <NumberInput
                                value={valorFrete}
                                onChange={(valueString) => setValorFrete(valueString)}
                                precision={2}
                                min={0.01}
                                w="100%"
                            >
                                <NumberInputField placeholder="Ex: 150.00" />
                            </NumberInput>
                        </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Seu Nome (Remetente)</FormLabel>
                        <Input type="text" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Seu E-mail</FormLabel>
                        <Input type="email" value={emailCliente} onChange={(e) => setEmailCliente(e.target.value)} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Seu CPF/CNPJ (Remetente)</FormLabel>
                        <Input type="text" value={cpfCnpjRemetente} onChange={(e) => setCpfCnpjRemetente(e.target.value)} />
                    </FormControl>
                </VStack>

                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel>Peso (Kg) (Opcional)</FormLabel>
                        <NumberInput
                            value={pesoKg}
                            onChange={(valueString) => setPesoKg(valueString)}
                            precision={1}
                            step={0.5}
                            min={0}
                        >
                            <NumberInputField placeholder="Ex: 25.5" />
                        </NumberInput>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Endereço de Coleta</FormLabel>
                        <Input type="text" value={enderecoColeta} onChange={(e) => setEnderecoColeta(e.target.value)} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Número da Nota Fiscal</FormLabel>
                        <Input type="text" value={numeroNotaFiscal} onChange={(e) => setNumeroNotaFiscal(e.target.value)} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>CPF/CNPJ do Destinatário</FormLabel>
                        <Input type="text" value={cpfCnpjDestinatario} onChange={(e) => setCpfCnpjDestinatario(e.target.value)} />
                    </FormControl>
                </VStack>
            </SimpleGrid>

            <FormControl mt={4}>
                <FormLabel>Tipo da Carga (Opcional)</FormLabel>
                <Input type="text" value={tipoCarga} onChange={(e) => setTipoCarga(e.target.value)} placeholder="Ex: Caixas, Pallets" />
            </FormControl>

            <Button type="submit" colorScheme="blue" mt={6} isLoading={isLoading}>
                {isLoading ? 'Enviando...' : 'Solicitar Coleta'}
            </Button>
        </Box>
    );
}

function FormColetaDevolucao() {
    const [nomeCliente, setNomeCliente] = useState('');
    const [emailCliente, setEmailCliente] = useState('');
    const [numeroNFOriginal, setNumeroNFOriginal] = useState('');
    const [motivoDevolucao, setMotivoDevolucao] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

        try {
            const res = await fetch(`${API_URL}/api/devolucao/solicitar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nomeCliente, emailCliente, numeroNFOriginal, motivoDevolucao })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Falha ao enviar solicitação.');
            }

            const data = await res.json();
            toast({
                title: 'Solicitação de Devolução Enviada!',
                description: `O status da encomenda ${data.coleta.numeroEncomenda} foi atualizado para Em Devolução.`,
                status: 'success',
                duration: 7000,
                isClosable: true,
            });

            setNomeCliente(''); setEmailCliente(''); setNumeroNFOriginal(''); setMotivoDevolucao('');
        } catch (err) {
            toast({
                title: 'Erro ao Solicitar Devolução.',
                description: (err as Error).message,
                status: 'error',
                duration: 7000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <Text mb={4}>Após o preenchimento, o status da sua coleta será atualizado para 'Em Devolução'.</Text>
            <VStack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>Seu Nome</FormLabel>
                    <Input type="text" value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Seu E-mail</FormLabel>
                    <Input type="email" value={emailCliente} onChange={e => setEmailCliente(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Nº da Nota Fiscal Original</FormLabel>
                    <Input type="text" value={numeroNFOriginal} onChange={e => setNumeroNFOriginal(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Motivo da Devolução (opcional)</FormLabel>
                    <Input type="text" value={motivoDevolucao} onChange={e => setMotivoDevolucao(e.target.value)} />
                </FormControl>
            </VStack>
            <Button type="submit" colorScheme="blue" mt={6} isLoading={isLoading}>
                {isLoading ? 'Enviando...' : 'Solicitar Devolução'}
            </Button>
        </Box>
    );
}



const secoes = [
    {
        id: 'minhas_coletas',
        titulo: 'Minhas Coletas e Rastreamento',
        icon: <FaTruck />,
        conteudo: <MinhasColetas />
    },
    {
        id: 'faturas_pendentes',
        titulo: 'Faturas e Boletos Pendentes',
        icon: <FaFileInvoice />,
        conteudo: <ListaFaturasPendentes />,
    },
    {
        id: 'coleta_entrega',
        titulo: 'Solicitar Nova Coleta de Entrega',
        icon: <FaBoxOpen />,
        conteudo: <FormColetaEntrega />
    },
    {
        id: 'coleta_devolucao',
        titulo: 'Solicitar Coleta de Devolução',
        icon: <FaUndo />,
        conteudo: <FormColetaDevolucao />
    }
];

function AreaCliente() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [clienteNome, setClienteNome] = useState('Cliente');
    const toast = useToast();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

    const checkAuthStatus = useCallback(async () => {
        const token = localStorage.getItem('cliente_token');
        if (!token) {
            setIsLoggedIn(false);
            setClienteNome('Cliente');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/user/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const user = await response.json();
                setIsLoggedIn(true);
                setClienteNome(user.nome || user.email || 'Cliente');
            } else {
                localStorage.removeItem('cliente_token');
                setIsLoggedIn(false);
                setClienteNome('Cliente');
            }
        } catch (error) {
            console.error("Erro ao buscar perfil do cliente:", error);
            setIsLoggedIn(false);
            setClienteNome('Cliente');
        }
    }, [API_URL]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);


    const handleLogout = () => {
        localStorage.removeItem('cliente_token');
        setIsLoggedIn(false);
        setClienteNome('Cliente');
        toast({
            title: 'Sessão encerrada.',
            description: 'Você saiu da Área do Cliente.',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
        navigate('/');
    };

    if (!isLoggedIn) {
        return (
            <Box w="100%" minH="100vh" bg="#F0F4FA" py={12}>
                <ClienteAuth onLoginSuccess={checkAuthStatus} />
            </Box>
        );
    }

    return (
        <Box w="100%" maxW="960px" mx="auto" p={4} my={16}>
            <HStack justifyContent="space-between" mb={6}>
                <Heading as="h1" size="lg" color="blue.700">
                    Área do Cliente: {clienteNome}
                </Heading>
                <Button
                    leftIcon={<FaSignOutAlt />}
                    colorScheme="red"
                    variant="outline"
                    onClick={handleLogout}
                >
                    Sair
                </Button>
            </HStack>

            <Accordion allowToggle defaultIndex={[0]}>
                {secoes.map((secao) => (
                    <AccordionItem
                        key={secao.id}
                        bg="white"
                        shadow="md"
                        mb={4}
                        borderRadius="md"
                        borderLeftWidth="5px"
                        borderLeftColor="blue.500"
                        overflow="hidden"
                    >
                        <h2>
                            <AccordionButton
                                _expanded={{ bg: 'blue.500', color: 'white' }}
                                borderRadius="md"
                                py={4}
                            >
                                <Flex
                                    align="center"
                                    flex="1"
                                    textAlign="left"
                                    color={undefined}
                                >
                                    <Box as="span" mr={3} color="blue.500" _expanded={{ color: 'white' }}>
                                        {secao.icon}
                                    </Box>
                                    <Text fontWeight="medium">{secao.titulo}</Text>
                                </Flex>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={6} p={6} borderTopWidth="1px" borderColor="gray.100">
                            {secao.conteudo}
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </Box>
    );
}

export default AreaCliente;