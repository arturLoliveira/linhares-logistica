import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
    FaTachometerAlt, FaTruckLoading, FaUndo, 
    FaUsers, FaSignOutAlt, FaBars 
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
    Drawer, 
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure, 
    IconButton 
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

const SidebarContent = ({ onLogout }: { onLogout: () => void }) => (
    <VStack
        h="full" 
        py={6}
        spacing={4}
        align="stretch"
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
            onClick={onLogout} 
            colorScheme="red"
            variant="ghost" 
            leftIcon={<FaSignOutAlt />}
            justifyContent="flex-start" 
            m={4} 
            _hover={{ bg: "red.500", color: "white" }}
        >
            Sair
        </Button>
    </VStack>
);

function AdminLayout() {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure(); 

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
    };

    return (
        <Flex>
            <Box
                as="nav"
                w="250px"
                h="100vh"
                position="fixed"
                top="0"
                left="0"
                bg="gray.900" 
                color="white"
                display={{ base: 'none', md: 'block' }}
            >
                <SidebarContent onLogout={handleLogout} />
            </Box>

            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg="gray.900" color="white">
                    <DrawerCloseButton />
                    <DrawerHeader>Painel Admin</DrawerHeader>
                    <DrawerBody p={0}>
                        <SidebarContent onLogout={handleLogout} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            
            <Box 
                as="main" 
                ml={{ base: 0, md: '250px' }} 
                w="full" 
                bg="gray.50" 
                minH="100vh"
            >
                <Flex
                    as="header"
                    display={{ base: 'flex', md: 'none' }}
                    align="center"
                    justify="space-between"
                    p={4}
                    bg="white"
                    borderBottomWidth="1px"
                >
                    <IconButton
                        aria-label="Abrir menu"
                        icon={<FaBars />}
                        onClick={onOpen} 
                        variant="ghost"
                    />
                    <Heading as="h2" size="md">Painel</Heading>
                    <Box w="40px" /> 
                </Flex>

                <Box p={{ base: 4, md: 8 }}>
                    <Outlet />
                </Box>
            </Box>
        </Flex>
    );
}

export default AdminLayout;