import { Box } from '@chakra-ui/react';
import Footer from '../Footer/Footer';

interface AppLayoutProps {
  children?: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      marginLeft={{ base: '8', lg: '16' }}
      marginRight={{ base: '8', lg: '16' }}
      letterSpacing='tight'
      minHeight='100dvh'
    >
      <Box minHeight='100dvh'>{children}</Box>
      <Footer />
    </Box>
  );
}

export default AppLayout;
