import React from 'react';
import { render, screen } from '@testing-library/react';
import { BandTab } from '../components/Tabs/BandTab';

describe('BandTab Component', () => {
  const mockGameData = {
    bandMembers: [
      {
        id: 1,
        name: 'John Doe',
        type: 'vocals',
        skill: 7,
        morale: 85,
        traits: ['confident', 'passionate']
      },
      {
        id: 2,
        name: 'Jane Smith',
        type: 'guitar',
        skill: 8,
        morale: 90,
        traits: ['technical', 'reliable']
      }
    ]
  };

  test('renders Band Tab heading', () => {
    render(<BandTab gameData={mockGameData} />);
    expect(screen.getByText('Band Members')).toBeInTheDocument();
  });

  test('displays all band members', () => {
    render(<BandTab gameData={mockGameData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('shows member roles and skills', () => {
    render(<BandTab gameData={mockGameData} />);
    expect(screen.getByText(/vocals/i)).toBeInTheDocument();
    expect(screen.getByText(/guitar/i)).toBeInTheDocument();
  });

  test('displays morale information', () => {
    render(<BandTab gameData={mockGameData} />);
    expect(screen.getByText(/85%/)).toBeInTheDocument();
    expect(screen.getByText(/90%/)).toBeInTheDocument();
  });

  test('shows empty state when no members', () => {
    render(<BandTab gameData={{ bandMembers: [] }} />);
    expect(screen.getByText(/No band members yet/i)).toBeInTheDocument();
  });

  test('handles missing bandMembers gracefully', () => {
    render(<BandTab gameData={{}} />);
    expect(screen.getByText(/No band members yet/i)).toBeInTheDocument();
  });
});
