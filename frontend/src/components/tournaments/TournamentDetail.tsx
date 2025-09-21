// T036 [P] Tournament detail component
import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Button,
  Card,
  Divider,
  Alert,
  Loader,
  Tabs,
  Progress,
} from '@mantine/core';
import {
  IconCalendar,
  IconUsers,
  IconMail,
  IconClock,
  IconSettings,
  IconUserPlus,
  IconInfoCircle,
} from '@tabler/icons-react';
import type { Tournament } from '../../types/tournament';
import type { CoachRegistration } from '../../types/registration';
import type { Timestamp } from 'firebase/firestore';
import { tournamentService } from '../../services/tournament.service';
import { registrationService } from '../../services/registration.service';
import { authService } from '../../services/auth.service';
import { errorService } from '../../services/error.service';

interface TournamentDetailProps {
  tournamentId: string;
  onRegisterClick?: () => void;
  onManageClick?: () => void;
  onEditClick?: () => void;
}

export function TournamentDetail({
  tournamentId,
  onRegisterClick,
  onManageClick,
  onEditClick,
}: TournamentDetailProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registrations, setRegistrations] = useState<CoachRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('details');

  const currentUser = authService.getCurrentUser();
  const isOrganizer = tournament && currentUser && tournament.organizer === currentUser.uid;

  const loadTournament = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await tournamentService.getTournament(tournamentId);
      setTournament({
        ...response.tournament,
        // Convert ISO strings back to Date objects
        registrationDeadline: response.tournament.registrationDeadline
          ? new Date(response.tournament.registrationDeadline)
          : undefined,
        startDate: response.tournament.startDate
          ? new Date(response.tournament.startDate)
          : undefined,
        endDate: response.tournament.endDate
          ? new Date(response.tournament.endDate)
          : undefined,
        createdAt: new Date(response.tournament.createdAt),
        updatedAt: new Date(response.tournament.updatedAt),
      } as unknown as Tournament);
    } catch (err: unknown) {
      const appError = errorService.handleError(err, 'TournamentDetail.loadTournament');
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId]);

  const loadRegistrations = useCallback(async () => {
    if (!isOrganizer) return;

    try {
      const response = await registrationService.listRegistrations(tournamentId);
      setRegistrations(response.registrations.map(r => ({
        ...r,
        registeredAt: new Date(r.registeredAt),
      })) as unknown as CoachRegistration[]);
    } catch (err: unknown) {
      console.error('Error loading registrations:', err);
      // Don't show error to user for registrations, as it's not critical
    }
  }, [tournamentId, isOrganizer]);

  useEffect(() => {
    loadTournament();
    if (isOrganizer) {
      loadRegistrations();
    }
  }, [loadTournament, loadRegistrations, isOrganizer]);

  const formatDate = (date: Date | Timestamp | string | undefined) => {
    if (!date) return 'Not set';

    let dateObj: Date;
    if (date && typeof date === 'object' && 'toDate' in date) {
      // Firestore Timestamp
      dateObj = (date as Timestamp).toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      dateObj = new Date(date);
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };


  const getParticipationRate = () => {
    if (!tournament?.maxParticipants) return 0;
    return (tournament.participantCount / tournament.maxParticipants) * 100;
  };

  const canRegister = () => {
    if (!tournament) return false;
    if (!tournament.registrationOpen) return false;
    if (tournament.registrationDeadline) {
      let deadline: Date;
      if (tournament.registrationDeadline && typeof tournament.registrationDeadline === 'object' && 'toDate' in tournament.registrationDeadline) {
        deadline = (tournament.registrationDeadline as Timestamp).toDate();
      } else {
        deadline = new Date(tournament.registrationDeadline as string);
      }
      if (new Date() > deadline) return false;
    }
    if (tournament.maxParticipants && tournament.participantCount >= tournament.maxParticipants) return false;
    return true;
  };

  if (isLoading) {
    return (
      <Container>
        <Stack align="center" py="xl">
          <Loader size="lg" />
          <Text>Loading tournament details...</Text>
        </Stack>
      </Container>
    );
  }

  if (error || !tournament) {
    return (
      <Container>
        <Alert color="red" title="Error loading tournament">
          {error || 'Tournament not found'}
          <Button variant="light" size="sm" mt="sm" onClick={loadTournament}>
            Try again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={1} size="h2">
              {tournament.name}
            </Title>
            <Group mt="xs" gap="xs">
              <IconMail size={16} />
              <Text size="sm" c="dimmed">
                Organized by {tournament.organizerEmail}
              </Text>
            </Group>
          </div>

          <Group gap="xs">
            {tournament.isPublic ? (
              <Badge color="green" size="lg">
                Public Tournament
              </Badge>
            ) : (
              <Badge color="gray" size="lg">
                Private Tournament
              </Badge>
            )}
            {tournament.registrationOpen ? (
              <Badge color="blue" size="lg">
                Registration Open
              </Badge>
            ) : (
              <Badge color="red" size="lg">
                Registration Closed
              </Badge>
            )}
          </Group>
        </Group>

        {/* Action Buttons */}
        <Group>
          {!isOrganizer && canRegister() && (
            <Button
              leftSection={<IconUserPlus size={16} />}
              onClick={onRegisterClick}
            >
              Register for Tournament
            </Button>
          )}

          {isOrganizer && (
            <>
              <Button
                variant="light"
                leftSection={<IconSettings size={16} />}
                onClick={onManageClick}
              >
                Manage Registrations
              </Button>
              <Button
                variant="outline"
                onClick={onEditClick}
              >
                Edit Tournament
              </Button>
            </>
          )}
        </Group>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'details')}>
          <Tabs.List>
            <Tabs.Tab value="details" leftSection={<IconInfoCircle size={16} />}>
              Details
            </Tabs.Tab>
            <Tabs.Tab value="participants" leftSection={<IconUsers size={16} />}>
              Participants ({tournament.participantCount})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="md">
            <Stack gap="md">
              {/* Description */}
              {tournament.description && (
                <Card withBorder>
                  <Text>{tournament.description}</Text>
                </Card>
              )}

              {/* Tournament Info */}
              <Card withBorder>
                <Stack gap="sm">
                  <Title order={3} size="h4">
                    Tournament Information
                  </Title>

                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconUsers size={16} />
                      <Text size="sm">Participants:</Text>
                    </Group>
                    <Text size="sm" fw={500}>
                      {tournament.participantCount}
                      {tournament.maxParticipants && ` / ${tournament.maxParticipants}`}
                    </Text>
                  </Group>

                  {tournament.maxParticipants && (
                    <div>
                      <Text size="sm" mb="xs">
                        Registration Progress
                      </Text>
                      <Progress
                        value={getParticipationRate()}
                        color={getParticipationRate() >= 100 ? 'red' : 'blue'}
                      />
                    </div>
                  )}

                  <Divider />

                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconClock size={16} />
                      <Text size="sm">Registration Deadline:</Text>
                    </Group>
                    <Text size="sm" fw={500}>
                      {formatDate(tournament.registrationDeadline)}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text size="sm">Start Date:</Text>
                    </Group>
                    <Text size="sm" fw={500}>
                      {formatDate(tournament.startDate)}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text size="sm">End Date:</Text>
                    </Group>
                    <Text size="sm" fw={500}>
                      {formatDate(tournament.endDate)}
                    </Text>
                  </Group>
                </Stack>
              </Card>

              {/* Registration Status */}
              {!canRegister() && (
                <Alert color="orange" title="Registration Unavailable">
                  {!tournament.registrationOpen && 'Registration is currently closed for this tournament.'}
                  {tournament.registrationDeadline && (() => {
                    let deadline: Date;
                    if (tournament.registrationDeadline && typeof tournament.registrationDeadline === 'object' && 'toDate' in tournament.registrationDeadline) {
                      deadline = (tournament.registrationDeadline as Timestamp).toDate();
                    } else {
                      deadline = new Date(tournament.registrationDeadline as string);
                    }
                    return new Date() > deadline;
                  })() && 'The registration deadline has passed.'}
                  {tournament.maxParticipants &&
                    tournament.participantCount >= tournament.maxParticipants &&
                    'This tournament is full.'}
                </Alert>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="participants" pt="md">
            {isOrganizer ? (
              <Stack gap="sm">
                {registrations.length === 0 ? (
                  <Text c="dimmed" ta="center" py="xl">
                    No registrations yet
                  </Text>
                ) : (
                  registrations.map((registration) => (
                    <Card key={registration.id} withBorder>
                      <Group justify="space-between">
                        <div>
                          <Text fw={500}>{registration.alias}</Text>
                          <Text size="sm" c="dimmed">
                            {registration.email} • {registration.teamRace}
                          </Text>
                          {registration.teamName && (
                            <Text size="sm">Team: {registration.teamName}</Text>
                          )}
                        </div>
                        <Badge
                          color={
                            registration.status === 'confirmed'
                              ? 'green'
                              : registration.status === 'pending'
                              ? 'yellow'
                              : 'red'
                          }
                        >
                          {registration.status}
                        </Badge>
                      </Group>
                    </Card>
                  ))
                )}
              </Stack>
            ) : (
              <Alert color="blue" title="Participants">
                {tournament.participantCount === 0
                  ? 'No participants registered yet.'
                  : `${tournament.participantCount} coach${
                      tournament.participantCount !== 1 ? 'es' : ''
                    } registered for this tournament.`}
              </Alert>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}