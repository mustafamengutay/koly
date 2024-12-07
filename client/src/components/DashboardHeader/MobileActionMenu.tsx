import { Box, Stack, Text } from '@chakra-ui/react';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { Button } from '../ui/button';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Link } from 'react-router';
import { Avatar } from '../ui/avatar';

export default function DashboardMobileActionMenu() {
  return (
    <Box display={{ lg: 'none' }}>
      <DrawerRoot size='full'>
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <Button variant='outline' size='sm'>
            <RxHamburgerMenu />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Dashboard Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerBody marginLeft='12' marginRight='12'>
            <Stack alignItems='center'>
              <Avatar size='2xl' />
            </Stack>
            <Stack marginTop='8' gap='4'>
              <Link to='/dashboard'>
                <Button variant='outline' width='full' borderRadius='lg'>
                  My Dashboard
                </Button>
              </Link>
              <Link to='/issues'>
                <Button variant='outline' width='full' borderRadius='lg'>
                  My Issues
                </Button>
              </Link>
              <Link to='/inbox'>
                <Button variant='outline' width='full' borderRadius='lg'>
                  Inbox
                </Button>
              </Link>
              <Link to='/invitations'>
                <Button variant='outline' width='full' borderRadius='lg'>
                  Invitations
                </Button>
              </Link>
              <Link to='/'>
                <Button width='full' borderRadius='lg'>
                  Log out
                </Button>
              </Link>
            </Stack>
          </DrawerBody>
          <DrawerFooter display='flex' justifyContent='center'>
            <Text>2024. koly.</Text>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </Box>
  );
}
