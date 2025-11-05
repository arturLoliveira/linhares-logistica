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
            h={{ base: '75vh', md: '80vh' }} 
            position="relative" 
            bgImage={HERO_IMAGE_URL}
            bgSize="cover"
            bgPosition={{ base: 'top center', md: 'center' }}
            bgRepeat="no-repeat"
            display="flex"
            alignItems="center"
            justifyContent="center" 
            bgAttachment="fixed" 
         >
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.600"
                zIndex={1}
            />
            
            <Container 
                maxW="container.lg" 
                position="relative" 
                zIndex={2} 
            >
                <VStack 
                    spacing={6} 
                    align="center" 
                    textAlign="center" 
                    maxW="650px"
                    mx="auto"
                >
                    <Heading 
                        as="h1" 
                        size={{ base: 'xl', md: '3xl' }}
                        color="white"
                        textShadow="2px 2px 4px rgba(0,0,0,0.8)"
                    >
                        Sua carga, nossa prioridade.
                    </Heading>
                    <Text 
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color="gray.200"
                        textShadow="1px 1px 3px rgba(0,0,0,0.8)"
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