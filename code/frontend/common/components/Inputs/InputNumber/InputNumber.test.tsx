import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputNumber from './InputNumber';

describe('InputNumber Component', () => {
  const mockHandleChange = jest.fn();

  beforeEach(() => {
    mockHandleChange.mockClear();
  });

  it('renders correctly and displays the provided value as a string', () => {
    render(
      <InputNumber
        name="quantity"
        label="Quantity"
        value={123}
        handleChange={mockHandleChange}
      />
    );
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('123');
    // The type is always "number" from the component
    expect(input).toHaveAttribute('type', 'number');
  });

  it('triggers blur on mouse wheel (onWheelCapture)', () => {
    render(
      <InputNumber
        name="quantity"
        label="Quantity"
        value={0}
        handleChange={mockHandleChange}
      />
    );
    const input = screen.getByTestId('input') as HTMLInputElement;
    // Spy on the blur method
    const blurSpy = jest.spyOn(input, 'blur');
    fireEvent.wheel(input);
    expect(blurSpy).toHaveBeenCalled();
  });

  describe('KeyDown behavior for type "number"', () => {
    it('allows allowed keys and prevents disallowed ones', async () => {
      render(
        <InputNumber
          name="quantity"
          label="Quantity"
          value={''}
          handleChange={mockHandleChange}
        />
      );
      const input = screen.getByTestId('input') as HTMLInputElement;

      // Allowed digit key
      fireEvent.change(input, { target: { value: '5' } });
      expect(mockHandleChange).toHaveBeenCalledWith('quantity', 5);
      expect(mockHandleChange).toHaveBeenCalledTimes(1);

      // Disallowed key for number input
      fireEvent.change(input, { target: { value: '5.' } });
      expect(mockHandleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('KeyDown behavior for type "float"', () => {
    it('allows digits and a single dot (or comma) when not already present', () => {
      render(
        <InputNumber
          name="amount"
          label="Amount"
          value={''}
          type="float"
          handleChange={mockHandleChange}
        />
      );
      const input = screen.getByTestId('input') as HTMLInputElement;

      // Allowed digit key
      fireEvent.change(input, { target: { value: '5' } });
      expect(mockHandleChange).toHaveBeenCalledWith('amount', 5);
      expect(mockHandleChange).toHaveBeenCalledTimes(1);

      // Allowed dot key when no dot/comma in the value
      fireEvent.change(input, { target: { value: '5.' } });
      expect(mockHandleChange).toHaveBeenCalledTimes(1);

      // Disallowed second dot
      fireEvent.change(input, { target: { value: '5.0.' } });
      expect(mockHandleChange).toHaveBeenCalledTimes(1);

      // Test comma similarly: if value already has a comma/dot, comma should be prevented
      // Disallowed second dot
      fireEvent.change(input, { target: { value: '5,0,' } });
      expect(mockHandleChange).toHaveBeenCalledTimes(1);
    });

    it('prevents disallowed keys for float input', () => {
      render(
        <InputNumber
          name="amount"
          label="Amount"
          value={''}
          type="float"
          handleChange={mockHandleChange}
        />
      );
      const input = screen.getByTestId('input') as HTMLInputElement;

      // Change input to an invalid number (non-numeric), mantains previous value
      fireEvent.change(input, { target: { value: 'a' } });
      expect(mockHandleChange).toHaveBeenCalledTimes(0); // No new call to handleChange
    });
  });

  it('converts changed value to a number or empty string and calls handleChange', () => {
    render(
      <InputNumber
        name="quantity"
        label="Quantity"
        value={''}
        handleChange={mockHandleChange}
      />
    );
    const input = screen.getByTestId('input') as HTMLInputElement;

    // Change input to a valid numeric string
    fireEvent.change(input, { target: { value: '42' } });
    // The InputNumber converts value using Number(value) || ''
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith('quantity', 42);

    // Change input to an invalid number (non-numeric), mantains previous value
    fireEvent.change(input, { target: { value: '42invalid' } });
    expect(mockHandleChange).toHaveBeenCalledTimes(1); // No new call to handleChange
  });
});
