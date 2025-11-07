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
    statusDevolucaoProcessamento: 'PENDENTE' | 'ACEITA' | 'REJEITADA' | null;
    motivoRejeicaoDevolucao: string | null;
};

function MinhasColetas() {
    const [coletas, setColetas] = useState<Coleta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedColetaId, setExpandedColetaId] = useState<number | null>(null);

    const toast = useToast();

    const toggleHistorico = (id: number) => {
        setExpandedColetaId(expandedColetaId === id ? null : id);
    };

    useEffect(() => {
        const fetchColetas = async () => {
            const token = localStorage.getItem('cliente_token');
            setIsLoading(true);
            setError('');
            const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

            if (!token) {
                setError('Token de autenticação não encontrado.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/cliente/minhas-coletas`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 403) {
                    throw new Error('Permissão negada. Seu login não tem acesso a esta lista.');
                }
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Falha ao carregar coletas do cliente.');
                }

                const data: Coleta[] = await response.json();
                setColetas(data);
            } catch (err) {
                setError((err as Error).message);
                toast({
                    title: 'Erro de Busca',
                    description: (err as Error).message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchColetas();
    }, [toast]);


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONCLUIDA': return 'green';
            case 'EM_TRANSITO': return 'blue';
            case 'EM_ROTA_ENTREGA': return 'orange';
            case 'CANCELADA': return 'red';
            case 'EM_DEVOLUCAO': return 'red';
            default: return 'gray';
        }
    };

    if (isLoading) {
        return <VStack p={5}><Spinner size="lg" color="blue.500" /><Text>Carregando suas coletas...</Text></VStack>;
    }

    if (error) {
        return (
            <Alert status="error" mt={4}>
                <AlertIcon as={MdErrorOutline} />
                <AlertTitle mr={2}>Erro de Acesso:</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (coletas.length === 0) {
        return <Text mt={4}>Nenhuma coleta encontrada vinculada ao seu CNPJ/CPF.</Text>;
    }

    return (
        <VStack spacing={4} align="stretch" mt={4}>
            {coletas.map((coleta) => (
                <Box
                    key={coleta.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg="white"
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                >
                    <HStack justifyContent="space-between" align="flex-start">
                        <VStack align="flex-start" spacing={1}>
                            <Heading as="h4" size="md" color="blue.700">
                                Encomenda: {coleta.numeroEncomenda}
                            </Heading>
                            <Text fontSize="sm" color="gray.600">NF: {coleta.numeroNotaFiscal}</Text>
                            <Text fontSize="sm" color="gray.500">
                                Solicitação em: {new Date(coleta.dataSolicitacao).toLocaleDateString('pt-BR')}
                            </Text>
                        </VStack>
                        <Badge colorScheme={getStatusColor(coleta.status)} p={2} borderRadius="md" fontSize="sm">
                            {coleta.status.replace(/_/g, ' ')}
                        </Badge>
                        {coleta.statusDevolucaoProcessamento && (
                            <Alert
                                status={
                                    coleta.statusDevolucaoProcessamento === 'REJEITADA' ? 'error' :
                                        coleta.statusDevolucaoProcessamento === 'ACEITA' ? 'success' :
                                            'warning' 
                                }
                                mt={4}
                                borderRadius="md"
                                alignItems="flex-start"
                            >
                                <AlertIcon />
                                <Box flex="1">
                                    <AlertTitle fontSize="md">
                                        {coleta.statusDevolucaoProcessamento === 'REJEITADA' && 'Devolução Rejeitada'}
                                        {coleta.statusDevolucaoProcessamento === 'ACEITA' && 'Devolução Aceita'}
                                        {coleta.statusDevolucaoProcessamento === 'PENDENTE' && 'Devolução Pendente'}
                                    </AlertTitle>

                                    <AlertDescription fontSize="sm">
                                        {coleta.statusDevolucaoProcessamento === 'REJEITADA' && (
                                            <>
                                                Sua solicitação de devolução com NF {coleta.numeroNotaFiscal} foi **REJEITADA** pela administração.
                                                {coleta.motivoRejeicaoDevolucao && (
                                                    <Text mt={2} fontWeight="bold" color="red.700">
                                                        Motivo: {coleta.motivoRejeicaoDevolucao}
                                                    </Text>
                                                )}
                                            </>
                                        )}
                                        {coleta.statusDevolucaoProcessamento === 'ACEITA' && (
                                            <>
                                                Sua solicitação de devolução com NF {coleta.numeroNotaFiscal} foi **ACEITA** pela administração. Aguarde o contato do motorista para o recolhimento.
                                            </>
                                        )}
                                        {coleta.statusDevolucaoProcessamento === 'PENDENTE' && (
                                            <>
                                                Sua solicitação de devolução com NF {coleta.numeroNotaFiscal} está **PENDENTE** de análise pela administração.
                                            </>
                                        )}
                                    </AlertDescription>
                                </Box>
                            </Alert>
                        )}
                    </HStack>

                    <Button
                        size="sm"
                        mt={4}
                        onClick={() => toggleHistorico(coleta.id)}
                        variant="ghost"
                        colorScheme="blue"
                    >
                        {expandedColetaId === coleta.id ? 'Ocultar Histórico' : 'Ver Histórico Detalhado'}
                    </Button>

                    <Collapse in={expandedColetaId === coleta.id} animateOpacity>
                        <Box mt={4} pt={4} borderTopWidth="1px" borderColor="gray.100">
                            <Heading as="h5" size="sm" mb={3}>Eventos</Heading>
                            <List spacing={3}>
                                {coleta.historico.map((evento) => (
                                    <ListItem key={evento.id} borderBottomWidth="1px" pb={3}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        <Text as="span" fontWeight="bold" mr={2}>
                                            {new Date(evento.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                        - {evento.status.replace(/_/g, ' ')}
                                        <Text fontSize="sm" color="gray.600" ml={6}>{evento.localizacao}</Text>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Collapse>

                </Box>
            ))}
        </VStack>
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

function FormEmissaoFatura() {
    const [notaFiscal, setNotaFiscal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

        const url = `${API_URL}/api/fatura/${notaFiscal}`;
        const filename = `fatura_${notaFiscal}.pdf`;

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

            toast({
                title: 'Sucesso!',
                description: 'Download da fatura iniciado.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setNotaFiscal('');

        } catch (error) {
            toast({
                title: 'Erro ao gerar fatura.',
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
        <Box as="form" onSubmit={handleSubmit}>
            <Text mb={4}>Preencha as informações para gerar sua fatura/boleto de forma on-line.</Text>
            <FormControl isRequired>
                <FormLabel>Número da Nota Fiscal</FormLabel>
                <Input type="text" value={notaFiscal} onChange={e => setNotaFiscal(e.target.value)} />
            </FormControl>
            <Button type="submit" colorScheme="blue" mt={6} isLoading={isLoading}>
                {isLoading ? 'Gerando...' : 'Gerar Fatura'}
            </Button>
        </Box>
    );
}

function FormImprimirEtiqueta() {
    const [notaFiscal, setNotaFiscal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

        const url = `${API_URL}/api/etiqueta/${notaFiscal}`;
        const filename = `etiqueta_${notaFiscal}.pdf`;

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

            toast({
                title: 'Sucesso!',
                description: 'Download da etiqueta iniciado.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setNotaFiscal('');

        } catch (error) {
            toast({
                title: 'Erro ao gerar etiqueta.',
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
        <Box as="form" onSubmit={handleSubmit}>
            <Text mb={4}>Realize aqui as impressões das etiquetas identificadoras de volumes.</Text>
            <FormControl isRequired>
                <FormLabel>Número da Nota Fiscal</FormLabel>
                <Input type="text" value={notaFiscal} onChange={e => setNotaFiscal(e.target.value)} />
            </FormControl>
            <Button type="submit" colorScheme="blue" mt={6} isLoading={isLoading}>
                {isLoading ? 'Gerando...' : 'Imprimir Etiqueta'}
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

function AreaCliente() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [clienteNome, setClienteNome] = useState('Cliente');
    const toast = useToast();

    const checkAuthStatus = useCallback(() => {
        const token = localStorage.getItem('cliente_token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

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