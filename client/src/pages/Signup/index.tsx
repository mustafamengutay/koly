import { Box, Flex } from '@chakra-ui/react';
import SignupForm from '../../components/SignupForm/SignupForm';
import AppLayout from '../../components/layouts/AppLayout';

export default function Signup() {
  return (
    <AppLayout>
      <Box>
        <Flex
          height='100vh'
          as='main'
          justifyContent='center'
          alignItems='center'
        >
          <SignupForm />
        </Flex>
      </Box>
    </AppLayout>
  );
}
