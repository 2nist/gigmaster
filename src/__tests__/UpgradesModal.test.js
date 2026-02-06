import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UpgradesModal } from '../components/Modals/UpgradesModal';

describe('UpgradesModal Component', () => {
  const mockGameData = {
    money: 10000
  };

  test('does not render when not open', () => {
    const { container } = render(
      <UpgradesModal isOpen={false} onClose={() => {}} gameData={mockGameData} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders modal when open', () => {
    render(
      <UpgradesModal isOpen={true} onClose={() => {}} gameData={mockGameData} />
    );
    expect(screen.getByText('Equipment Upgrades')).toBeInTheDocument();
  });

  test('displays available upgrades', () => {
    render(
      <UpgradesModal isOpen={true} onClose={() => {}} gameData={mockGameData} />
    );
    expect(screen.getByText('Studio Upgrade')).toBeInTheDocument();
    expect(screen.getByText('Transport Upgrade')).toBeInTheDocument();
    expect(screen.getByText('Gear Package')).toBeInTheDocument();
    expect(screen.getByText('Sound System')).toBeInTheDocument();
  });

  test('shows upgrade costs', () => {
    render(
      <UpgradesModal isOpen={true} onClose={() => {}} gameData={mockGameData} />
    );
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('$3,000')).toBeInTheDocument();
  });

  test('disables button when insufficient funds', () => {
    const lowFundsData = { money: 1000 };
    render(
      <UpgradesModal isOpen={true} onClose={() => {}} gameData={lowFundsData} />
    );
    const buttons = screen.getAllByText('$5,000');
    expect(buttons[0]).toBeDisabled();
  });

  test('enables button when sufficient funds', () => {
    render(
      <UpgradesModal isOpen={true} onClose={() => {}} gameData={mockGameData} />
    );
    const button = screen.getByText('$2,000');
    expect(button).not.toBeDisabled();
  });

  test('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(
      <UpgradesModal isOpen={true} onClose={onClose} gameData={mockGameData} />
    );
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  test('calls onPurchase when upgrade button clicked', () => {
    const onPurchase = jest.fn();
    render(
      <UpgradesModal 
        isOpen={true} 
        onClose={() => {}} 
        gameData={mockGameData}
        onPurchase={onPurchase}
      />
    );
    const buttons = screen.getAllByText('$5,000');
    fireEvent.click(buttons[0]);
    expect(onPurchase).toHaveBeenCalled();
  });
});
