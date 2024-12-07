import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { RiNotificationLine } from 'react-icons/ri';
import { Avatar } from '../ui/avatar';

export default function DashboardActions() {
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const day = new Date().toLocaleString('en-us', { weekday: 'long' });

  return (
    <Flex display={{ base: 'none', lg: 'flex' }} gap='4' alignItems='center'>
      <Box>
        <Text fontSize='sm' textWrap='nowrap' color='fg.muted'>
          {day}, {hours}.{minutes}
        </Text>
      </Box>
      <IconButton variant='outline' borderRadius='lg'>
        <RiNotificationLine />
      </IconButton>
      <Avatar />
    </Flex>
  );
}
