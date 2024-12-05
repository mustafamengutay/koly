import { Box, Flex } from '@chakra-ui/react';
import SignupForm from '../../components/SignupForm/SignupForm';

export default function Signup() {
  return (
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
  );
}
