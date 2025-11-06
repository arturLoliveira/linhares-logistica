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
                    m={{ base: 1, md: 4 }} 
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
                    <Text fontWeight="medium" display={{ base: 'none', sm: 'block' }}>{label}</Text>
                    <Text fontWeight="medium" display={{ base: 'block', sm: 'none' }}>{icon}</Text>
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
        <Flex direction={{ base: 'column', md: 'row' }}>
            <VStack
                as="nav"
                w={{ base: 'full', md: '250px' }}
                h={{ base: 'auto', md: '100vh' }}
                position={{ base: 'relative', md: 'fixed' }}
                top="0"
                left="0"
                bg="gray.900" 
                color="white"
                spacing={4}
                align="stretch"
                py={{ base: 2, md: 6 }} 
            >
                <Heading as="h2" size="lg" textAlign="center" mb={6} display={{ base: 'none', md: 'block' }}>
                    Painel Admin
                </Heading>
                
                <Flex 
                    direction={{ base: 'row', md: 'column' }} 
                    wrap="wrap" 
                    justify={{ base: 'space-around', md: 'flex-start' }}
                    align="center"
                    py={{ base: 0, md: 2 }} 
                    px={{ base: 2, md: 0 }} 
                >
                    <NavItem to="/admin/dashboard" icon={<FaTachometerAlt />} label="Dash" />
                    <NavItem to="/admin/coletas" icon={<FaTruckLoading />} label="Coletas" />
                    <NavItem to="/admin/devolucoes" icon={<FaUndo />} label="Devs" />
                    <NavItem to="/admin/clientes" icon={<FaUsers />} label="Clientes" />
                </Flex>
                
                <Spacer display={{ base: 'none', md: 'block' }} /> 
                
                <Button 
                    onClick={handleLogout} 
                    colorScheme="red"
                    variant="ghost" 
                    leftIcon={<FaSignOutAlt />}
                    justifyContent="flex-start" 
                    m={4} 
                    _hover={{ bg: "red.500", color: "white" }}
                    fontSize="2xl"
                    display={{ base: 'none', md: 'flex' }} 
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
                <Outlet />
            </Box>
        </Flex>
    );
}

export default AdminLayout;