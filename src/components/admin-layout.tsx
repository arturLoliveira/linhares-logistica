import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
    FaTachometerAlt, FaTruckLoading, FaUndo, 
    FaUsers, FaSignOutAlt, FaBars // Importar FaBars para o menu hamburger
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
    IconButton, 
    useDisclosure, 
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';


const NavItem = ({ to, icon, label, onClose }: { to: string, icon: JSX.Element, label: string, onClose?: () => void }) => {
    return (
        <NavLink 
            to={to} 
            onClick={onClose}
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

const NavigationLinks = ({ onClose }: { onClose?: () => void }) => (
    <VStack spacing={2} align="stretch">
        <NavItem to="/admin/dashboard" icon={<FaTachometerAlt />} label="Dashboard" onClose={onClose} />
        <NavItem to="/admin/coletas" icon={<FaTruckLoading />} label="Coletas" onClose={onClose} />
        <NavItem to="/admin/devolucoes" icon={<FaUndo />} label="Devoluções" onClose={onClose} />
        <NavItem to="/admin/clientes" icon={<FaUsers />} label="Clientes" onClose={onClose} />
        <NavItem to="/admin/funcionarios" icon={<FaUsers />} label="Motoristas" onClose={onClose} /> 
    </VStack>
);


function AdminLayout() {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure(); 

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/');
    };

    const Sidebar = () => (
        <VStack
            as="nav"
            w="250px"
            h="100vh"
            position="fixed"
            top="0"
            left="0"
            bg="gray.900" 
            color="white"
            spacing={4}
            align="stretch"
            py={6}
            display={{ base: 'none', md: 'flex' }} 
            boxShadow="xl"
        >
            <Heading as="h2" size="lg" textAlign="center" mb={6}>
                Painel Admin
            </Heading>
            
            <NavigationLinks />
            
            <Spacer /> 
            
            <Button 
                onClick={handleLogout} 
                colorScheme="red"
                variant="ghost" 
                leftIcon={<FaSignOutAlt />}
                justifyContent="flex-start" 
                m={4} 
                _hover={{ bg: "red.500", color: "white" }}
                fontSize="xl"
            >
                Sair
            </Button>
        </VStack>
    );

    const MobileNav = () => (
        <>
            <Flex 
                px={4}
                py={3}
                alignItems="center"
                justifyContent="space-between"
                bg="white"
                borderBottom="1px solid"
                borderColor="gray.200"
                display={{ base: 'flex', md: 'none' }} 
                position="sticky"
                top="0"
                zIndex="sticky"
            >
                <IconButton
                    onClick={onOpen}
                    variant="outline"
                    aria-label="open menu"
                    icon={<FaBars />}
                />
                <Heading as="h3" size="md" color="gray.800">
                    Admin
                </Heading>
                <Button 
                    onClick={handleLogout} 
                    colorScheme="red" 
                    size="sm"
                    variant="ghost" 
                    leftIcon={<FaSignOutAlt />}
                >
                    Sair
                </Button>
            </Flex>

            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg="gray.900" color="white">
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
                        Painel Admin
                    </DrawerHeader>
                    <DrawerBody px={0}>
                        <NavigationLinks onClose={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );

    return (
        <Box>
            <Sidebar />
            <MobileNav />
            
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
        </Box>
    );
}

export default AdminLayout;