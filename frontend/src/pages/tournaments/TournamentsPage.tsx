// T042: Tournament pages (List, Detail, Create, Edit)
import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Tabs,
  Stack,
} from '@mantine/core';
import { IconPlus, IconList, IconWorld } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Tournament } from '../../types/tournament';
import { TournamentList } from '../../components/tournaments/TournamentList';
import { authService } from '../../services/auth.service';

export function TournamentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('public');

  const currentUser = authService.getCurrentUser();

  const handleTournamentClick = (tournament: Tournament) => {
    navigate(`/tournaments/${tournament.id}`);
  };

  const handleManageClick = (tournament: Tournament) => {
    navigate(`/tournaments/${tournament.id}/manage`);
  };

  return (
    <Container size="lg">
      <Stack spacing="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={1}>Tournaments</Title>
            <Text c="dimmed" mt="xs">
              Browse and join Blood Bowl tournaments
            </Text>
          </div>
          {currentUser && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => navigate('/tournaments/create')}
            >
              Create Tournament
            </Button>
          )}
        </Group>

        {/* Tournament Lists */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="public" leftSection={<IconWorld size={16} />}>
              Public Tournaments
            </Tabs.Tab>
            {currentUser && (
              <Tabs.Tab value="my" leftSection={<IconList size={16} />}>
                My Tournaments
              </Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel value="public" pt="md">
            <TournamentList
              showPublicOnly={true}
              onTournamentClick={handleTournamentClick}
            />
          </Tabs.Panel>

          {currentUser && (
            <Tabs.Panel value="my" pt="md">
              <TournamentList
                showUserTournaments={true}
                onTournamentClick={handleTournamentClick}
                onManageClick={handleManageClick}
              />
            </Tabs.Panel>
          )}
        </Tabs>
      </Stack>
    </Container>
  );
}