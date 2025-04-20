import { render, screen, fireEvent, act } from '@testing-library/react';
import InputDropdown, { Option } from './InputDropdown';

describe('InputDropdown Component', () => {
  const mockHandleChange = jest.fn();
  const options: Option[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  beforeEach(() => {
    mockHandleChange.mockClear();
  });

  it('renders correctly with label and placeholder', () => {
    render(
      <InputDropdown
        name="testDropdown"
        label="Test Label"
        placeholder="Select an option"
        options={options}
        handleChange={mockHandleChange}
        value={null}
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('opens the dropdown when clicked', async () => {
    render(
      <InputDropdown
        name="testDropdown"
        options={options}
        handleChange={mockHandleChange}
        value={null}
      />
    );

    const button = screen.getByRole('button');
    await act(() => fireEvent.click(button));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls handleChange with the correct value when an option is selected', async () => {
    render(
      <InputDropdown
        name="testDropdown"
        options={options}
        handleChange={mockHandleChange}
        value={null}
        showFloatingLabel
      />
    );

    const button = screen.getByRole('button');
    await act(() => fireEvent.click(button));

    const option = screen.getByText('Option 1');
    await act(() => fireEvent.click(option));

    expect(mockHandleChange).toHaveBeenCalledWith('testDropdown', 'option1');
  });

  it('calls handleChange with the correct value when an option is already selected', async () => {
    render(
      <InputDropdown
        name="testDropdown"
        options={options}
        handleChange={mockHandleChange}
        value={'option3'}
        showFloatingLabel
      />
    );

    const button = screen.getByRole('button');
    await act(() => fireEvent.click(button));

    const option = screen.getByText('Option 1');
    await act(() => fireEvent.click(option));

    expect(mockHandleChange).toHaveBeenCalledWith('testDropdown', 'option1');
  });

  it('renders options when clicking on label', async () => {
    render(
      <InputDropdown
        name="testDropdown"
        label="Test Label"
        showFloatingLabel
        options={options}
        handleChange={mockHandleChange}
        value={null}
      />
    );

    const label = screen.getByText('Test Label');
    await act(() => fireEvent.click(label));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls handleChange with the correct value when an option is selected and multiple is true', async () => {
    render(
      <InputDropdown
        name="testDropdown"
        options={options}
        handleChange={mockHandleChange}
        value={null as any}
        multiple
        showFloatingLabel
      />
    );

    const button = screen.getByRole('button');
    await act(() => fireEvent.click(button));

    const option = screen.getByText('Option 1');
    await act(() => fireEvent.click(option));

    expect(mockHandleChange).toHaveBeenCalledWith('testDropdown', ['option1']);
  });

  it('renders correct placeholder when multiple is true and 1 item is selected', () => {
    render(
      <InputDropdown
        name="testDropdown"
        options={options}
        value={['option1']}
        multiple
        handleChange={mockHandleChange}
      />
    );

    expect(screen.getByText('1 seleccionado')).toBeInTheDocument();
  });

  it('renders the selected value when an option is selected', () => {
    render(
      <InputDropdown
        name="testDropdown"
        options={options}
        value="option2"
        handleChange={mockHandleChange}
      />
    );

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('renders multiple selected values when multiple is true', () => {
    render(
      <InputDropdown
        name="testDropdown"
        options={options}
        value={['option1', 'option3']}
        multiple
        handleChange={mockHandleChange}
      />
    );

    expect(screen.getByText('2 seleccionados')).toBeInTheDocument();
  });

  it('selects option when multiple is true', async () => {
    render(
      <InputDropdown
        name="testDropdown"
        options={options}
        handleChange={mockHandleChange}
        value={['option3']}
        multiple
      />
    );

    const button = screen.getByRole('button');
    await act(() => fireEvent.click(button));

    const option = screen.getByText('Option 1');
    await act(() => fireEvent.click(option));

    expect(mockHandleChange).toHaveBeenCalledWith('testDropdown', [
      'option3',
      'option1',
    ]);
  });

  it('unselects option when an option is already selected when multiple is true', async () => {
    render(
      <InputDropdown
        name="testDropdown"
        options={options}
        handleChange={mockHandleChange}
        value={['option1', 'option3']}
        multiple
      />
    );

    const button = screen.getByRole('button');
    await act(() => fireEvent.click(button));

    const option = screen.getByText('Option 1');
    await act(() => fireEvent.click(option));

    expect(mockHandleChange).toHaveBeenCalledWith('testDropdown', ['option3']);
  });

  it('disables the dropdown when isDisabled is true', () => {
    render(
      <InputDropdown
        name="testDropdown"
        label="Test Label"
        options={options}
        isDisabled
        handleChange={mockHandleChange}
        value={null}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders error message when errorMessage is provided', async () => {
    render(
      <InputDropdown
        name="testDropdown"
        options={options}
        errorMessage="This is an error"
        handleChange={mockHandleChange}
        value={null}
      />
    );

    // Error should not be visible at first
    expect(screen.queryByText('This is an error')).toBeNull();

    // Simulate a click to show the error message
    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button); // Simulate opening the dropdown
    });
    await act(async () => {
      fireEvent.click(button); // Simulate closing the dropdown
    });
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });
});
