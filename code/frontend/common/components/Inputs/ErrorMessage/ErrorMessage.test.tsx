import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  it('renders correctly with an error message', () => {
    render(<ErrorMessage errorMessage="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
    expect(screen.getByText('This is an error')).toHaveClass(
      's text-fe1 mt-xs'
    );
  });

  it('does not render anything when errorMessage is not provided', () => {
    const { container } = render(<ErrorMessage />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className when provided', () => {
    render(
      <ErrorMessage errorMessage="This is an error" className="custom-class" />
    );
    const errorMessage = screen.getByText('This is an error');
    expect(errorMessage).toHaveClass('custom-class');
  });
});
