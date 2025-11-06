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
    HStack
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';

import ClienteAuth from '../components/clienteAuth'; 


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
        
        const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

        try {
            const res = await fetch(`${API_URL}/api/rastreamento/destinatario`, {
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
        <Box as="form" onSubmit={handleSubmit}>
            <Text mb={4}>Acesse com seu CNPJ/CPF e Número da Encomenda.</Text>
            <VStack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>Número da Encomenda</FormLabel>
                    <Input type="text" value={numeroEncomenda} onChange={e => setNumeroEncomenda(e.target.value)} placeholder="Ex: OC-1001" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Seu CNPJ/CPF (Destinatário)</FormLabel>
                    <Input type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} />
                </FormControl>
            </VStack>
            <Button type="submit" colorScheme="blue" mt={6} isLoading={isLoading}>{isLoading ? "Buscando..." : "Acessar"}</Button>
            
            {erro && (
                <Alert status="error" mt={6}>
                    <AlertIcon />
                    {erro}
                </Alert>
            )}
            
            {resultado && (
                <Box mt={6} borderWidth="1px" borderRadius="md" p={4}>
                    <Alert status="success" variant="subtle" mb={4}>
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Status Atual: {resultado.status.replace('_', ' ')}</AlertTitle>
                            {resultado.historico && resultado.historico.length > 0 && (
                                <AlertDescription>Localização: {resultado.historico[0].localizacao}</AlertDescription>
                            )}
                        </Box>
                    </Alert>
                    
                    <Heading as="h5" size="sm" mb={3}>Histórico de Rastreio</Heading>
                    <List spacing={3}>
                        {resultado.historico && resultado.historico.map((evento: any) => (
                             <ListItem key={evento.id} borderBottomWidth="1px" pb={3}>
                                <ListIcon as={MdCheckCircle} color="green.500" />
                                <Text as="span" fontWeight="bold" mr={2}>
                                    {new Date(evento.data).toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}
                                </Text>
                                - {evento.status.replace('_', ' ')}
                                <Text fontSize="sm" color="gray.600" ml={6}>{evento.localizacao}</Text>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
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
        
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
                <Input type="text" value={tipoCarga} onChange={(e) => setTipoCarga(e.target.value)} placeholder="Ex: Caixas, Pallets"/>
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
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
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
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
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
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
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
                <Box maxW="sm" mx="auto" p={8} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="lg">
                    <Heading size="lg" textAlign="center">Acesso Cliente</Heading>
                    <ClienteAuth onLoginSuccess={checkAuthStatus}/>
                    <Button mt={4} colorScheme='blue' w="100%" onClick={checkAuthStatus}>Tentar Login (Placeholder)</Button>
                </Box> 
            </Box>
        );
    }
    
    return (
        <Box w="100%" maxW="960px" mx="auto" p={4} my={16}>
            <HStack justifyContent="space-between" mb={6}>
                <Heading as="h1" size="lg">
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