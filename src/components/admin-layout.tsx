import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
    FaTachometerAlt, FaTruckLoading, FaUndo, 
    FaUsers, FaSignOutAlt 
} from 'react-icons/fa';
import type { JSX } from 'react';
import {
    Box,
    Flex,
    VStack,
    Heading,
    Text,
    Spacer,
    Button,
} from '@chakra-ui/react';


const NavItem = ({ to, icon, label }: { to: string, icon: JSX.Element, label: string }) => {
    return (
        <NavLink 
            to={to} 
        >
            {({ isActive }) => (
                <Flex
                    align="center"
                    p={3}
                    mx={4}
                    borderRadius="md"
                    cursor="pointer"
                    
                    color={isActive ? "white" : "gray.400"}
                    bg={isActive ? "blue.500" : "transparent"}
                    _hover={{
                        bg: isActive ? "blue.600" : "gray.700",
                        color: "white"
                    }}
                    role="group" 
                >
                    <Box 
                        mr={3} 
                        color={isActive ? "white" : "gray.500"}
                        _groupHover={{ color: "white" }}
                    >
                        {icon}
                    </Box>
                    <Text fontWeight="medium">{label}</Text>
                </Flex>
            )}
        </NavLink>
    );
};


function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/');
    };

    return (
        <Flex>
            <VStack
                as="nav"
                w="250px"
                h="100vh"
                position={{ base: 'relative', md: 'fixed' }} 
                display={{ base: 'none', md: 'flex' }} 
                // -----------------------------------------------------------
                top="0"
                left="0"
                bg="gray.900" 
                color="white"
                spacing={4}
                align="stretch"
                py={6}
                boxShadow={{ base: 'none', md: 'xl' }} 
            >
                <Heading as="h2" size="lg" textAlign="center" mb={6}>
                    Painel Admin
                </Heading>
                
                <VStack spacing={2} align="stretch">
                    <NavItem to="/admin/dashboard" icon={<FaTachometerAlt />} label="Dashboard" />
                    <NavItem to="/admin/coletas" icon={<FaTruckLoading />} label="Coletas" />
                    <NavItem to="/admin/devolucoes" icon={<FaUndo />} label="Devoluções" />
                    <NavItem to="/admin/clientes" icon={<FaUsers />} label="Clientes" />
                </VStack>
                
                <Spacer /> 
                
                <Button 
                    onClick={handleLogout} 
                    colorScheme="red"
                    variant="ghost" 
                    leftIcon={<FaSignOutAlt />}
                    justifyContent="flex-start" 
                    m={4} 
                    _hover={{ bg: "red.500", color: "white" }}
                    fontSize="2xl"
                >
                    Sair
                </Button>
            </VStack>
            
            <Box 
                as="main" 
                ml={{ base: '0', md: '250px' }} 
                w="full" 
                p={8} 
                bg="gray.50" 
                minH="100vh"
            >
                <Box 
                    display={{ base: 'block', md: 'none' }} 
                    mb={4} 
                    pb={2} 
                    borderBottom="1px solid" 
                    borderColor="gray.300"
                >
                    <Heading as="h3" size="md">Admin</Heading>
                    <Text fontSize="sm" color="gray.600">Acesso via Desktop para menu completo</Text>
                </Box>
                
                <Outlet />
            </Box>
        </Flex>
    );
}

export default AdminLayout;