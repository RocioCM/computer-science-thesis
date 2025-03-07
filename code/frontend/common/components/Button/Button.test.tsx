import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { act } from '@testing-library/react';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('triggers onClick when clicked', () => {
    const onClickMock = jest.fn();
    render(<Button label="Click Me" onClick={onClickMock} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('displays loading indicator when isLoading is true', () => {
    render(<Button label="Click Me" isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button label="Click Me" disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with iconStart and iconEnd', () => {
    render(
      <Button
        label="Click Me"
        iconStart="/icon-start.png"
        iconEnd="/icon-end.png"
      />
    );
    expect(screen.getAllByAltText('Icon')).toHaveLength(2);
  });

  it('handles async click correctly', async () => {
    const handleClickMock = jest.fn(() => Promise.resolve());
    render(<Button label="Click Me" handleClick={handleClickMock} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(handleClickMock).toHaveBeenCalled();
  });

  it("defaults to handleClick if handleClick prop isn't provided", async () => {
    const handleClickMock = jest.fn();
    render(<Button label="Click Me" onClick={handleClickMock} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(handleClickMock).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button label="Click Me" className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('applies variant styles', () => {
    render(<Button label="Click Me" variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-transparent text-p1 border border-p1'
    );
  });

  it('applies size styles', () => {
    render(<Button label="Click Me" size="small" />);
    expect(screen.getByRole('button')).toHaveClass('py-xs px-m');
  });

  it('applies width styles', () => {
    render(<Button label="Click Me" width="full" />);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('applies custom width styles', () => {
    render(<Button label="Click Me" width="w-[95%]" />);
    expect(screen.getByRole('button')).toHaveClass('w-[95%]');
  });
});
