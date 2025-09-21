// T034 [P] Authentication components (Login, Register)
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Alert,
  Stack,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { LoginSchema, type LoginInput } from '../../schemas/validation';
import { authService } from '../../services/auth.service';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(data);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mb="md">
        Welcome back!
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          {error && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Login Error"
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </Stack>
      </form>

      <Text c="dimmed" size="sm" ta="center" mt="md">
        Don't have an account yet?{' '}
        <Anchor size="sm" component="button" onClick={onSwitchToRegister}>
          Create account
        </Anchor>
      </Text>
    </Paper>
  );
}