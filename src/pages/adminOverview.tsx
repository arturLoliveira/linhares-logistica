import { useState, useEffect } from 'react';
import { FaTruck, FaUndo, FaCheckDouble } from 'react-icons/fa';
import type { IconType } from 'react-icons'; 
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Spinner,
    Alert,
    AlertIcon,
    Center,
    HStack,
    VStack,
    Icon,
} from '@chakra-ui/react';

type StatsData = {
    coletasHoje: number;
    devolucoesPendentes: number;
    coletasEntregues: number; 
};

function AdminOverview() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('admin_token');
            setIsLoading(true);
            setError('');
            const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

            try {
                const response = await fetch(`${API_URL}/api/admin/stats`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar estatísticas.');
                }
                
                const data: StatsData = await response.json();
                setStats(data);

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []); 

    return (
        <Box w="100%" p={4}>
            <Heading as="h2" size="lg" mb={2}>
                Dashboard
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={6}>
                Seja bem-vindo ao painel de administração.
            </Text>
            
            <Box>
                {isLoading ? (
                    <Center p={10}>
                        <Spinner size="xl" />
                    </Center>
                ) : error ? (
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                ) : stats ? (
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <StatBox
                            label="Coletas Cadastradas Hoje"
                            value={stats.coletasHoje}
                            icon={FaTruck} 
                        />
                        <StatBox
                            label="Devoluções Pendentes"
                            value={stats.devolucoesPendentes}
                            icon={FaUndo}
                        />
                        <StatBox
                            label="Coletas Entregues (Total)"
                            value={stats.coletasEntregues}
                            icon={FaCheckDouble}
                        />
                    </SimpleGrid>
                ) : null}
            </Box>
            
            <Text fontSize="lg" color="gray.600" mt={8}>
                Use o menu ao lado para gerenciar as operações do sistema.
            </Text>
        </Box>
    );
}

function StatBox({ label, value, icon }: { label: string, value: number | string, icon: IconType }) {
    return (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
            <HStack spacing={4} align="center">
                <Icon as={icon} boxSize={12} color="blue.500" />
                <VStack align="flex-start" spacing={0}>
                    <Text fontSize="md" color="gray.500">{label}</Text>
                    <Text fontSize="4xl" fontWeight="bold">{value}</Text>
                </VStack>
            </HStack>
        </Box>
    );
}

export default AdminOverview;