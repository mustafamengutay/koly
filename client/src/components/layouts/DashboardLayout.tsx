import { Box } from '@chakra-ui/react';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import Footer from '../Footer/Footer';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box
      marginX={{ base: '8', lg: '16' }}
      marginY={{ base: '6', lg: '6' }}
      letterSpacing='tight'
    >
      <DashboardHeader />
      <Box
        maxWidth='breakpoint-2xl'
        minHeight='100dvh'
        marginTop='8'
        marginX='auto'
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
