import { Box, Separator } from '@chakra-ui/react';
import { Button } from '../ui/button';

export default function DashboardNavigation() {
  return (
    <Box
      as='menu'
      listStyle='none'
      borderStyle='solid'
      borderWidth='thin'
      borderRadius='lg'
      padding='2'
      maxWidth='fit-content'
      display={{ base: 'none', lg: 'flex' }}
      alignItems='center'
      gap='2'
    >
      <li>
        <Button as='a' variant='ghost' borderRadius='lg'>
          My Dashboard
        </Button>
      </li>
      <li>
        <Separator orientation='vertical' height='4' />
      </li>
      <li>
        <Button as='a' variant='ghost' borderRadius='lg'>
          My Issues
        </Button>
      </li>
      <li>
        <Separator orientation='vertical' height='4' />
      </li>
      <li>
        <Button as='a' variant='ghost' borderRadius='lg'>
          Invitations
        </Button>
      </li>
    </Box>
  );
}
