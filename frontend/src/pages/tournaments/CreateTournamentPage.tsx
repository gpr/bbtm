import { useNavigate } from 'react-router-dom';
import { Container, Title, Text, Stack } from '@mantine/core';
import { TournamentForm } from '../../components/tournaments/TournamentForm';
import type { Tournament } from '../../types/tournament';
import { authService } from '../../services/auth.service';
import { useEffect } from 'react';

export function CreateTournamentPage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
    }
  }, [currentUser, navigate]);

  const handleSuccess = (tournament: Tournament) => {
    navigate(`/tournaments/${tournament.id}`);
  };

  const handleCancel = () => {
    navigate('/tournaments');
  };

  if (!currentUser) {
    return null; // Will redirect to login
  }

  return (
    <Container size="md">
      <Stack gap="xl">
        <div>
          <Title order={1}>Create Tournament</Title>
          <Text c="dimmed" mt="xs">
            Set up a new Blood Bowl tournament
          </Text>
        </div>

        <TournamentForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Stack>
    </Container>
  );
}