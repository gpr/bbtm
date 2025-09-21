// T035 [P] Tournament list component
import { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Title,
  Container,
  Loader,
  Alert,
  SimpleGrid,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconCalendar, IconUsers, IconSettings, IconEye } from '@tabler/icons-react';
import type { Tournament } from '../../types/tournament';
import { tournamentService } from '../../services/tournament.service';
import { errorService } from '../../services/error.service';

interface TournamentListProps {
  showPublicOnly?: boolean;
  showUserTournaments?: boolean;
  onTournamentClick?: (tournament: Tournament) => void;
  onManageClick?: (tournament: Tournament) => void;
}

export function TournamentList({
  showPublicOnly = false,
  showUserTournaments = false,
  onTournamentClick,
  onManageClick,
}: TournamentListProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();

  useEffect(() => {
    loadTournaments();
  }, [showPublicOnly, showUserTournaments]);

  const loadTournaments = async (cursor?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (showUserTournaments) {
        response = await tournamentService.getUserTournaments();
      } else if (showPublicOnly) {
        response = await tournamentService.getPublicTournaments({ cursor });
      } else {
        response = await tournamentService.listTournaments({ cursor });
      }

      const tournamentData = response.tournaments.map(t => ({
        ...t,
        // Convert ISO strings back to Timestamp objects for consistency
        registrationDeadline: t.registrationDeadline ? new Date(t.registrationDeadline) as any : undefined,
        startDate: t.startDate ? new Date(t.startDate) as any : undefined,
        endDate: t.endDate ? new Date(t.endDate) as any : undefined,
        createdAt: new Date(t.createdAt) as any,
        updatedAt: new Date(t.updatedAt) as any,
      }));

      if (cursor) {
        setTournaments(prev => [...prev, ...tournamentData]);
      } else {
        setTournaments(tournamentData);
      }

      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor);
    } catch (err: any) {
      const appError = errorService.handleError(err, 'TournamentList.loadTournaments');
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && nextCursor && !isLoading) {
      loadTournaments(nextCursor);
    }
  };

  const formatDate = (date: Date | any | undefined) => {
    if (!date) return 'Not set';
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  };

  if (isLoading && tournaments.length === 0) {
    return (
      <Container>
        <Stack align="center" py="xl">
          <Loader size="lg" />
          <Text>Loading tournaments...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert color="red" title="Error loading tournaments">
          {error}
          <Button variant="light" size="sm" mt="sm" onClick={() => loadTournaments()}>
            Try again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (tournaments.length === 0) {
    return (
      <Container>
        <Stack align="center" py="xl">
          <Text size="lg" c="dimmed">
            {showUserTournaments
              ? 'No tournaments created yet'
              : showPublicOnly
              ? 'No public tournaments available'
              : 'No tournaments found'}
          </Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack>
              <Group justify="space-between" align="flex-start">
                <div style={{ flex: 1 }}>
                  <Title order={3} size="h4" lineClamp={2}>
                    {tournament.name}
                  </Title>
                  <Text size="sm" c="dimmed" mt="xs">
                    by {tournament.organizerEmail}
                  </Text>
                </div>
                <Group gap="xs">
                  {tournament.isPublic ? (
                    <Badge color="green" variant="light" size="sm">
                      Public
                    </Badge>
                  ) : (
                    <Badge color="gray" variant="light" size="sm">
                      Private
                    </Badge>
                  )}
                  {tournament.registrationOpen ? (
                    <Badge color="blue" variant="light" size="sm">
                      Open
                    </Badge>
                  ) : (
                    <Badge color="red" variant="light" size="sm">
                      Closed
                    </Badge>
                  )}
                </Group>
              </Group>

              {tournament.description && (
                <Text size="sm" lineClamp={2}>
                  {tournament.description}
                </Text>
              )}

              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <IconUsers size={16} />
                  <Text size="sm">
                    {tournament.participantCount}
                    {tournament.maxParticipants && ` / ${tournament.maxParticipants}`}
                  </Text>
                </Group>

                {tournament.startDate && (
                  <Group gap="xs">
                    <IconCalendar size={16} />
                    <Text size="sm">{formatDate(tournament.startDate)}</Text>
                  </Group>
                )}
              </Group>

              <Group justify="space-between">
                <Button
                  variant="light"
                  leftSection={<IconEye size={16} />}
                  onClick={() => onTournamentClick?.(tournament)}
                >
                  View Details
                </Button>

                {showUserTournaments && (
                  <Tooltip label="Manage Tournament">
                    <ActionIcon
                      variant="light"
                      size="lg"
                      onClick={() => onManageClick?.(tournament)}
                    >
                      <IconSettings size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      {hasMore && (
        <Group justify="center" mt="xl">
          <Button
            variant="outline"
            loading={isLoading}
            onClick={loadMore}
          >
            Load More
          </Button>
        </Group>
      )}
    </Container>
  );
}