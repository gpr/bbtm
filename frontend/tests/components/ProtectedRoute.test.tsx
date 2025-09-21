import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../../src/components/routing/ProtectedRoute';
import { User } from '../../src/types/user';

const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

function TestProtectedComponent() {
  return <div>Protected Content</div>;
}

describe('ProtectedRoute', () => {
  it('should render children when user is authenticated', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute user={mockUser} isLoading={false}>
          <TestProtectedComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render nothing when loading', () => {
    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute user={null} isLoading={true}>
          <TestProtectedComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should redirect to login when user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute user={null} isLoading={false}>
          <TestProtectedComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});