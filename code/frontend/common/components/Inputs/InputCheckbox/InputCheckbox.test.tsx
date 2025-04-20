import { render, screen, fireEvent, act } from '@testing-library/react';
import InputCheckbox from './InputCheckbox';

describe('InputCheckbox Component', () => {
  const mockHandleChange = jest.fn();

  beforeEach(() => {
    mockHandleChange.mockClear();
  });

  it('renders correctly with label and description', () => {
    render(
      <InputCheckbox
        name="testCheckbox"
        checkOptionValue="option1"
        label="Test Label"
        description="Test Description"
        handleChange={mockHandleChange}
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });

  it('handles correctly no initial value', async () => {
    render(
      <InputCheckbox
        name="testCheckbox"
        checkOptionValue="option1"
        handleChange={mockHandleChange}
      />
    );

    const checkbox = screen.getByTestId('checkbox');
    await act(() => fireEvent.click(checkbox));
    expect(mockHandleChange).toHaveBeenCalledWith('testCheckbox', ['option1']);
  });

  it('calls handleChange with the correct value when checked', async () => {
    render(
      <InputCheckbox
        name="testCheckbox"
        checkOptionValue="option1"
        value={[]}
        handleChange={mockHandleChange}
      />
    );

    const checkbox = screen.getByTestId('checkbox');
    await act(() => fireEvent.click(checkbox));

    expect(mockHandleChange).toHaveBeenCalledWith('testCheckbox', ['option1']);
  });

  it('calls handleChange with the correct value when unchecked', async () => {
    render(
      <InputCheckbox
        name="testCheckbox"
        checkOptionValue="option1"
        value={['option1']}
        handleChange={mockHandleChange}
      />
    );

    const checkbox = screen.getByTestId('checkbox');
    await act(() => fireEvent.click(checkbox));

    expect(mockHandleChange).toHaveBeenCalledWith('testCheckbox', []);
  });

  it('renders as disabled when isDisabled is true', async () => {
    render(
      <InputCheckbox
        name="testCheckbox"
        checkOptionValue="option1"
        isDisabled
        handleChange={mockHandleChange}
      />
    );

    const checkbox = screen.getByTestId('checkbox');
    await act(() => fireEvent.click(checkbox));

    expect(mockHandleChange).not.toHaveBeenCalled(); // Should not call handleChange
  });

  it('applies box style when box prop is true', () => {
    render(
      <InputCheckbox
        name="testCheckbox"
        checkOptionValue="option1"
        box
        handleChange={mockHandleChange}
      />
    );

    const label = screen.getByTestId('checkbox').parentElement;
    expect(label).toHaveClass('border border-n2 rounded-rs p-m');
  });

  it('renders the check icon when checked', () => {
    render(
      <InputCheckbox
        name="testCheckbox"
        checkOptionValue="option1"
        value={['option1']}
        handleChange={mockHandleChange}
      />
    );

    expect(screen.getByTestId('checkbox')).toHaveClass('bg-p1'); // Checked style
    expect(screen.getByTestId('checkbox').childElementCount).toBe(1); // No check icon
    expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
  });

  it('does not render the check icon when unchecked', () => {
    render(
      <InputCheckbox
        name="testCheckbox"
        checkOptionValue="option1"
        value={[]}
        handleChange={mockHandleChange}
      />
    );

    expect(screen.getByTestId('checkbox')).not.toHaveClass('bg-p1'); // Checked style
    expect(screen.getByTestId('checkbox').childElementCount).toBe(0); // No check icon
    expect(screen.queryByTestId('fa-icon')).toBeNull();
  });
});
