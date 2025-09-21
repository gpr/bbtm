// T037 [P] Tournament form component
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Paper,
  TextInput,
  Textarea,
  Switch,
  Button,
  Stack,
  Group,
  Title,
  Alert,
  Divider,
} from '@mantine/core';
import { IconAlertCircle, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { TournamentFormSchema, type TournamentFormInput } from '../../schemas/validation';
import type { Tournament, CreateTournamentRequest, UpdateTournamentRequest } from '../../types/tournament';
import { tournamentService } from '../../services/tournament.service';
import { errorService } from '../../services/error.service';

interface TournamentFormProps {
  tournament?: Tournament; // For editing existing tournament
  onSuccess?: (tournament: Tournament) => void;
  onCancel?: () => void;
}

export function TournamentForm({ tournament, onSuccess, onCancel }: TournamentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!tournament;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TournamentFormInput>({
    resolver: zodResolver(TournamentFormSchema),
    defaultValues: {
      name: tournament?.name || '',
      description: tournament?.description || '',
      maxParticipants: tournament?.maxParticipants?.toString() || '',
      registrationDeadline: tournament?.registrationDeadline
        ? (tournament.registrationDeadline?.toDate ? tournament.registrationDeadline.toDate() : new Date(tournament.registrationDeadline as any)).toISOString().slice(0, 16)
        : '',
      startDate: tournament?.startDate
        ? (tournament.startDate?.toDate ? tournament.startDate.toDate() : new Date(tournament.startDate as any)).toISOString().slice(0, 16)
        : '',
      endDate: tournament?.endDate
        ? (tournament.endDate?.toDate ? tournament.endDate.toDate() : new Date(tournament.endDate as any)).toISOString().slice(0, 16)
        : '',
      isPublic: tournament?.isPublic ?? true,
    },
  });

  const onSubmit = async (data: TournamentFormInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const requestData: CreateTournamentRequest | UpdateTournamentRequest = {
        name: data.name,
        description: data.description || undefined,
        maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : undefined,
        registrationDeadline: data.registrationDeadline || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        isPublic: data.isPublic,
      };

      let result;
      if (isEditing && tournament) {
        result = await tournamentService.updateTournament(tournament.id, requestData as UpdateTournamentRequest);
      } else {
        result = await tournamentService.createTournament(requestData as CreateTournamentRequest);
      }

      const tournamentData: Tournament = {
        ...result.tournament,
        registrationDeadline: result.tournament.registrationDeadline
          ? new Date(result.tournament.registrationDeadline) as any
          : undefined,
        startDate: result.tournament.startDate
          ? new Date(result.tournament.startDate) as any
          : undefined,
        endDate: result.tournament.endDate
          ? new Date(result.tournament.endDate) as any
          : undefined,
        createdAt: new Date(result.tournament.createdAt) as any,
        updatedAt: new Date(result.tournament.updatedAt) as any,
      };

      errorService.showSuccess(
        isEditing ? 'Tournament updated successfully!' : 'Tournament created successfully!'
      );
      onSuccess?.(tournamentData);
    } catch (err: any) {
      const appError = errorService.handleError(err, 'TournamentForm.onSubmit');
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} mb="lg">
        {isEditing ? 'Edit Tournament' : 'Create New Tournament'}
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          {error && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Error"
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          {/* Basic Information */}
          <TextInput
            label="Tournament Name"
            placeholder="Enter tournament name"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            label="Description"
            placeholder="Describe your tournament (optional)"
            minRows={3}
            maxRows={6}
            error={errors.description?.message}
            {...register('description')}
          />

          <TextInput
            label="Maximum Participants"
            placeholder="Leave empty for unlimited"
            type="number"
            min={1}
            max={1000}
            error={errors.maxParticipants?.message}
            {...register('maxParticipants')}
          />

          <Divider label="Tournament Schedule" labelPosition="left" />

          {/* Date and Time Settings */}
          <TextInput
            label="Registration Deadline"
            type="datetime-local"
            error={errors.registrationDeadline?.message}
            {...register('registrationDeadline')}
          />

          <TextInput
            label="Tournament Start Date"
            type="datetime-local"
            error={errors.startDate?.message}
            {...register('startDate')}
          />

          <TextInput
            label="Tournament End Date"
            type="datetime-local"
            error={errors.endDate?.message}
            {...register('endDate')}
          />

          <Divider label="Visibility Settings" labelPosition="left" />

          {/* Tournament Settings */}
          <Switch
            label="Public Tournament"
            description="Make this tournament visible to all users"
            {...register('isPublic')}
            checked={watch('isPublic')}
            onChange={(event) => setValue('isPublic', event.currentTarget.checked)}
          />

          {/* Form Actions */}
          <Group justify="flex-end" mt="xl">
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
              leftSection={<IconDeviceFloppy size={16} />}
              loading={isLoading}
              disabled={isLoading}
            >
              {isEditing ? 'Update Tournament' : 'Create Tournament'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}