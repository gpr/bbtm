import { Routes, Route } from 'react-router-dom';
import { Container, Title, Text } from '@mantine/core';

function App() {
  return (
    <Container size="lg" py="xl">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Container>
  );
}

// Placeholder components for initial setup
function HomePage() {
  return (
    <div>
      <Title order={1}>Blood Bowl Tournament Management</Title>
      <Text>Welcome to the Blood Bowl Tournament Management System</Text>
    </div>
  );
}

function TournamentsPage() {
  return (
    <div>
      <Title order={1}>Tournaments</Title>
      <Text>Tournament listing page</Text>
    </div>
  );
}

function TournamentDetailPage() {
  return (
    <div>
      <Title order={1}>Tournament Details</Title>
      <Text>Tournament detail page</Text>
    </div>
  );
}

function LoginPage() {
  return (
    <div>
      <Title order={1}>Login</Title>
      <Text>Login page</Text>
    </div>
  );
}

function RegisterPage() {
  return (
    <div>
      <Title order={1}>Register</Title>
      <Text>Registration page</Text>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div>
      <Title order={1}>404 - Page Not Found</Title>
      <Text>The page you're looking for doesn't exist.</Text>
    </div>
  );
}

export default App;
