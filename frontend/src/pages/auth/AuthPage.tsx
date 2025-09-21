// T043: Registration pages and forms
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Stack, Tabs } from '@mantine/core';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';

export function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'login';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const handleAuthSuccess = () => {
    const redirectTo = searchParams.get('redirect') || '/dashboard';
    navigate(redirectTo);
  };

  const handleSwitchToRegister = () => {
    setActiveTab('register');
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };

  return (
    <Container size={420} my={40}>
      <Stack gap="lg">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'login')}>
          <Tabs.List grow>
            <Tabs.Tab value="login">Sign In</Tabs.Tab>
            <Tabs.Tab value="register">Create Account</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login" pt="md">
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={handleSwitchToRegister}
            />
          </Tabs.Panel>

          <Tabs.Panel value="register" pt="md">
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={handleSwitchToLogin}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}