import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  it('renders correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Card Content</Card>);
    expect(screen.getByText('Card Content')).toHaveClass('custom-class');
  });

  it('applies shadow styles', () => {
    render(<Card shadow="e1">Card Content</Card>);
    expect(screen.getByText('Card Content')).toHaveClass('shadow-e1');
  });

  it('applies rounded styles', () => {
    render(<Card rounded="m">Card Content</Card>);
    expect(screen.getByText('Card Content')).toHaveClass('rounded-rm');
  });

  it('applies padding styles', () => {
    render(<Card padding="xl">Card Content</Card>);
    expect(screen.getByText('Card Content')).toHaveClass('px-xl py-xl');
  });

  it('applies paddingX and paddingY styles', () => {
    render(
      <Card paddingX="l" paddingY="s">
        Card Content
      </Card>
    );
    expect(screen.getByText('Card Content')).toHaveClass('px-l py-s');
  });

  it('renders children correctly', () => {
    render(
      <Card>
        <div>Child Content</div>
      </Card>
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
