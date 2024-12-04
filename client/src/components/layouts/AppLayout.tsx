import { Box } from '@chakra-ui/react';

interface AppLayoutProps {
  children?: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      marginLeft={{ base: '8', lg: '16' }}
      marginRight={{ base: '8', lg: '16' }}
      letterSpacing='tight'
    >
      {children}
    </Box>
  );
}

export default AppLayout;
