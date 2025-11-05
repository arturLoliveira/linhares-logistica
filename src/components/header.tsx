import { FaWhatsapp, FaBars } from "react-icons/fa"; 
import logoDaEmpresa from '../assets/logo.png'; 
import { 
    Box, 
    Flex, 
    Image, 
    Link as ChakraLink, 
    Spacer, 
    HStack,
    Icon,
    Button,
    IconButton,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,
    DrawerHeader
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const linkWhatsapp = "https://wa.me/5531993751683?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20transportadora%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return(
        <Box 
            as="header" 
            w="100%" 
            py={1} 
            px={{ base: 4, md: 8 }} 
            bg="white" 
            shadow="sm"
        >
          <Flex align="center" maxW="1400px" mx="auto">
            
            <RouterLink to="/">
                <Image 
                  src={logoDaEmpresa} 
                  alt="Logo Transportes Linhares" 
                  h={{ base: '120px', md: '140px' }} 
                  objectFit="contain"
                />
            </RouterLink>
            
            <Spacer /> 

            <HStack 
                spacing={{ base: 3, md: 6 }} 
                display={{ base: 'none', md: 'flex' }} 
                align="center"
            >
                <ChakraLink 
                    as={RouterLink} 
                    to="/area-cliente" 
                    color="gray.600"
                    fontWeight="medium"
                    _hover={{ color: 'blue.500', textDecoration: 'none' }}
                    fontSize={{ base: 'sm', md: 'lg' }} 
                >
                    Área do Cliente
                </ChakraLink>
                <ChakraLink 
                    as={RouterLink} 
                    to="/admin" 
                    color="gray.600"
                    fontWeight="medium"
                    _hover={{ color: 'blue.500', textDecoration: 'none' }}
                    fontSize={{ base: 'sm', md: 'lg' }}
                >
                    Admin
                </ChakraLink>
                <Button
                  as={ChakraLink} 
                  href={linkWhatsapp}
                  target='_blank'
                  isExternal
                  variant="outline"
                  colorScheme="blue"
                  leftIcon={<Icon as={FaWhatsapp} color="green.500" />}
                  fontSize={{ base: 'sm', md: 'lg' }}
                  _hover={{ textDecoration: 'none' }} 
                >
                  Fale conosco
                </Button>
            </HStack>

            <IconButton
                aria-label="Abrir menu"
                icon={<FaBars />}
                display={{ base: 'flex', md: 'none' }} 
                onClick={onOpen} 
                variant="ghost"
                fontSize="2xl"
            />

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Navegação</DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={5} align="stretch" mt={5}>
                            <Button as={RouterLink} to="/area-cliente" variant="ghost" size="lg" onClick={onClose}>
                                Área do Cliente
                            </Button>
                            <Button as={RouterLink} to="/admin" variant="ghost" size="lg" onClick={onClose}>
                                Admin
                            </Button>
                            <Button as={ChakraLink} href={linkWhatsapp} isExternal colorScheme="blue" size="lg" onClick={onClose}>
                                Fale conosco
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

          </Flex>
        </Box>
    )
}

export default Header;