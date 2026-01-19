import React from 'react';
import { render, screen } from '@testing-library/react';
import { GigsTab } from '../components/Tabs/GigsTab';

describe('GigsTab Component', () => {
  const mockGameData = {
    gigHistory: [
      { id: 1, venue: 'Local Bar', week: 5, earnings: 500, success: true },
      { id: 2, venue: 'City Arena', week: 10, earnings: 2000, success: true },
      { id: 3, venue: 'Festival', week: 15, earnings: 1500, success: false }
    ],
    gigEarnings: 4000
  };

  test('renders gigs tab heading', () => {
    render(<GigsTab gameData={mockGameData} />);
    expect(screen.getByText('Performance History')).toBeInTheDocument();
  });

  test('displays total gigs count', () => {
    render(<GigsTab gameData={mockGameData} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('displays total earnings', () => {
    render(<GigsTab gameData={mockGameData} />);
    expect(screen.getByText('$4,000')).toBeInTheDocument();
  });

  test('displays average earnings per gig', () => {
    render(<GigsTab gameData={mockGameData} />);
    // Average of 4000/3 = 1333
    expect(screen.getByText('$1,333')).toBeInTheDocument();
  });

  test('shows recent performances', () => {
    render(<GigsTab gameData={mockGameData} />);
    expect(screen.getByText('Recent Performances')).toBeInTheDocument();
    expect(screen.getByText('Festival')).toBeInTheDocument();
  });

  test('shows gig success status', () => {
    render(<GigsTab gameData={mockGameData} />);
    const successElements = screen.getAllByText('Success: Yes');
    expect(successElements.length).toBe(2);
  });

  test('handles empty gig history', () => {
    render(<GigsTab gameData={{ gigHistory: [], gigEarnings: 0 }} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/No gigs yet/i)).toBeInTheDocument();
  });

  test('handles missing data gracefully', () => {
    render(<GigsTab gameData={{}} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
