import { render, screen } from '@testing-library/react';
import ComingSoon from './ComingSoon';

describe('ComingSoon Component', () => {
  it('renders correctly', () => {
    render(<ComingSoon />);
    expect(screen.getByRole('main').childElementCount).toBe(1);
  });

  it('renders with a title', () => {
    render(<ComingSoon title="New Feature" />);
    expect(screen.getByText('New Feature')).toBeInTheDocument();
  });
});
