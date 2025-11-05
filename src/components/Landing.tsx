// import styles from '../styles/landing.module.css'; // <-- Removido
import { 
    Box, 
    Container, 
    Heading, 
    Text, 
    VStack 
} from '@chakra-ui/react';

import heroImageUrl from '../assets/caminhao.jpg';

const HERO_IMAGE_URL = `url(${heroImageUrl})`;

function Landing() {
    return(
         <Box
            as="section"
            w="100%"
            h={{ base: '55vh', md: '65vh' }} 
            minH="600px" 
            position="relative" 
            bgImage={HERO_IMAGE_URL}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            display="flex"
            alignItems="center"
            justifyContent="center" // Garante a centralização geral
            bgAttachment="fixed" 
         >
            {/* Overlay escuro para legibilidade do texto */}
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.600"
                zIndex={1}
            />
            
            {/* Conteúdo de Texto */}
            <Container 
                maxW="container.lg" 
                position="relative" 
                zIndex={2} // Coloca o texto acima do overlay
            >
                {/* --- ATUALIZADO AQUI --- */}
                <VStack 
                    spacing={6} 
                    align="center" // Centraliza o conteúdo horizontalmente
                    textAlign="center" // Centraliza o texto
                    maxW="650px"
                    mx="auto" // Garante que o VStack em si esteja no meio
                >
                    <Heading 
                        as="h1" 
                        size={{ base: 'xl', md: '3xl' }}
                        color="white"
                    >
                        Sua carga, nossa prioridade.
                    </Heading>
                    <Text 
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color="gray.200"
                    >
                      Mais do que uma transportadora, somos o parceiro logístico 
                      que sua empresa precisa para crescer. Entregas em toda 
                      região central de Minas Gerais com a agilidade que o 
                      seu negócio exige.
                    </Text>
                </VStack>
            </Container>
        </Box>
    )
}

export default Landing;