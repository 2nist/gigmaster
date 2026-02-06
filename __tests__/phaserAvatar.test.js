import React from 'react';
import { render } from '@testing-library/react';
import PhaserAvatar from '../src/components/PhaserAvatar.jsx';

test('PhaserAvatar mounts', () => {
  const { container } = render(<PhaserAvatar seed="test" />);
  expect(container).toBeDefined();
});
