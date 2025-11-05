import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

import { Flex, Box } from '@chakra-ui/react';

function Layout() {
  return (
    
    <Flex direction="column" minH="100vh">
      <Header />
      <Box as="main" flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
}

export default Layout;