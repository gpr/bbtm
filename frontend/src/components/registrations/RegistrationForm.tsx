// T038 [P] Registration form component
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Paper,
  TextInput,
  Select,
  Button,
  Stack,
  Group,
  Title,
  Text,
  Alert,
  Divider,
} from '@mantine/core';
import { IconAlertCircle, IconUserPlus, IconX } from '@tabler/icons-react';
import { RegistrationFormSchema, type RegistrationFormInput } from '../../schemas/validation';
import { TeamRace, getTeamRaceOptions } from '../../types/enums';
import { Tournament } from '../../types/tournament';
import { CoachRegistration } from '../../types/registration';
import { registrationService } from '../../services/registration.service';
import { authService } from '../../services/auth.service';
import { errorService } from '../../services/error.service';

interface RegistrationFormProps {
  tournament: Tournament;
  registration?: CoachRegistration; // For editing existing registration
  onSuccess?: (registration: CoachRegistration) => void;
  onCancel?: () => void;
}

export function RegistrationForm({
  tournament,
  registration,
  onSuccess,
  onCancel
}: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!registration;
  const currentUser = authService.getCurrentUser();
  const isAnonymous = !currentUser;

  const teamRaceOptions = getTeamRaceOptions().map(option => ({
    value: option.value,
    label: option.label,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormInput>({
    resolver: zodResolver(RegistrationFormSchema),
    defaultValues: {
      alias: registration?.alias || '',
      email: registration?.email || currentUser?.email || '',
      teamRace: registration?.teamRace || '',
      fullName: registration?.fullName || '',
      nafNumber: registration?.nafNumber || '',
      teamName: registration?.teamName || '',
    },
  });

  const selectedTeamRace = watch('teamRace');

  const onSubmit = async (data: RegistrationFormInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const requestData = {
        alias: data.alias,
        email: data.email,
        teamRace: data.teamRace as TeamRace,
        fullName: data.fullName || undefined,
        nafNumber: data.nafNumber || undefined,
        teamName: data.teamName || undefined,
      };

      let result;
      if (isEditing && registration) {
        result = await registrationService.updateRegistration(
          tournament.id,
          registration.id,
          requestData
        );
      } else {
        result = await registrationService.createRegistration(tournament.id, requestData);
      }

      const registrationData: CoachRegistration = {
        ...result.registration,
        registeredAt: new Date(result.registration.registeredAt) as any,
      };

      errorService.showSuccess(
        isEditing
          ? 'Registration updated successfully!'
          : 'Registration submitted successfully!'
      );
      onSuccess?.(registrationData);
    } catch (err: any) {
      const appError = errorService.handleError(err, 'RegistrationForm.onSubmit');
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if registration is still open
  const canRegister = tournament.registrationOpen &&
    (!tournament.registrationDeadline || new Date() <= tournament.registrationDeadline) &&
    (!tournament.maxParticipants || tournament.participantCount < tournament.maxParticipants);

  if (!canRegister && !isEditing) {
    return (
      <Paper radius="md" p="xl" withBorder>
        <Alert color="orange" title="Registration Closed">
          Registration for this tournament is currently closed.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper radius="md" p="xl" withBorder>
      <Stack spacing="lg">
        {/* Header */}
        <div>
          <Title order={2} mb="xs">
            {isEditing ? 'Edit Registration' : 'Register for Tournament'}
          </Title>
          <Text size="sm" c="dimmed">
            {tournament.name}
          </Text>
          {isAnonymous && !isEditing && (
            <Text size="sm" c="blue" mt="xs">
              You're registering as an anonymous user. No account required!
            </Text>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing="md">
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

            {/* Required Fields */}
            <Divider label="Required Information" labelPosition="left" />

            <TextInput
              label="Coach Alias"
              placeholder="Your coach name/nickname"
              required
              description="This is how you'll be displayed in the tournament"
              error={errors.alias?.message}
              {...register('alias')}
            />

            <TextInput
              label="Email Address"
              placeholder="your@email.com"
              type="email"
              required
              description="Used for tournament communications"
              error={errors.email?.message}
              {...register('email')}
              disabled={!isAnonymous && !isEditing} // Auto-fill for logged-in users
            />

            <Select
              label="Team Race"
              placeholder="Select your team race"
              required
              data={teamRaceOptions}
              value={selectedTeamRace}
              onChange={(value) => setValue('teamRace', value as TeamRace || '')}
              error={errors.teamRace?.message}
              searchable
              description="Choose the race of your Blood Bowl team"
            />

            {/* Optional Fields */}
            <Divider label="Optional Information" labelPosition="left" />

            <TextInput
              label="Full Name"
              placeholder="Your real name (optional)"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <TextInput
              label="NAF Number"
              placeholder="Your NAF membership number (optional)"
              description="National Association of Football membership number"
              error={errors.nafNumber?.message}
              {...register('nafNumber')}
            />

            <TextInput
              label="Team Name"
              placeholder="Your team's name (optional)"
              description="The name of your Blood Bowl team"
              error={errors.teamName?.message}
              {...register('teamName')}
            />

            {/* Tournament Info */}
            <Alert color="blue" title="Tournament Information" variant="light">
              <Stack spacing="xs">
                <Text size="sm">
                  <strong>Participants:</strong> {tournament.participantCount}
                  {tournament.maxParticipants && ` / ${tournament.maxParticipants}`}
                </Text>
                {tournament.registrationDeadline && (
                  <Text size="sm">
                    <strong>Registration Deadline:</strong>{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(tournament.registrationDeadline)}
                  </Text>
                )}
                {tournament.startDate && (
                  <Text size="sm">
                    <strong>Tournament Start:</strong>{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }).format(tournament.startDate)}
                  </Text>
                )}
              </Stack>
            </Alert>

            {/* Form Actions */}
            <Group justify="flex-end" mt="lg">
              <Button
                variant="outline"
                leftSection={<IconX size={16} />}
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftSection={<IconUserPlus size={16} />}
                loading={isLoading}
                disabled={isLoading}
              >
                {isEditing ? 'Update Registration' : 'Submit Registration'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}