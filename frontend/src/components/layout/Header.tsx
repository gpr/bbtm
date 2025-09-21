// T040 [P] Navigation and layout components
import { useState } from 'react';
import {
  Header as MantineHeader,
  Group,
  Button,
  UnstyledButton,
  Text,
  Menu,
  Avatar,
  Burger,
  Drawer,
  Stack,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconTournament,
  IconUserCircle,
  IconLogout,
  IconSettings,
  IconPlus,
  IconList,
  IconHome,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/user';
import { authService } from '../../services/auth.service';

interface HeaderProps {
  user: User | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout?.();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { label: 'Home', path: '/', icon: IconHome },
    { label: 'Tournaments', path: '/tournaments', icon: IconList },
  ];

  const userActions = user
    ? [
        { label: 'Create Tournament', path: '/tournaments/create', icon: IconPlus },
        { label: 'My Tournaments', path: '/dashboard', icon: IconTournament },
      ]
    : [];

  const handleNavigate = (path: string) => {
    navigate(path);
    closeDrawer();
  };

  return (
    <>
      <MantineHeader height={60} px="md">
        <Group justify="space-between" h="100%">
          {/* Logo */}
          <UnstyledButton onClick={() => handleNavigate('/')}>
            <Group gap="sm">
              <IconTournament size={28} color="blue" />
              <Text size="xl" fw={700} c="blue">
                Blood Bowl Tournaments
              </Text>
            </Group>
          </UnstyledButton>

          {/* Desktop Navigation */}
          <Group gap="md" visibleFrom="sm">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="subtle"
                leftSection={<item.icon size={16} />}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}

            {user && userActions.map((item) => (
              <Button
                key={item.path}
                variant="subtle"
                leftSection={<item.icon size={16} />}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}

            {/* User Menu or Auth Buttons */}
            {user ? (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap="sm">
                      <Avatar size="sm" color="blue">
                        {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </Avatar>
                      <Text size="sm" fw={500}>
                        {user.displayName || user.email}
                      </Text>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item leftSection={<IconUserCircle size={14} />}>
                    Profile
                  </Menu.Item>
                  <Menu.Item leftSection={<IconSettings size={14} />}>
                    Settings
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={14} />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group gap="sm">
                <Button variant="outline" onClick={() => navigate('/auth/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/auth/register')}>
                  Register
                </Button>
              </Group>
            )}
          </Group>

          {/* Mobile Menu Button */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
            size="sm"
          />
        </Group>
      </MantineHeader>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title="Navigation"
        hiddenFrom="sm"
        size="xs"
      >
        <Stack gap="md">
          {/* Navigation Items */}
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="subtle"
              fullWidth
              leftSection={<item.icon size={16} />}
              onClick={() => handleNavigate(item.path)}
              justify="flex-start"
            >
              {item.label}
            </Button>
          ))}

          {user && (
            <>
              <Divider />
              {userActions.map((item) => (
                <Button
                  key={item.path}
                  variant="subtle"
                  fullWidth
                  leftSection={<item.icon size={16} />}
                  onClick={() => handleNavigate(item.path)}
                  justify="flex-start"
                >
                  {item.label}
                </Button>
              ))}
            </>
          )}

          <Divider />

          {/* User Section */}
          {user ? (
            <Stack gap="sm">
              <Group gap="sm">
                <Avatar size="sm" color="blue">
                  {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Text size="sm" fw={500}>
                    {user.displayName || 'User'}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user.email}
                  </Text>
                </div>
              </Group>

              <Button
                variant="subtle"
                leftSection={<IconUserCircle size={16} />}
                fullWidth
                justify="flex-start"
              >
                Profile
              </Button>

              <Button
                variant="subtle"
                leftSection={<IconSettings size={16} />}
                fullWidth
                justify="flex-start"
              >
                Settings
              </Button>

              <Button
                variant="subtle"
                color="red"
                leftSection={<IconLogout size={16} />}
                fullWidth
                justify="flex-start"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack gap="sm">
              <Button
                variant="outline"
                fullWidth
                onClick={() => handleNavigate('/auth/login')}
              >
                Login
              </Button>
              <Button
                fullWidth
                onClick={() => handleNavigate('/auth/register')}
              >
                Register
              </Button>
            </Stack>
          )}
        </Stack>
      </Drawer>
    </>
  );
}