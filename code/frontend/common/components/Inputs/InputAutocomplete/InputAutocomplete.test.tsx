import { render, screen, fireEvent, act } from '@testing-library/react';
import InputAutocomplete, { Option } from './InputAutocomplete';

jest.useFakeTimers();

describe('InputAutocomplete Component', () => {
  const mockHandleSearch = jest.fn();
  const mockHandleChange = jest.fn();

  const options: Option[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  beforeEach(() => {
    mockHandleSearch.mockClear();
    mockHandleChange.mockClear();
  });

  it('renders correctly with placeholder', () => {
    render(
      <InputAutocomplete
        name="testAutocomplete"
        placeholder="Search..."
        label="Test Label"
        handleSearch={mockHandleSearch}
        handleChange={mockHandleChange}
      />
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('calls handleSearch when typing in the input', async () => {
    mockHandleSearch.mockResolvedValue(options);

    render(
      <InputAutocomplete
        name="testAutocomplete"
        handleSearch={mockHandleSearch}
        handleChange={mockHandleChange}
      />
    );

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Option' } });
    });
    await act(() => {
      jest.advanceTimersByTime(1000); // Wait for debounce time
    });

    expect(mockHandleSearch).toHaveBeenCalledWith('Option');
  });

  it('displays options when search results are available', async () => {
    mockHandleSearch.mockResolvedValue(options);

    render(
      <InputAutocomplete
        name="testAutocomplete"
        handleSearch={mockHandleSearch}
        handleChange={mockHandleChange}
      />
    );

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Option' } });
    });

    expect(await screen.findByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls handleChange with the correct value when an option is selected', async () => {
    mockHandleSearch.mockResolvedValue(options);

    render(
      <InputAutocomplete
        name="testAutocomplete"
        handleSearch={mockHandleSearch}
        handleChange={mockHandleChange}
      />
    );

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Option' } });
    });

    const option = await screen.findByText('Option 1');
    await act(() => fireEvent.click(option));

    expect(mockHandleChange).toHaveBeenCalledWith(
      'testAutocomplete',
      'option1'
    );
  });

  it('shows loading spinner while searching', async () => {
    mockHandleSearch.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(options), 1000))
    );

    render(
      <InputAutocomplete
        name="testAutocomplete"
        handleSearch={mockHandleSearch}
        handleChange={mockHandleChange}
      />
    );

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Option' } });
    });
    await act(() => {
      jest.advanceTimersByTime(500); // Wait for half of debounce time
    });

    expect(screen.getByTestId('fa-icon')).toHaveClass('fa-spinner');
  });

  it('renders the selected value when an option is selected', async () => {
    mockHandleSearch.mockResolvedValue(options);

    render(
      <InputAutocomplete
        name="testAutocomplete"
        handleSearch={mockHandleSearch}
        handleChange={mockHandleChange}
        value="option2"
      />
    );

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Option' } });
    });
    await act(() => {
      jest.advanceTimersByTime(1000); // Wait for debounce time
    });

    const option = await screen.findByText('Option 2');
    await act(() => fireEvent.click(option));

    expect(mockHandleChange).toHaveBeenCalledWith(
      'testAutocomplete',
      'option2'
    );
  });
});
