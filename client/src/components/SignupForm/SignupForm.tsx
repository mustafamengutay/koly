import { Card, Input } from '@chakra-ui/react';
import Logo from '../Header/Logo';
import { Field } from '../ui/field';
import { PasswordInput } from '../ui/password-input';
import { Button } from '../ui/button';
import { Link } from 'react-router';

export default function SignupForm() {
  return (
    <Card.Root as='form' borderRadius='lg' width='24rem'>
      <Card.Body gap='4' alignItems='center'>
        <Logo />
        <Card.Description>Sign up to continue to koly</Card.Description>
        <Field label='Name' required>
          <Input padding='6' placeholder='John' borderRadius='lg' />
        </Field>
        <Field label='Surname' required>
          <Input padding='6' placeholder='Doe' borderRadius='lg' />
        </Field>
        <Field label='Email' required>
          <Input
            padding='6'
            placeholder='example@email.com'
            borderRadius='lg'
          />
        </Field>

        <Field label='Password' required>
          <PasswordInput padding='6' placeholder='password' borderRadius='lg' />
        </Field>
      </Card.Body>
      <Card.Footer gap='4' justifyContent='center' flexDirection='column'>
        <Button
          variant='solid'
          padding='6'
          size='md'
          width='full'
          borderRadius='lg'
        >
          Sign up
        </Button>
        <Link to='/login' style={{ width: '100%' }}>
          <Button
            variant='outline'
            padding='6'
            size='md'
            width='full'
            borderRadius='lg'
          >
            Already have an account?
          </Button>
        </Link>
      </Card.Footer>
    </Card.Root>
  );
}
