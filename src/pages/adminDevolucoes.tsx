import { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
} from '@chakra-ui/react';

function ListaDevolucoes() {
    type Devolucao = {
        id: number;
        nomeCliente: string;
        emailCliente: string;
        numeroNFOriginal: string;
        motivoDevolucao: string | null;
        dataSolicitacao: string;
    };

    const [devolucoes, setDevolucoes] = useState<Devolucao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const fetchDevolucoes = async () => {
            const token = localStorage.getItem('admin_token');
            const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';
            
            try {
                const response = await fetch(`${API_URL}/api/admin/devolucoes`, { //
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } //
                });

                if (!response.ok) throw new Error('Falha ao buscar solicitações.');
                
                const data: Devolucao[] = await response.json();
                setDevolucoes(data); 

            } catch (err) {
                setErro((err as Error).message); //
            } finally {
                setIsLoading(false); 
            }
        };

        fetchDevolucoes();
    }, []);

    if (isLoading) {
        return (
            <Box textAlign="center" p={10}>
                <Spinner size="xl" />
                <Text mt={2}>Carregando solicitações de devolução...</Text>
            </Box>
        );
    }

    if (erro) {
        return (
            <Alert status="error">
                <AlertIcon />
                {erro}
            </Alert>
        );
    }

    return (
        <Box w="100%">
            <Heading as="h4" size="md" mb={4}>Solicitações de Devolução Pendentes</Heading>
            {devolucoes.length === 0 ? (
                <Text>Nenhuma solicitação de devolução encontrada.</Text>
            ) : (
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Data</Th>
                                <Th>Cliente</Th>
                                <Th>Email</Th>
                                <Th>NF Original</Th>
                                <Th>Motivo</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {devolucoes.map((dev) => (
                                <Tr key={dev.id}>
                                    <Td>{new Date(dev.dataSolicitacao).toLocaleDateString()}</Td>
                                    <Td>{dev.nomeCliente}</Td>
                                    <Td>{dev.emailCliente}</Td>
                                    <Td>{dev.numeroNFOriginal}</Td>
                                    <Td>{dev.motivoDevolucao || 'N/A'}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

function AdminDevolucoes() {
    return (
        <Box w="100%" p={4}>
            <Heading as="h2" size="lg" mb={6}>
                Solicitações de Devolução
            </Heading>
            <ListaDevolucoes />
        </Box>
    );
}
export default AdminDevolucoes;