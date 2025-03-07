import { render, screen } from '@testing-library/react';
import Img from './Img';

describe('Img Component', () => {
  it('renders correctly', () => {
    render(
      <Img src="/test-image.png" alt="Test Image" width={100} height={100} />
    );
    expect(screen.getByAltText('Test Image')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Img
        src="/test-image.png"
        alt="Test Image"
        className="custom-class"
        width={100}
        height={100}
      />
    );
    expect(screen.getByAltText('Test Image')).toHaveClass('custom-class');
  });

  it('applies width and height', () => {
    render(
      <Img src="/test-image.png" alt="Test Image" width={100} height={100} />
    );
    const img = screen.getByAltText('Test Image');
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '100');
  });
});
