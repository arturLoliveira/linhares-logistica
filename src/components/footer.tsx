import { Box, Text } from '@chakra-ui/react';

function Footer() {
    return(
        <Box 
            as="footer" 
            w="100%" 
            py={6} 
            bg="gray.800" 
            color="gray.200"
        >
          <Text textAlign="center" fontSize="md">
            © Todos os direitos reservados | Transportes Linhares
          </Text>
        </Box>
    )
}

export default Footer;