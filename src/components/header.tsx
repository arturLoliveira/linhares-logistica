import { FaWhatsapp } from "react-icons/fa";
import logoDaEmpresa from '../assets/logo.png'; 
import { 
    Box, 
    Flex, 
    Image, 
    Link as ChakraLink, 
    Spacer, 
    HStack,
    Icon,
    Button 
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const linkWhatsapp = "https://wa.me/5531993751683?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20transportadora%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

function Header() {
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
                  h={{ base: '50px', md: '80px' }} 
                  objectFit="contain"
                />
            </RouterLink>
            
            <Spacer /> 

            <HStack spacing={{ base: 4, md: 8 }} align="center">
                <HStack spacing={{ base: 3, md: 6 }}>
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
                      leftIcon={<Icon as={FaWhatsapp} color="blue.500" />} 
                      fontSize={{ base: 'sm', md: 'lg' }}
                      _hover={{ textDecoration: 'none' }} 
                    >
                      Fale conosco
                    </Button>
                </HStack>
            </HStack>
          </Flex>
        </Box>
    )
}

export default Header;