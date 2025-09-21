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
import { CreateUserSchema, type CreateUserInput } from '../../schemas/validation';
import { authService } from '../../services/auth.service';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit = async (data: CreateUserInput) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.register(data);
      onSuccess?.();
    } catch (err: unknown) {
      setError((err as Error).message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mb="md">
        Create your account
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          {error && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Registration Error"
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

          <TextInput
            label="Display Name"
            placeholder="Your name (optional)"
            error={errors.displayName?.message}
            {...register('displayName')}
          />

          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
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
            Create account
          </Button>
        </Stack>
      </form>

      <Text c="dimmed" size="sm" ta="center" mt="md">
        Already have an account?{' '}
        <Anchor size="sm" component="button" onClick={onSwitchToLogin}>
          Sign in
        </Anchor>
      </Text>
    </Paper>
  );
}