import type { ReactNode } from 'react';
import { AppShell } from '@mantine/core';
import { Header } from './Header';
import type { User } from '../../types/user';

interface LayoutProps {
  children: ReactNode;
  user: User | null;
  onLogout?: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Header user={user} onLogout={onLogout} />
      </AppShell.Header>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}