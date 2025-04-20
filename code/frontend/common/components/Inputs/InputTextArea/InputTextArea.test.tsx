import { render, screen, fireEvent, act } from '@testing-library/react';
import InputTextArea from './InputTextArea';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(
      <InputTextArea name="test" label="Test Input" handleChange={() => {}} />
    );
    expect(screen.getByText('Test Input')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it("should float label when input has value and showFloatingLabel is set to 'true'", async () => {
    render(
      <InputTextArea
        name="test"
        label="Test Input"
        showFloatingLabel
        handleChange={() => {}}
      />
    );
    const label = screen.getByText('Test Input');
    expect(label).toHaveClass('left-m font-medium cursor-text');
    await act(() => fireEvent.focus(screen.getByRole('textbox')));
    expect(label).toHaveClass('top-0 left-0');
  });

  it('handles onChange events', async () => {
    const handleChange = jest.fn();
    render(<InputTextArea name="test" handleChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await act(() =>
      fireEvent.change(input, { target: { value: 'test value' } })
    );
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided after input', async () => {
    render(
      <InputTextArea
        name="test"
        label="Test Input"
        errorMessage="Error message"
        handleChange={() => {}}
      />
    );
    const input = screen.getByRole('textbox');
    await act(() => {
      fireEvent.input(input, { target: { value: 'test value' } });
    });
    expect(input).toHaveClass('!border-fe1');
  });

  it('applies error styles when error prop is provided after blur', async () => {
    render(
      <InputTextArea
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
      <InputTextArea
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
      <InputTextArea
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
      <InputTextArea
        name="test"
        label="Test Input"
        required
        handleChange={() => {}}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('applies custom className', () => {
    render(
      <InputTextArea
        name="test"
        label="Test Input"
        inputClassName="custom-class"
        handleChange={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });
});
