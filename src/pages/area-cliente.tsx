import { useState, useEffect, useCallback } from 'react';
import { FaTruck, FaFileInvoice, FaPrint, FaBoxOpen, FaUndo, FaSignOutAlt } from 'react-icons/fa';
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
} from '@chakra-ui/react';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

import ClienteAuth from '../components/clienteAuth';

// --- TIPAGENS ---

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
};

// --- FUNÇÕES AUXILIARES ---

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
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

// --- MinhasColetas (Componente de Dados Privados) ---
function MinhasColetas() {
    const [coletas, setColetas] = useState<Coleta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();
    const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

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

    // --- Componente de Alerta Dinâmico para Devolução ---
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
                } else if (coleta.statusDevolucaoProcessamento === 'EM_PROCESSO') {
                    colorScheme = 'orange';
                    statusDisplay = 'DEVOLUÇÃO EM ANÁLISE';
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

// --- Componentes Placeholder/Auxiliares (Mantidos) ---
function FormRastreioDestinatario() {
    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
            <Text>Formulário de Rastreio (Conteúdo omitido)</Text>
        </Box>
    );
}

function FormColetaEntrega() {
    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
            <Text>Formulário de Solicitação de Coleta/Entrega (Conteúdo omitido)</Text>
        </Box>
    );
}

function FormColetaDevolucao() {
    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
            <Text>Formulário de Solicitação de Devolução (Conteúdo omitido)</Text>
        </Box>
    );
}

function FormEmissaoFatura() {
    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
            <Text>Formulário de Emissão de Fatura (Conteúdo omitido)</Text>
        </Box>
    );
}

function FormImprimirEtiqueta() {
    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
            <Text>Formulário de Impressão de Etiqueta (Conteúdo omitido)</Text>
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

// --- COMPONENTE PRINCIPAL (COM BUSCA DE NOME) ---
function AreaCliente() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [clienteNome, setClienteNome] = useState('Cliente');
    const toast = useToast();
    const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

    // ATUALIZADA: Busca o perfil e atualiza o nome
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
                // Personaliza o nome, usando o nome real ou o email
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
                    Olá, {clienteNome}!
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