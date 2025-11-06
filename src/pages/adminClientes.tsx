import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Center,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/react';
import { FaUsers, FaEdit, FaTrash } from 'react-icons/fa';

interface Cliente {
    id: number;
    cpfCnpj: string;
    nome: string | null;
    email: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

function EditarClienteModal({ isOpen, onClose, cliente, onUpdateSuccess }: { isOpen: boolean, onClose: () => void, cliente: Cliente, onUpdateSuccess: () => void }) {
    const [nome, setNome] = useState(cliente.nome || '');
    const [email, setEmail] = useState(cliente.email || '');
    const [cpfCnpj, setCpfCnpj] = useState(cliente.cpfCnpj);
    const [novaSenha, setNovaSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        setNome(cliente.nome || '');
        setEmail(cliente.email || '');
        setCpfCnpj(cliente.cpfCnpj);
        setNovaSenha('');
    }, [cliente]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('admin_token');
        
        const updateData = { nome, email, cpfCnpj, novaSenha };

        try {
            const response = await fetch(`https://linhares-logistica-backend.onrender.com/api/admin/clientes/${cliente.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                 const data = await response.json();
                 throw new Error(data.error || 'Falha ao atualizar o cliente.');
            }
            
            toast({
                title: 'Sucesso!',
                description: `Cliente ${nome} atualizado(a) com sucesso.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            onUpdateSuccess();
            onClose();

        } catch (error) {
            toast({
                title: 'Erro na Edição.',
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
                <ModalHeader>Editar: {cliente.nome || cliente.cpfCnpj}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Nome Completo</FormLabel>
                            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>CPF/CNPJ</FormLabel>
                            <Input value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>E-mail</FormLabel>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Nova Senha (Opcional)</FormLabel>
                            <Input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Deixe vazio para manter a atual" />
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button colorScheme="orange" type="submit" isLoading={isLoading}>
                        Salvar Alterações
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

function ExcluirClienteModal({ isOpen, onClose, cliente, onDeleteSuccess }: { isOpen: boolean, onClose: () => void, cliente: Cliente, onDeleteSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleDelete = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch(`${API_URL}/api/admin/clientes/${cliente.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                 const data = await response.json();
                 throw new Error(data.error || 'Falha ao excluir o cliente.');
            }
            
            toast({
                title: 'Excluído!',
                description: `Cliente ${cliente.nome || cliente.cpfCnpj} foi removido(a).`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            onDeleteSuccess();
            onClose();

        } catch (error) {
            toast({
                title: 'Erro na Exclusão.',
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
            <ModalContent>
                <ModalHeader>Confirmar Exclusão</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>
                        Você tem certeza que deseja excluir permanentemente o(a) cliente 
                        <Text as="span" fontWeight="bold"> {cliente.nome || cliente.cpfCnpj}</Text>?
                        Esta ação é irreversível e pode afetar registros de coletas.
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button colorScheme="red" onClick={handleDelete} isLoading={isLoading}>
                        Sim, Excluir
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}


function FormAdminCadastraCliente({ onCadastroSucesso }: { onCadastroSucesso: () => void }) {
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch(`https://linhares-logistica-backend.onrender.com/api/admin/clientes/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cpfCnpj, nome, email })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao cadastrar.');
            }

            toast({
                title: 'Cliente cadastrado!',
                description: `Cliente ${data.nome || data.cpfCnpj} foi cadastrado com sucesso.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            
            setCpfCnpj(''); setNome(''); setEmail('');
            onCadastroSucesso();

        } catch (err) {
            toast({
                title: 'Erro ao cadastrar.',
                description: (err as Error).message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box 
            as="form" 
            onSubmit={handleSubmit} 
            w={{ base: '100%', md: '70%', lg: '50%' }} 
            p={6} 
            borderWidth="1px" 
            borderRadius="lg" 
            boxShadow="md"
        >
            <Heading as="h4" size="md" mb={1}>
                Cadastrar Novo Cliente (Destinatário)
            </Heading>
            <Text mb={6}>
                Cadastre um cliente para vincular às coletas.
            </Text>
            
            <VStack spacing={4} align="stretch">
                <FormControl id="cliente_cpfcnpj" isRequired>
                    <FormLabel>CPF/CNPJ do Cliente (Destinatário)</FormLabel>
                    <Input 
                        type="text" 
                        value={cpfCnpj} 
                        onChange={e => setCpfCnpj(e.target.value)}
                    />
                </FormControl>
                
                <FormControl id="cliente_nome">
                    <FormLabel>Nome do Cliente (Opcional)</FormLabel>
                    <Input 
                        type="text" 
                        value={nome} 
                        onChange={e => setNome(e.target.value)}
                    />
                </FormControl>

                <FormControl id="cliente_email">
                    <FormLabel>Email do Cliente (Opcional)</FormLabel>
                    <Input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                    />
                </FormControl>
            </VStack>
            
            <Button 
                type="submit" 
                colorScheme="blue"
                mt={6}
                isLoading={isLoading}
                loadingText="Cadastrando..."
            >
                Cadastrar Cliente
            </Button>
        </Box>
    );
}

const ListaClientes = ({ refetchTrigger }: { refetchTrigger: number }) => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState('');

    const [clienteParaEditar, setClienteParaEditar] = useState<Cliente | null>(null);
    const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);

    const fetchClientes = useCallback(async () => {
        setIsLoading(true);
        setErro('');
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch(`https://linhares-logistica-backend.onrender.com/api/admin/clientes/list`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 403) {
                    setErro("Acesso negado. Sua sessão de administrador pode ter expirado.");
                } else {
                    setErro("Falha ao carregar a lista de clientes.");
                }
                setClientes([]);
                return;
            }

            const data: Cliente[] = await response.json();
            setClientes(data);

        } catch (err) {
            setErro("Erro ao conectar com o servidor.");
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchClientes();
    }, [fetchClientes, refetchTrigger]);
    
    const handleEdit = (cliente: Cliente) => setClienteParaEditar(cliente);
    const handleDelete = (cliente: Cliente) => setClienteParaExcluir(cliente);

    const handleSuccess = () => {
        fetchClientes();
    }

    return (
        <Box w="100%" mt={10}>
            <Heading as="h4" size="md" mb={4} display="flex" alignItems="center">
                <FaUsers style={{ marginRight: '10px' }} />
                Clientes Cadastrados
            </Heading>

            {isLoading ? (
                <Center py={10}>
                    <Spinner size="lg" color="blue.500" />
                    <Text ml={3}>Carregando clientes...</Text>
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
                                <Th>Nome</Th>
                                <Th>CPF/CNPJ</Th>
                                <Th>E-mail</Th>
                                <Th textAlign="center">Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {clientes.length > 0 ? clientes.map((cliente) => (
                                <Tr key={cliente.id} _hover={{ bg: "blue.50" }}>
                                    <Td fontWeight="bold">{cliente.id}</Td>
                                    <Td>{cliente.nome || 'N/A'}</Td>
                                    <Td>{cliente.cpfCnpj}</Td>
                                    <Td>{cliente.email || 'N/A'}</Td>
                                    <Td textAlign="center">
                                        <HStack spacing={2} justifyContent="center">
                                            <Button size="xs" colorScheme="orange" leftIcon={<FaEdit />} onClick={() => handleEdit(cliente)}>
                                                Editar
                                            </Button>
                                            <Button size="xs" colorScheme="red" leftIcon={<FaTrash />} onClick={() => handleDelete(cliente)}>
                                                Excluir
                                            </Button>
                                        </HStack>
                                    </Td>
                                </Tr>
                            )) : (
                                <Tr>
                                    <Td colSpan={5} textAlign="center">Nenhum cliente encontrado.</Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
            
            {clienteParaEditar && (
                <EditarClienteModal
                    isOpen={!!clienteParaEditar}
                    onClose={() => setClienteParaEditar(null)}
                    cliente={clienteParaEditar}
                    onUpdateSuccess={handleSuccess}
                />
            )}
            {clienteParaExcluir && (
                <ExcluirClienteModal
                    isOpen={!!clienteParaExcluir}
                    onClose={() => setClienteParaExcluir(null)}
                    cliente={clienteParaExcluir}
                    onDeleteSuccess={handleSuccess}
                />
            )}
        </Box>
    );
};


const AdminClientes = () => {
    const [refetchTrigger, setRefetchTrigger] = useState(0); 
    const handleCadastroSucesso = () => {
        setRefetchTrigger(prev => prev + 1);
    };

    return (
        <Box w="100%" p={4}>
            <Heading as="h2" size="lg" mb={8}>
                Gerenciar Clientes
            </Heading>
            
            <VStack spacing={8} align="stretch">
                <FormAdminCadastraCliente onCadastroSucesso={handleCadastroSucesso} />
                <ListaClientes refetchTrigger={refetchTrigger} />
            </VStack>
        </Box>
    );
}

export default AdminClientes;