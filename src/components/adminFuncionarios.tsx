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
    SimpleGrid,
    Flex,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    HStack,
} from '@chakra-ui/react';
import { FaUserPlus, FaUsers } from 'react-icons/fa';

interface Funcionario {
    id: number;
    nome: string;
    email: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

function EditarFuncionarioModal({ isOpen, onClose, funcionario, onUpdateSuccess }: { isOpen: boolean, onClose: () => void, funcionario: Funcionario, onUpdateSuccess: () => void }) {
    const [nome, setNome] = useState(funcionario.nome);
    const [email, setEmail] = useState(funcionario.email);
    const [senha, setSenha] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        setNome(funcionario.nome);
        setEmail(funcionario.email);
        setSenha('');
    }, [funcionario]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('admin_token');
        
        const updateData: { nome: string, email: string, senha?: string } = { nome, email };
        if (senha) {
            updateData.senha = senha;
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/funcionarios/${funcionario.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                 const data = await response.json();
                 throw new Error(data.error || 'Falha ao atualizar o funcionário.');
            }
            
            toast({
                title: 'Sucesso!',
                description: `Funcionário(a) ${nome} atualizado(a) com sucesso.`,
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
                <ModalHeader>Editar: {funcionario.nome}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Nome Completo</FormLabel>
                            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>E-mail (Login)</FormLabel>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Nova Senha (Deixe vazio para manter a atual)</FormLabel>
                            <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Opcional" />
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

function ExcluirFuncionarioModal({ isOpen, onClose, funcionario, onDeleteSuccess }: { isOpen: boolean, onClose: () => void, funcionario: Funcionario, onDeleteSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleDelete = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch(`${API_URL}/api/admin/funcionarios/${funcionario.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                 const data = await response.json();
                 throw new Error(data.error || 'Falha ao excluir o funcionário.');
            }
            
            toast({
                title: 'Excluído!',
                description: `Funcionário(a) ${funcionario.nome} foi removido(a).`,
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
                        Você tem certeza que deseja excluir permanentemente o(a) funcionário(a) 
                        <Text as="span" fontWeight="bold"> {funcionario.nome}</Text>?
                        Esta ação é irreversível.
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


function FormCadastraFuncionario({ onCadastroSucesso }: { onCadastroSucesso: () => void }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch(`${API_URL}/api/admin/funcionarios`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ email, senha, nome }),
            });

            if (response.status === 403) {
                throw new Error('Permissão negada. Apenas Administradores podem cadastrar.');
            }
            if (!response.ok) {
                 const data = await response.json();
                 throw new Error(data.error || 'Falha ao cadastrar o funcionário.');
            }
            
            toast({
                title: 'Cadastro Efetuado!',
                description: `Funcionário(a) ${nome} cadastrado com sucesso.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            setEmail('');
            setSenha('');
            setNome('');
            onCadastroSucesso();

        } catch (error) {
            toast({
                title: 'Erro no Cadastro.',
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
        <Box 
            as="form" 
            onSubmit={handleSubmit} 
            p={6} 
            borderWidth="1px" 
            borderRadius="lg" 
            boxShadow="md"
        >
            <Flex align="center" mb={6}>
                 <Icon as={FaUserPlus} w={6} h={6} mr={2} color="blue.600" />
                 <Heading as="h4" size="md">Cadastrar Novo Funcionário (Motorista)</Heading>
            </Flex>
           
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                        <FormLabel>Nome Completo</FormLabel>
                        <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome Completo" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>E-mail (Login)</FormLabel>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail (Login)" />
                    </FormControl>
                </VStack>
                <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                        <FormLabel>Senha Inicial</FormLabel>
                        <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha Inicial" />
                    </FormControl>
                    <Box mt={{ base: 0, md: '32px' }}>
                        <Button 
                            type="submit" 
                            colorScheme="blue" 
                            isLoading={isLoading}
                            w="100%"
                        >
                            Salvar Motorista
                        </Button>
                    </Box>
                </VStack>
            </SimpleGrid>
        </Box>
    );
}

function ListaFuncionarios({ shouldRefetch }: { shouldRefetch: boolean }) {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState('');
    
    const [funcionarioParaEditar, setFuncionarioParaEditar] = useState<Funcionario | null>(null);
    const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<Funcionario | null>(null);

    const fetchFuncionarios = useCallback(async () => {
        const token = localStorage.getItem('admin_token');
        setIsLoading(true);
        setErro('');
        
        try {
            const response = await fetch(`${API_URL}/api/admin/funcionarios`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    throw new Error(data.error || `Falha ao buscar (Status: ${response.status}).`);
                } else {
                    throw new Error('Erro de Conexão/Permissão: Verifique seu token de Administrador.');
                }
            }
            
            const data: Funcionario[] = await response.json();
            setFuncionarios(data);

        } catch (err) {
            setErro((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]); 

    useEffect(() => {
        fetchFuncionarios();
    }, [fetchFuncionarios, shouldRefetch]);

    const handleUpdateOrDeleteSuccess = () => {
        fetchFuncionarios();
    };

    return (
        <Box w="100%" mt={10}>
             <Flex align="center" mb={4}>
                 <Icon as={FaUsers} w={6} h={6} mr={2} color="gray.600" />
                 <Heading as="h4" size="md">Funcionários Cadastrados</Heading>
            </Flex>

            {isLoading && (
                <Box textAlign="center" p={5}>
                    <Spinner size="md" />
                    <Text mt={2}>Carregando lista...</Text>
                </Box>
            )}
            
            {erro && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {erro}
                </Alert>
            )}
            
            {!isLoading && funcionarios.length > 0 && (
                <TableContainer>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Nome</Th>
                                <Th>E-mail (Login)</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {funcionarios.map((f) => (
                                <Tr key={f.id}>
                                    <Td>{f.id}</Td>
                                    <Td>{f.nome}</Td>
                                    <Td>{f.email}</Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <Button 
                                                size="xs" 
                                                colorScheme="orange"
                                                onClick={() => setFuncionarioParaEditar(f)}
                                            >
                                                Editar
                                            </Button>
                                            <Button 
                                                size="xs" 
                                                colorScheme="red"
                                                onClick={() => setFuncionarioParaExcluir(f)}
                                            >
                                                Excluir
                                            </Button>
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
            {!isLoading && funcionarios.length === 0 && !erro && (
                <Text>Nenhum funcionário cadastrado.</Text>
            )}
            
            {funcionarioParaEditar && (
                <EditarFuncionarioModal
                    isOpen={!!funcionarioParaEditar}
                    onClose={() => setFuncionarioParaEditar(null)}
                    funcionario={funcionarioParaEditar}
                    onUpdateSuccess={handleUpdateOrDeleteSuccess}
                />
            )}
            {funcionarioParaExcluir && (
                <ExcluirFuncionarioModal
                    isOpen={!!funcionarioParaExcluir}
                    onClose={() => setFuncionarioParaExcluir(null)}
                    funcionario={funcionarioParaExcluir}
                    onDeleteSuccess={handleUpdateOrDeleteSuccess}
                />
            )}
        </Box>
    );
}


const AdminFuncionarios = () => {
    const [refetchTrigger, setRefetchTrigger] = useState(0); 

    const handleCadastroSucesso = () => {
        setRefetchTrigger(prev => prev + 1);
    };

    return (
        <Box w="100%">
            <Heading as="h2" size="lg" mb={8}>
                Gestão de Funcionários e Motoristas
            </Heading>

            <Box maxW={{ base: 'full', md: '800px' }} mx="auto">
                <FormCadastraFuncionario onCadastroSucesso={handleCadastroSucesso} />
            </Box>

            <ListaFuncionarios shouldRefetch={refetchTrigger > 0} />
        </Box>
    );
};

export default AdminFuncionarios;