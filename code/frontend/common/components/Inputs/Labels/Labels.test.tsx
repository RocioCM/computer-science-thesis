import { render, screen } from '@testing-library/react';
import Labels from './Labels';

describe('Labels Component', () => {
  it('renders correctly with label and description', () => {
    render(<Labels label="Test Label" description="Test Description" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders only the label when description is not provided', () => {
    render(<Labels label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).toBeNull();
  });

  it('renders only the description when label is not provided', () => {
    render(<Labels description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.queryByText('Test Label')).toBeNull();
  });

  it('renders null when neither label nor description is provided', () => {
    const { container } = render(<Labels />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom class names to container, label, and description', () => {
    render(
      <Labels
        label="Test Label"
        description="Test Description"
        containerClassName="custom-container"
        labelClassName="custom-label"
        descriptionClassName="custom-description"
      />
    );
    const container = screen.getByText('Test Label').parentElement;
    expect(container).toHaveClass('custom-container');
    expect(screen.getByText('Test Label')).toHaveClass('custom-label');
    expect(screen.getByText('Test Description')).toHaveClass(
      'custom-description'
    );
  });
});
