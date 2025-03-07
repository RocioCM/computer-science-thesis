import { render, screen, fireEvent, act } from '@testing-library/react';
import ChevronIcon from './ChevronIcon';

describe('ChevronIcon Component', () => {
  it('renders correctly', () => {
    render(<ChevronIcon type="down" />);
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
  });

  it('applies custom color', () => {
    render(<ChevronIcon type="down" color="red" />);
    const path = screen.getByTestId('chevron-icon').querySelector('path');
    expect(path).toHaveAttribute('fill', 'red');
  });

  it('applies custom size', () => {
    render(<ChevronIcon type="down" size="large" />);
    expect(screen.getByTestId('chevron-icon')).toHaveClass('w-5 h-5');
  });

  it('applies custom className', () => {
    render(<ChevronIcon type="down" className="custom-class" />);
    expect(screen.getByTestId('chevron-icon')).toHaveClass('custom-class');
  });

  it('applies rotation based on type', () => {
    render(<ChevronIcon type="up" />);
    expect(screen.getByTestId('chevron-icon')).toHaveClass('rotate-180');
  });

  it('handles onClick event', async () => {
    const handleClick = jest.fn();
    render(<ChevronIcon type="down" onClick={handleClick} />);
    await act(async () => {
      fireEvent.click(screen.getByTestId('chevron-icon'));
    });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
