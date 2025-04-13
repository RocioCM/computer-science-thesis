import TestAppWrapper from '@/common/utils/tests';
import TrackingPage from '@/pages/tracking';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TrackingServices from '@/modules/Tracking/services';
import { toast } from 'react-toastify';

jest.mock('@/modules/Tracking/services');
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));

describe('Tracking Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the form and timeline correctly', () => {
    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    expect(screen.getByText('Seguimiento')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByLabelText('ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  it('disables the ID input when no type is selected', () => {
    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const idInput = screen.getByLabelText('ID');
    expect(idInput).toBeDisabled();
  });

  it('enables the ID input when a type is selected', () => {
    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByLabelText('Tipo');
    fireEvent.change(typeDropdown, { target: { value: 'baseBatch' } });

    const idInput = screen.getByLabelText('ID');
    expect(idInput).not.toBeDisabled();
  });

  it('calls the correct service when searching for a base batch', async () => {
    (TrackingServices.getBaseBottlesBatchById as jest.Mock).mockResolvedValue({
      ok: true,
      data: { id: 1, quantity: 100, soldQuantity: 50, createdAt: '2023-01-01' },
    });

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByLabelText('Tipo');
    fireEvent.change(typeDropdown, { target: { value: 'baseBatch' } });

    const idInput = screen.getByLabelText('ID');
    fireEvent.change(idInput, { target: { value: '1' } });

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(TrackingServices.getBaseBottlesBatchById).toHaveBeenCalledWith(1);
    expect(screen.getByText('Cantidad de envases:')).toBeInTheDocument();
  });

  it('shows an error toast when the base batch is not found', async () => {
    (TrackingServices.getBaseBottlesBatchById as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByLabelText('Tipo');
    fireEvent.change(typeDropdown, { target: { value: 'baseBatch' } });

    const idInput = screen.getByLabelText('ID');
    fireEvent.change(idInput, { target: { value: '1' } });

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(toast.error).toHaveBeenCalledWith(
      'No encontramos el lote base que buscas, revisa el ID'
    );
  });

  it('renders the correct tab content when a tab is clicked', async () => {
    (TrackingServices.getBaseBottlesBatchById as jest.Mock).mockResolvedValue({
      ok: true,
      data: { id: 1, quantity: 100, soldQuantity: 50, createdAt: '2023-01-01' },
    });

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByLabelText('Tipo');
    fireEvent.change(typeDropdown, { target: { value: 'baseBatch' } });

    const idInput = screen.getByLabelText('ID');
    fireEvent.change(idInput, { target: { value: '1' } });

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    const baseBatchTab = screen.getByText('Envase');
    fireEvent.click(baseBatchTab);

    expect(screen.getByText('Cantidad de envases:')).toBeInTheDocument();
  });

  it('resets the form and data when a new search is initiated', async () => {
    (TrackingServices.getBaseBottlesBatchById as jest.Mock).mockResolvedValue({
      ok: true,
      data: { id: 1, quantity: 100, soldQuantity: 50, createdAt: '2023-01-01' },
    });

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByLabelText('Tipo');
    fireEvent.change(typeDropdown, { target: { value: 'baseBatch' } });

    const idInput = screen.getByLabelText('ID');
    fireEvent.change(idInput, { target: { value: '1' } });

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    fireEvent.change(typeDropdown, { target: { value: 'productBatch' } });
    expect(screen.queryByText('Cantidad de envases:')).not.toBeInTheDocument();
  });
});
