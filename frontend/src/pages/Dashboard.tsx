// T041: Dashboard page
import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Card,
  SimpleGrid,
  Alert,
  Loader,
  Badge,
} from '@mantine/core';
import { IconPlus, IconCalendar, IconUsers, IconTournament } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Tournament } from '../types/tournament';
import { User } from '../types/user';
import { tournamentService } from '../services/tournament.service';
import { authService } from '../services/auth.service';
import { errorService } from '../services/error.service';
import { TournamentList } from '../components/tournaments/TournamentList';

interface DashboardProps {
  user: User | null;
}

export function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTournaments: 0,
    activeTournaments: 0,
    totalParticipants: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await tournamentService.getUserTournaments();

      const tournaments = response.tournaments;
      const activeTournaments = tournaments.filter(t => t.registrationOpen);
      const totalParticipants = tournaments.reduce((sum, t) => sum + t.participantCount, 0);

      setStats({
        totalTournaments: tournaments.length,
        activeTournaments: activeTournaments.length,
        totalParticipants,
      });
    } catch (err: any) {
      errorService.handleError(err, 'Dashboard.loadDashboardData');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTournamentClick = (tournament: Tournament) => {
    navigate(`/tournaments/${tournament.id}`);
  };

  const handleManageClick = (tournament: Tournament) => {
    navigate(`/tournaments/${tournament.id}/manage`);
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <Container>
        <Stack align="center" py="xl">
          <Loader size="lg" />
          <Text>Loading dashboard...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack spacing="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={1}>Dashboard</Title>
            <Text c="dimmed" mt="xs">
              Welcome back, {user.displayName || user.email}!
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/tournaments/create')}
          >
            Create Tournament
          </Button>
        </Group>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Card withBorder padding="lg">
            <Group gap="sm">
              <IconTournament size={24} color="blue" />
              <div>
                <Text size="lg" fw={700}>
                  {stats.totalTournaments}
                </Text>
                <Text size="sm" c="dimmed">
                  Total Tournaments
                </Text>
              </div>
            </Group>
          </Card>

          <Card withBorder padding="lg">
            <Group gap="sm">
              <IconCalendar size={24} color="green" />
              <div>
                <Text size="lg" fw={700}>
                  {stats.activeTournaments}
                </Text>
                <Text size="sm" c="dimmed">
                  Active Tournaments
                </Text>
              </div>
            </Group>
          </Card>

          <Card withBorder padding="lg">
            <Group gap="sm">
              <IconUsers size={24} color="orange" />
              <div>
                <Text size="lg" fw={700}>
                  {stats.totalParticipants}
                </Text>
                <Text size="sm" c="dimmed">
                  Total Participants
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        {/* My Tournaments */}
        <div>
          <Group justify="space-between" mb="md">
            <Title order={2} size="h3">
              My Tournaments
            </Title>
            <Badge variant="light" size="lg">
              {stats.totalTournaments} tournaments
            </Badge>
          </Group>

          {stats.totalTournaments === 0 ? (
            <Alert color="blue" title="No tournaments yet">
              <Text mb="md">
                You haven't created any tournaments yet. Get started by creating your first tournament!
              </Text>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => navigate('/tournaments/create')}
              >
                Create Your First Tournament
              </Button>
            </Alert>
          ) : (
            <TournamentList
              showUserTournaments={true}
              onTournamentClick={handleTournamentClick}
              onManageClick={handleManageClick}
            />
          )}
        </div>
      </Stack>
    </Container>
  );
}