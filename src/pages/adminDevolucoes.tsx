import React, { useState, useEffect, useCallback } from 'react';
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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Select,
    useDisclosure,
} from '@chakra-ui/react';
import { FaUndo } from 'react-icons/fa';

interface SolicitacaoDevolucao {
    id: number;
    nomeCliente: string;
    emailCliente: string;
    numeroNFOriginal: string;
    motivoDevolucao: string | null;
    dataSolicitacao: string;
    statusProcessamento: string | null; 
}

const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

const STATUS_PROCESSAMENTO = [
    { value: 'PENDENTE', label: 'Pendente (Aguardando Análise)', color: 'gray' },
    { value: 'EM_PROCESSO', label: 'Em Processamento / Coleta Agendada', color: 'orange' },
    { value: 'REJEITADA', label: 'Rejeitada (Motivo Inválido)', color: 'red' },
    { value: 'CONCLUIDA', label: 'Concluída (Estorno/Solução)', color: 'green' },
];

const getStatusTagColor = (status: string | null): string => {
    return STATUS_PROCESSAMENTO.find(s => s.value === status)?.color || 'gray';
};



function AtualizaDevolucaoModal({ 
    isOpen, 
    onClose, 
    devolucao, 
    onUpdateSuccess 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    devolucao: SolicitacaoDevolucao, 
    onUpdateSuccess: () => void 
}) {
    
    const [statusProcessamento, setStatusProcessamento] = useState(devolucao.statusProcessamento || 'PENDENTE');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        setStatusProcessamento(devolucao.statusProcessamento || 'PENDENTE');
    }, [devolucao]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch(`${API_URL}/api/admin/devolucoes/${devolucao.id}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ statusProcessamento }),
            });

            if (!response.ok) {
                 const data = await response.json().catch(() => ({ error: 'Resposta do servidor inválida.' }));
                 throw new Error(data.error || 'Falha ao atualizar o status.');
            }
            
            toast({
                title: 'Status Atualizado!',
                description: `Devolução NF ${devolucao.numeroNFOriginal} movida para ${statusProcessamento}.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            onUpdateSuccess();
            onClose();

        } catch (error) {
            toast({
                title: 'Erro de Atualização.',
                description: (error as Error).message,
                status: 'error',
                duration: 7000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit}>
                <ModalHeader>Processar Devolução NF: {devolucao.numeroNFOriginal}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text mb={4}>
                        <Text as="span" fontWeight="bold">Motivo Original:</Text> {devolucao.motivoDevolucao || 'Não informado.'}
                    </Text>
                    <Text mb={6} color="red.500" fontSize="sm">
                        *Lembre-se: Este é o status interno da devolução. A coleta original (se aplicável) deve ser atualizada para 'EM_DEVOLUCAO' no painel de Coletas.
                    </Text>

                    <FormControl isRequired>
                        <FormLabel>Novo Status Interno</FormLabel>
                        <Select 
                            value={statusProcessamento} 
                            onChange={(e) => setStatusProcessamento(e.target.value)}
                            isDisabled={isLoading}
                        >
                            {STATUS_PROCESSAMENTO.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </Select>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                        Salvar Status
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}


const AdminDevolucoes = () => {
    const [devolucoes, setDevolucoes] = useState<SolicitacaoDevolucao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState('');
    const toast = useToast();
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [devolucaoParaProcessar, setDevolucaoParaProcessar] = useState<SolicitacaoDevolucao | null>(null);

    const fetchDevolucoes = useCallback(async () => {
        setIsLoading(true);
        setErro('');
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch(`${API_URL}/api/admin/devolucoes`, {
                headers: {
                    method: 'PUT',
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
    
    const handleProcessar = (devolucao: SolicitacaoDevolucao) => {
        setDevolucaoParaProcessar(devolucao);
        onOpen();
    };

    const handleUpdateSuccess = () => {
        fetchDevolucoes(); 
        setDevolucaoParaProcessar(null);
    };

    const handleCloseModal = () => {
        onClose();
        setDevolucaoParaProcessar(null); 
    }
    

    const handleViewDetails = (devolucao: SolicitacaoDevolucao) => {
         toast({
            title: "Detalhes da Devolução",
            description: (
                <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">NF Original:</Text><Text>{devolucao.numeroNFOriginal}</Text>
                    <Text fontWeight="bold">Cliente:</Text><Text>{devolucao.nomeCliente} ({devolucao.emailCliente})</Text>
                    <Text fontWeight="bold">Data:</Text><Text>{new Date(devolucao.dataSolicitacao).toLocaleDateString('pt-BR')}</Text>
                    <Text fontWeight="bold">Motivo:</Text><Text>{devolucao.motivoDevolucao || 'Não especificado'}</Text>
                    <Text fontWeight="bold">Status Interno:</Text><Text>{STATUS_PROCESSAMENTO.find(s => s.value === devolucao.statusProcessamento)?.label || 'Não Iniciado'}</Text>
                </VStack>
            ),
            status: "info",
            duration: 9000,
            isClosable: true,
            position: 'top-right'
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
                                    <Th>Status</Th>
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
                                            <Text fontSize="sm">
                                                {devolucao.motivoDevolucao ? (devolucao.motivoDevolucao.substring(0, 30) + '...') : 'Não Informado'}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Tag size="sm" variant="subtle" colorScheme={getStatusTagColor(devolucao.statusProcessamento)}>
                                                {STATUS_PROCESSAMENTO.find(s => s.value === devolucao.statusProcessamento)?.label || 'Não Iniciado'}
                                            </Tag>
                                        </Td>
                                        <Td textAlign="center">
                                            <HStack spacing={2} justifyContent="center">
                                                <Button size="xs" colorScheme="blue" onClick={() => handleViewDetails(devolucao)}>
                                                    Detalhes
                                                </Button>
                                                <Button 
                                                    size="xs" 
                                                    colorScheme="orange" 
                                                    onClick={() => handleProcessar(devolucao)}
                                                >
                                                    Processar
                                                </Button>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                )) : (
                                    <Tr>
                                        <Td colSpan={7} textAlign="center">Nenhuma solicitação de devolução pendente.</Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )}

            </VStack>
            
            {devolucaoParaProcessar && (
                <AtualizaDevolucaoModal 
                    isOpen={isOpen}
                    onClose={handleCloseModal}
                    devolucao={devolucaoParaProcessar}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}
        </Box>
    );
};

export default AdminDevolucoes;