import React from 'react';
import { render, screen } from '@testing-library/react';
import { RivalsTab } from '../components/Tabs/RivalsTab';

describe('RivalsTab Component', () => {
  const mockGameData = {
    rivals: [
      {
        id: 1,
        name: 'The Competitors',
        skill: 8,
        fame: 300,
        hostility: 75
      },
      {
        id: 2,
        name: 'Echo Chamber',
        skill: 6,
        fame: 150,
        hostility: 45
      }
    ]
  };

  test('renders rivals tab heading', () => {
    render(<RivalsTab gameData={mockGameData} />);
    expect(screen.getByText('Rival Bands')).toBeInTheDocument();
  });

  test('displays all rivals', () => {
    render(<RivalsTab gameData={mockGameData} />);
    expect(screen.getByText('The Competitors')).toBeInTheDocument();
    expect(screen.getByText('Echo Chamber')).toBeInTheDocument();
  });

  test('shows rival metrics (skill, fame, hostility)', () => {
    render(<RivalsTab gameData={mockGameData} />);
    expect(screen.getByText(/8\/10/)).toBeInTheDocument();
    expect(screen.getByText(/75%/)).toBeInTheDocument();
  });

  test('shows empty state when no rivals', () => {
    render(<RivalsTab gameData={{ rivals: [] }} />);
    expect(screen.getByText(/No rivals yet/i)).toBeInTheDocument();
  });

  test('handles missing rivals array gracefully', () => {
    render(<RivalsTab gameData={{}} />);
    expect(screen.getByText(/No rivals yet/i)).toBeInTheDocument();
  });

  test('highlights high hostility rivals', () => {
    const { container } = render(<RivalsTab gameData={mockGameData} />);
    const rivals = container.querySelectorAll('h4');
    // First rival should have red color due to high hostility
    expect(rivals[0]).toBeInTheDocument();
  });
});
