import { render, screen, fireEvent, act } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input name="test" label="Test Input" handleChange={() => {}} />);
    expect(screen.getByText('Test Input')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it("should float label when input has value and showFloatingLabel is set to 'true'", async () => {
    render(
      <Input
        name="test"
        label="Test Input"
        showFloatingLabel
        handleChange={() => {}}
      />
    );
    const label = screen.getByText('Test Input');
    expect(label).toHaveClass('left-m font-medium cursor-text');
    await act(async () => {
      fireEvent.focus(screen.getByRole('textbox'));
    });
    expect(label).toHaveClass('top-0 left-0');
  });

  it('handles onChange events', () => {
    const handleChange = jest.fn();
    render(
      <Input name="test" label="Test Input" handleChange={handleChange} />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided after input', async () => {
    render(
      <Input
        name="test"
        label="Test Input"
        errorMessage="Error message"
        handleChange={() => {}}
      />
    );
    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.input(input, { target: { value: 'test value' } });
    });
    expect(input).toHaveClass('!border-fe1');
  });

  it('applies error styles when error prop is provided after blur', async () => {
    render(
      <Input
        name="test"
        label="Test Input"
        errorMessage="Error message"
        handleChange={() => {}}
      />
    );
    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.focus(input);
      fireEvent.blur(input);
    });
    expect(input).toHaveClass('!border-fe1');
  });

  it('handles placeholder text', () => {
    render(
      <Input
        name="test"
        label="Test Input"
        placeholder="Enter value"
        handleChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(
      <Input
        name="test"
        label="Test Input"
        isDisabled
        handleChange={() => {}}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:bg-n1');
  });

  it('handles required field validation', () => {
    render(
      <Input name="test" label="Test Input" required handleChange={() => {}} />
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('applies custom className', () => {
    render(
      <Input
        name="test"
        label="Test Input"
        inputClassName="custom-class"
        handleChange={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });
});
