import { Card, Input } from '@chakra-ui/react';
import Logo from '../Header/Logo';
import { Field } from '../ui/field';
import { PasswordInput } from '../ui/password-input';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <Card.Root borderRadius='lg' width='24rem'>
        <Card.Body gap='4' alignItems='center'>
          <Logo />
          <Card.Description>Log in to continue to koly</Card.Description>
          <Field
            label='Email'
            invalid={!!errors.email}
            errorText={errors.email?.message}
          >
            <Input
              padding='6'
              placeholder='example@email.com'
              borderRadius='lg'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Entered value does not match email format',
                },
              })}
            />
          </Field>

          <Field
            label='Password'
            invalid={!!errors.password}
            errorText={errors.password?.message}
          >
            <PasswordInput
              padding='6'
              placeholder='password'
              borderRadius='lg'
              {...register('password', { required: 'Password is required' })}
            />
          </Field>
        </Card.Body>
        <Card.Footer gap='4' justifyContent='center' flexDirection='column'>
          <Button
            type='submit'
            variant='solid'
            padding='6'
            size='md'
            width='full'
            borderRadius='lg'
          >
            Login
          </Button>
          <Link to='/signup' style={{ width: '100%' }}>
            <Button
              variant='outline'
              padding='6'
              size='md'
              width='full'
              borderRadius='lg'
            >
              Create an account
            </Button>
          </Link>
        </Card.Footer>
      </Card.Root>
    </form>
  );
}
