import React from 'react';
import { render, screen } from '@testing-library/react';
import { SnapshotPanel } from '../components/Panels/SnapshotPanel';

describe('SnapshotPanel Component', () => {
  const mockGameData = {
    bandName: 'The Rockers',
    week: 15,
    money: 50000,
    fame: 250,
    bandMembers: [{ id: 1 }, { id: 2 }]
  };

  test('renders snapshot panel heading', () => {
    render(<SnapshotPanel gameData={mockGameData} />);
    expect(screen.getByText('Band Snapshot')).toBeInTheDocument();
  });

  test('displays band name', () => {
    render(<SnapshotPanel gameData={mockGameData} />);
    expect(screen.getByText('The Rockers')).toBeInTheDocument();
  });

  test('displays week number', () => {
    render(<SnapshotPanel gameData={mockGameData} />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  test('displays money with proper formatting', () => {
    render(<SnapshotPanel gameData={mockGameData} />);
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  test('displays fame metric', () => {
    render(<SnapshotPanel gameData={mockGameData} />);
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  test('counts band members correctly', () => {
    render(<SnapshotPanel gameData={mockGameData} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('handles missing data with defaults', () => {
    render(<SnapshotPanel gameData={{}} />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
  });
});
