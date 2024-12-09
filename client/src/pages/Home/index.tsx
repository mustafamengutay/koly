import { Box } from '@chakra-ui/react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import AppLayout from '../../components/layouts/AppLayout';

function Home() {
  return (
    <AppLayout>
      <Box>
        <Header />
        <Hero />
      </Box>
    </AppLayout>
  );
}

export default Home;
