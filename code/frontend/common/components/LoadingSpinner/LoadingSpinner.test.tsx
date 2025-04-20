import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders correctly', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('applies custom size', () => {
    render(<LoadingSpinner size="2rem" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveStyle({ width: '2rem', fontSize: '2rem' });
  });

  it('applies custom color', () => {
    render(<LoadingSpinner color="red" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveStyle({ color: 'red' });
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('custom-class');
  });
});
