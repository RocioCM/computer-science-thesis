import { render, screen, fireEvent, act } from '@testing-library/react';
import InputPassword from './InputPassword';

describe('InputPassword Component', () => {
  it('renders with input type "password" by default', () => {
    render(
      <InputPassword name="password" label="Password" handleChange={() => {}} />
    );
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('password');
  });

  it('toggles visibility when clicking the toggle button', async () => {
    render(
      <InputPassword name="password" label="Password" handleChange={() => {}} />
    );
    const input = screen.getByTestId('input') as HTMLInputElement;
    // Toggle button to show/hide password is rendered
    const toggleButton = screen.getByRole('button');

    // Password hidden by default (type "password")
    expect(input.type).toBe('password');

    // Password visible after clicking the toggle button (type "text")
    await act(() => fireEvent.click(toggleButton));
    expect(input.type).toBe('text');

    // Password hidden again after clicking the toggle button (type "password")
    await act(() => fireEvent.click(toggleButton));
    expect(input.type).toBe('password');
  });

  it("does not toggle visibility when 'disabled' prop is true", async () => {
    render(
      <InputPassword
        name="password"
        label="Password"
        handleChange={() => {}}
        isDisabled={true}
      />
    );
    const input = screen.getByTestId('input') as HTMLInputElement;
    const toggleButton = screen.getByRole('button');

    // Password hidden by default (type "password")
    expect(input.type).toBe('password');

    // Click event should not change the type of the input
    await act(() => fireEvent.click(toggleButton));
    expect(input.type).toBe('password');
  });

  it('displays the correct icon based on visibility state', async () => {
    render(
      <InputPassword name="password" label="Password" handleChange={() => {}} />
    );
    const toggleButton = screen.getByRole('button');

    // By default, the icon should be for showing the password
    expect(toggleButton).toHaveAttribute(
      'alt',
      expect.stringContaining('Show password')
    );

    // On click, the icon should change to the one for hiding the password
    await act(() => fireEvent.click(toggleButton));
    expect(toggleButton).toHaveAttribute(
      'alt',
      expect.stringContaining('Hide password')
    );
  });
});
