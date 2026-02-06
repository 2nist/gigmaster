import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardTab } from '../components/Tabs/DashboardTab';

describe('DashboardTab Component', () => {
  const mockGameData = {
    songs: [{ id: 1, name: 'Test Song' }],
    albums: [{ id: 1, name: 'Test Album' }],
    gigHistory: [{ id: 1, venue: 'Test Venue' }],
    totalEarnings: 5000
  };

  const mockDialogueState = {
    psychologicalState: {
      stress_level: 30,
      moral_integrity: 80,
      addiction_risk: 10
    }
  };

  test('renders Dashboard Tab', () => {
    render(
      <DashboardTab gameData={mockGameData} dialogueState={mockDialogueState} />
    );
    expect(screen.getByText('Psychological State')).toBeInTheDocument();
  });

  test('displays psychological state metrics', () => {
    render(
      <DashboardTab gameData={mockGameData} dialogueState={mockDialogueState} />
    );
    expect(screen.getByText(/Stress Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Moral Integrity/i)).toBeInTheDocument();
    expect(screen.getByText(/Addiction Risk/i)).toBeInTheDocument();
  });

  test('displays quick stats', () => {
    render(
      <DashboardTab gameData={mockGameData} dialogueState={mockDialogueState} />
    );
    expect(screen.getByText(/Quick Stats/i)).toBeInTheDocument();
    expect(screen.getByText(/Songs:/)).toBeInTheDocument();
  });

  test('handles missing data gracefully', () => {
    const emptyGameData = {
      songs: [],
      albums: [],
      gigHistory: [],
      totalEarnings: 0
    };

    render(
      <DashboardTab gameData={emptyGameData} dialogueState={mockDialogueState} />
    );
    expect(screen.getByText(/Songs:/)).toBeInTheDocument();
  });
});
