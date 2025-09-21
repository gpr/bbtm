import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { User as FirebaseUser } from 'firebase/auth';
import { Layout } from './components/layout';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { TournamentsPage, TournamentDetailPage, CreateTournamentPage } from './pages/tournaments';
import { AuthPage } from './pages/auth/AuthPage';
import { User } from './types/user';
import { authService } from './services/auth.service';
import { errorService } from './services/error.service';
import { Notifications } from '@mantine/notifications';
import { Container, Title, Text, Button, Stack } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';

// Home page component
function HomePage() {
  const navigate = useNavigate();

  return (
    <Container size="lg" py="xl">
      <Stack align="center" spacing="xl">
        <div style={{ textAlign: 'center' }}>
          <Title order={1} size="3rem" mb="md">
            Blood Bowl Tournament Management
          </Title>
          <Text size="xl" c="dimmed" mb="xl">
            Create, manage, and participate in Blood Bowl tournaments
          </Text>
        </div>

        <Stack align="center" spacing="md">
          <Button
            size="lg"
            onClick={() => navigate('/tournaments')}
          >
            Browse Tournaments
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/auth/register')}
          >
            Create Account
          </Button>
        </Stack>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Text size="lg" fw={500} mb="md">
            Features
          </Text>
          <Stack spacing="sm">
            <Text>🏆 Create and manage tournaments</Text>
            <Text>👥 Register coaches for tournaments</Text>
            <Text>📊 Track registrations and participants</Text>
            <Text>🎯 Support for all Blood Bowl team races</Text>
            <Text>📱 Anonymous registration support</Text>
          </Stack>
        </div>
      </Stack>
    </Container>
  );
}

// Not found page component
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container size="sm" py="xl">
      <Stack align="center" spacing="xl">
        <div style={{ textAlign: 'center' }}>
          <Title order={1} size="6rem" c="dimmed">
            404
          </Title>
          <Title order={2} mb="md">
            Page Not Found
          </Title>
          <Text size="lg" c="dimmed" mb="xl">
            The page you're looking for doesn't exist.
          </Text>
        </div>

        <Button
          leftSection={<IconHome size={16} />}
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
      </Stack>
    </Container>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up notification handler
    const unsubscribeNotifications = errorService.onNotification((notification) => {
      // In a real app, this would integrate with Mantine notifications
      console.log('Notification:', notification);
    });

    // Set up auth state listener
    const unsubscribeAuth = authService.onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);

      if (firebaseUser) {
        try {
          const userProfile = await authService.getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setUser(userProfile);
          } else {
            // Create user profile if it doesn't exist
            const userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName,
              createdAt: new Date() as any,
              updatedAt: new Date() as any,
              isActive: true,
            };
            setUser(userData);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      unsubscribeNotifications();
      unsubscribeAuth();
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ErrorBoundary>
      <Notifications />
      <Layout user={user} onLogout={handleLogout}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
            <Route
              path="/tournaments/create"
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <CreateTournamentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <Dashboard user={user} />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/login" element={<AuthPage />} />
            <Route path="/auth/register" element={<AuthPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </ErrorBoundary>
  );
}