import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TournamentDetail } from '../../components/tournaments/TournamentDetail';
import { RegistrationForm } from '../../components/registrations/RegistrationForm';
import { Tournament } from '../../types/tournament';
import { CoachRegistration } from '../../types/registration';
import { tournamentService } from '../../services/tournament.service';
import { authService } from '../../services/auth.service';

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registrationModalOpened, { open: openRegistration, close: closeRegistration }] = useDisclosure(false);

  const currentUser = authService.getCurrentUser();

  const handleRegisterClick = async () => {
    if (!id) return;

    try {
      const response = await tournamentService.getTournament(id);
      setTournament({
        ...response.tournament,
        registrationDeadline: response.tournament.registrationDeadline
          ? new Date(response.tournament.registrationDeadline) as any
          : undefined,
        startDate: response.tournament.startDate
          ? new Date(response.tournament.startDate) as any
          : undefined,
        endDate: response.tournament.endDate
          ? new Date(response.tournament.endDate) as any
          : undefined,
        createdAt: new Date(response.tournament.createdAt) as any,
        updatedAt: new Date(response.tournament.updatedAt) as any,
      });
      openRegistration();
    } catch (error) {
      console.error('Error loading tournament:', error);
    }
  };

  const handleRegistrationSuccess = (registration: CoachRegistration) => {
    closeRegistration();
    // Refresh the tournament detail page to show updated participant count
    window.location.reload();
  };

  const handleManageClick = () => {
    navigate(`/tournaments/${id}/manage`);
  };

  const handleEditClick = () => {
    navigate(`/tournaments/${id}/edit`);
  };

  if (!id) {
    return <div>Tournament not found</div>;
  }

  return (
    <>
      <TournamentDetail
        tournamentId={id}
        onRegisterClick={handleRegisterClick}
        onManageClick={handleManageClick}
        onEditClick={handleEditClick}
      />

      {/* Registration Modal */}
      <Modal
        opened={registrationModalOpened}
        onClose={closeRegistration}
        title="Register for Tournament"
        size="lg"
        centered
      >
        {tournament && (
          <RegistrationForm
            tournament={tournament}
            onSuccess={handleRegistrationSuccess}
            onCancel={closeRegistration}
          />
        )}
      </Modal>
    </>
  );
}