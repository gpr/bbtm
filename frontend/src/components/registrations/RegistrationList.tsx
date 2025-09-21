// T039 [P] Registration list component
import { useState, useEffect } from 'react';
import {
  Table,
  Badge,
  Button,
  Group,
  Text,
  Container,
  Alert,
  Loader,
  Stack,
  Select,
  ActionIcon,
  Tooltip,
  Menu,
  Modal,
  Paper,
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconDownload,
  IconCheck,
  IconX,
  IconClock,
  IconUsers,
} from '@tabler/icons-react';
import { CoachRegistration } from '../../types/registration';
import { RegistrationStatus, REGISTRATION_STATUS_LABELS, getTeamRaceOptions } from '../../types/enums';
import { registrationService } from '../../services/registration.service';
import { errorService } from '../../services/error.service';

interface RegistrationListProps {
  tournamentId: string;
  isOrganizer?: boolean;
  onEditRegistration?: (registration: CoachRegistration) => void;
  onDeleteRegistration?: (registrationId: string) => void;
  onExportData?: () => void;
}

export function RegistrationList({
  tournamentId,
  isOrganizer = false,
  onEditRegistration,
  onDeleteRegistration,
  onExportData,
}: RegistrationListProps) {
  const [registrations, setRegistrations] = useState<CoachRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | ''>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<CoachRegistration | null>(null);

  useEffect(() => {
    loadRegistrations();
  }, [tournamentId, statusFilter]);

  const loadRegistrations = async () => {
    if (!isOrganizer) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await registrationService.listRegistrations(tournamentId, {
        status: statusFilter || undefined,
      });

      setRegistrations(
        response.registrations.map(r => ({
          ...r,
          registeredAt: new Date(r.registeredAt) as any,
        }))
      );
    } catch (err: any) {
      const appError = errorService.handleError(err, 'RegistrationList.loadRegistrations');
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId: string, newStatus: RegistrationStatus) => {
    try {
      await registrationService.updateRegistration(tournamentId, registrationId, {
        status: newStatus,
      });

      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === registrationId ? { ...reg, status: newStatus } : reg
        )
      );

      errorService.showSuccess('Registration status updated successfully!');
    } catch (err: any) {
      errorService.handleError(err, 'RegistrationList.handleStatusUpdate');
    }
  };

  const handleDeleteClick = (registration: CoachRegistration) => {
    setRegistrationToDelete(registration);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!registrationToDelete) return;

    try {
      await registrationService.deleteRegistration(tournamentId, registrationToDelete.id);
      setRegistrations(prev => prev.filter(reg => reg.id !== registrationToDelete.id));
      errorService.showSuccess('Registration deleted successfully!');
      onDeleteRegistration?.(registrationToDelete.id);
    } catch (err: any) {
      errorService.handleError(err, 'RegistrationList.handleDeleteConfirm');
    } finally {
      setDeleteModalOpen(false);
      setRegistrationToDelete(null);
    }
  };

  const getStatusBadgeColor = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.CONFIRMED:
        return 'green';
      case RegistrationStatus.PENDING:
        return 'yellow';
      case RegistrationStatus.CANCELLED:
        return 'red';
      case RegistrationStatus.WAITLIST:
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.CONFIRMED:
        return <IconCheck size={14} />;
      case RegistrationStatus.PENDING:
        return <IconClock size={14} />;
      case RegistrationStatus.CANCELLED:
        return <IconX size={14} />;
      case RegistrationStatus.WAITLIST:
        return <IconUsers size={14} />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.values(RegistrationStatus).map(status => ({
      value: status,
      label: REGISTRATION_STATUS_LABELS[status],
    })),
  ];

  const teamRaceOptions = getTeamRaceOptions();

  if (!isOrganizer) {
    return (
      <Alert color="blue" title="Access Restricted">
        Only tournament organizers can view the registration list.
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <Stack align="center" py="xl">
          <Loader size="lg" />
          <Text>Loading registrations...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Alert color="red" title="Error loading registrations">
        {error}
        <Button variant="light" size="sm" mt="sm" onClick={loadRegistrations}>
          Try again
        </Button>
      </Alert>
    );
  }

  return (
    <Container size="xl">
      <Stack spacing="md">
        {/* Controls */}
        <Group justify="space-between">
          <Select
            placeholder="Filter by status"
            data={statusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as RegistrationStatus | '')}
            w={200}
          />

          <Group>
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={onExportData}
              disabled={registrations.length === 0}
            >
              Export CSV
            </Button>
          </Group>
        </Group>

        {/* Registration Stats */}
        <Paper p="md" withBorder>
          <Group justify="space-around">
            <div>
              <Text size="lg" fw={700} ta="center">
                {registrations.length}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Total
              </Text>
            </div>
            <div>
              <Text size="lg" fw={700} ta="center" c="green">
                {registrations.filter(r => r.status === RegistrationStatus.CONFIRMED).length}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Confirmed
              </Text>
            </div>
            <div>
              <Text size="lg" fw={700} ta="center" c="yellow">
                {registrations.filter(r => r.status === RegistrationStatus.PENDING).length}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Pending
              </Text>
            </div>
            <div>
              <Text size="lg" fw={700} ta="center" c="blue">
                {registrations.filter(r => r.status === RegistrationStatus.WAITLIST).length}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Waitlist
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Registration Table */}
        {registrations.length === 0 ? (
          <Alert color="blue" title="No registrations">
            {statusFilter
              ? `No registrations found with status: ${REGISTRATION_STATUS_LABELS[statusFilter]}`
              : 'No registrations for this tournament yet.'}
          </Alert>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Coach</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Team Race</Table.Th>
                <Table.Th>Team Name</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Registered</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {registrations.map((registration) => (
                <Table.Tr key={registration.id}>
                  <Table.Td>
                    <div>
                      <Text fw={500}>{registration.alias}</Text>
                      {registration.fullName && (
                        <Text size="sm" c="dimmed">
                          {registration.fullName}
                        </Text>
                      )}
                      {registration.nafNumber && (
                        <Text size="xs" c="dimmed">
                          NAF: {registration.nafNumber}
                        </Text>
                      )}
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{registration.email}</Text>
                    {registration.isAnonymous && (
                      <Badge size="xs" color="gray" variant="light">
                        Anonymous
                      </Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={teamRaceOptions.find(t => t.value === registration.teamRace)?.color}
                      variant="light"
                    >
                      {teamRaceOptions.find(t => t.value === registration.teamRace)?.label}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{registration.teamName || '—'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Badge
                        color={getStatusBadgeColor(registration.status)}
                        variant="light"
                        leftSection={getStatusIcon(registration.status)}
                      >
                        {REGISTRATION_STATUS_LABELS[registration.status]}
                      </Badge>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDate(registration.registeredAt)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="light" size="sm">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>Change Status</Menu.Label>
                          <Menu.Item
                            leftSection={<IconCheck size={14} />}
                            onClick={() => handleStatusUpdate(registration.id, RegistrationStatus.CONFIRMED)}
                            disabled={registration.status === RegistrationStatus.CONFIRMED}
                          >
                            Confirm
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconClock size={14} />}
                            onClick={() => handleStatusUpdate(registration.id, RegistrationStatus.PENDING)}
                            disabled={registration.status === RegistrationStatus.PENDING}
                          >
                            Mark Pending
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconUsers size={14} />}
                            onClick={() => handleStatusUpdate(registration.id, RegistrationStatus.WAITLIST)}
                            disabled={registration.status === RegistrationStatus.WAITLIST}
                          >
                            Move to Waitlist
                          </Menu.Item>

                          <Menu.Divider />

                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => onEditRegistration?.(registration)}
                          >
                            Edit Registration
                          </Menu.Item>

                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDeleteClick(registration)}
                          >
                            Delete Registration
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Registration"
        centered
      >
        <Stack>
          <Text>
            Are you sure you want to delete the registration for{' '}
            <strong>{registrationToDelete?.alias}</strong>?
          </Text>
          <Text size="sm" c="dimmed">
            This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteConfirm}>
              Delete Registration
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}