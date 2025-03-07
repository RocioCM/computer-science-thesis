import { render } from '@testing-library/react';
import FaIcon from './FaIcon';

describe('FaIcon Component', () => {
  it('renders correctly', () => {
    const component = render(<FaIcon type="fa-solid fa-check" />);
    expect(component.getByTestId('fa-icon')).toHaveClass('fa-solid fa-check');
  });

  it('applies custom className', () => {
    const component = render(
      <FaIcon type="fa-solid fa-check" className="custom-class" />
    );
    expect(component.getByTestId('fa-icon')).toHaveClass('custom-class');
  });

  it('applies custom color', () => {
    const component = render(
      <FaIcon value={{ type: 'fa-solid fa-check', color: 'red' }} />
    );
    expect(component.getByTestId('fa-icon')).toHaveStyle({ color: 'red' });
  });
});
