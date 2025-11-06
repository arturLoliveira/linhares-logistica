import  { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Heading,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    useToast,
    Center,
    VStack,
    HStack,
    Tag,
} from '@chakra-ui/react';
import { FaUndo, FaEye } from 'react-icons/fa';

interface SolicitacaoDevolucao {
    id: number;
    nomeCliente: string;
    emailCliente: string;
    numeroNFOriginal: string;
    motivoDevolucao: string | null;
    dataSolicitacao: string;
    // statusProcessamento: string; <-- (Campo a ser adicionado futuramente para gestão)
}

const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';


const AdminDevolucoes = () => {
    const [devolucoes, setDevolucoes] = useState<SolicitacaoDevolucao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState('');
    const toast = useToast();

    const fetchDevolucoes = useCallback(async () => {
        setIsLoading(true);
        setErro('');
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch(`${API_URL}/api/admin/devolucoes`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 403) {
                    setErro("Acesso negado. Sua sessão de administrador pode ter expirado.");
                } else {
                    setErro("Falha ao carregar a lista de devoluções.");
                }
                setDevolucoes([]);
                return;
            }

            const data: SolicitacaoDevolucao[] = await response.json();
            setDevolucoes(data);

        } catch (err) {
            console.error(err);
            setErro("Erro ao conectar com o servidor.");
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchDevolucoes();
    }, [fetchDevolucoes]);
    

    const handleView = (devolucao: SolicitacaoDevolucao) => {
        toast({
            title: "Detalhes da Devolução",
            description: `NF: ${devolucao.numeroNFOriginal}. Motivo: ${devolucao.motivoDevolucao || 'Não especificado'}`,
            status: "info",
            duration: 5000,
            isClosable: true,
        });
    };
    
    const handleUpdateStatus = (devolucao: SolicitacaoDevolucao) => {
         toast({
            title: "Ação de Processamento",
            description: `Atualizar status de NF ${devolucao.numeroNFOriginal}.`,
            status: "warning",
            duration: 2000,
            isClosable: true,
        });
    };


    return (
        <Box w="100%" p={4}>
            <Heading as="h2" size="lg" mb={8} display="flex" alignItems="center">
                <FaUndo style={{ marginRight: '10px' }} />
                Gestão de Devoluções Solicitadas
            </Heading>

            <VStack spacing={6} align="stretch">
                
                {isLoading ? (
                    <Center py={10}>
                        <Spinner size="xl" color="blue.500" />
                        <Text ml={3}>Carregando solicitações...</Text>
                    </Center>
                ) : erro ? (
                    <Alert status="error">
                        <AlertIcon />
                        {erro}
                    </Alert>
                ) : (
                    <TableContainer borderWidth="1px" borderRadius="md" shadow="md" bg="white">
                        <Table variant="simple" size="sm">
                            <Thead bg="gray.100">
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Data Solicitação</Th>
                                    <Th>Nota Fiscal</Th>
                                    <Th>Cliente / E-mail</Th>
                                    <Th>Motivo (Resumo)</Th>
                                    <Th textAlign="center">Ações</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {devolucoes.length > 0 ? devolucoes.map((devolucao) => (
                                    <Tr key={devolucao.id} _hover={{ bg: "blue.50" }}>
                                        <Td fontWeight="bold">{devolucao.id}</Td>
                                        <Td>{new Date(devolucao.dataSolicitacao).toLocaleDateString('pt-BR')}</Td>
                                        <Td>{devolucao.numeroNFOriginal}</Td>
                                        <Td>
                                            <VStack align="flex-start" spacing={0}>
                                                <Text fontWeight="medium">{devolucao.nomeCliente}</Text>
                                                <Text fontSize="xs" color="gray.600">{devolucao.emailCliente}</Text>
                                            </VStack>
                                        </Td>
                                        <Td>
                                            <Tag size="sm" variant="subtle" colorScheme="purple">
                                                {devolucao.motivoDevolucao ? (devolucao.motivoDevolucao.substring(0, 30) + '...') : 'Não Informado'}
                                            </Tag>
                                        </Td>
                                        <Td textAlign="center">
                                            <HStack spacing={2} justifyContent="center">
                                                <Button size="xs" colorScheme="blue" leftIcon={<FaEye />} onClick={() => handleView(devolucao)}>
                                                    Ver Detalhes
                                                </Button>
                                                <Button size="xs" colorScheme="orange" onClick={() => handleUpdateStatus(devolucao)}>
                                                    Processar
                                                </Button>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                )) : (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">Nenhuma solicitação de devolução pendente.</Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )}

            </VStack>
        </Box>
    );
};

export default AdminDevolucoes;