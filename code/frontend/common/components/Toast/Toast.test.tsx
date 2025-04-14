import { render, screen } from '@testing-library/react';
import Toast from './Toast';
import { toast } from 'react-toastify';

jest.unmock('react-toastify');

describe('Toast Component', () => {
  it('displays toast with correct icon', async () => {
    render(<Toast />);
    toast.info('Test info');
    expect(await screen.findByText('Test info')).toBeInTheDocument();
    expect(await screen.findByAltText('info')).toBeInTheDocument();
  });

  it('displays loading message', async () => {
    render(<Toast />);
    toast.loading('Loading message');
    expect(await screen.findByText('Loading message')).toBeInTheDocument();
  });

  it('handles different toast types', async () => {
    render(<Toast />);
    toast.error('Error message');
    toast.warning('Warning message');
    expect(await screen.findByText('Error message')).toBeInTheDocument();
    expect(await screen.findByText('Warning message')).toBeInTheDocument();
  });
});
