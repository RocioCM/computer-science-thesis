import { render, screen, waitFor, act } from '@testing-library/react';
import BatchFormModal from './BatchFormModal';
import RecyclerServices from '../../services';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../services', () => ({
  getAvailableWasteBottles: jest.fn(),
  getRecyclingBatch: jest.fn(),
  createRecyclingBatch: jest.fn(),
  updateRecyclingBatch: jest.fn(),
}));

const mockWasteBottles = [
  { id: 1, trackingCode: 'TRACK001' },
  { id: 2, trackingCode: 'TRACK002' },
  { id: 3, trackingCode: null },
];

const mockBatchData = {
  id: 1,
  name: 'Existing Batch',
  weight: 20,
  size: '10x10',
  materialType: 'Glass',
  createdAt: '2023-01-01T12:00:00Z',
  wasteBottleIds: [1, 2],
  extraInfo: 'Test notes',
  composition: [{ name: 'Material A', amount: '5', measureUnit: 'kg' }],
};

describe('Recycler Inventory - BatchFormModal', () => {
  const mockHandleCancel = jest.fn();
  const mockHandleSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default successful responses
    (RecyclerServices.getAvailableWasteBottles as jest.Mock).mockResolvedValue({
      ok: true,
      data: mockWasteBottles,
    });

    (RecyclerServices.getRecyclingBatch as jest.Mock).mockResolvedValue({
      ok: true,
      data: mockBatchData,
    });

    (RecyclerServices.createRecyclingBatch as jest.Mock).mockResolvedValue({
      ok: true,
    });

    (RecyclerServices.updateRecyclingBatch as jest.Mock).mockResolvedValue({
      ok: true,
    });
  });

  it('Matches snapshot', async () => {
    let container;
    await act(async () => {
      const renderResult = render(
        <div id="modal-root">
          <BatchFormModal
            editingId={1}
            handleCancel={() => {}}
            handleSuccess={() => {}}
          />
        </div>
      );
      container = renderResult.container;
    });

    expect(container).toMatchSnapshot();
  });

  it('renders in creation mode correctly', async () => {
    await act(async () => {
      render(
        <div id="modal-root">
          <BatchFormModal
            editingId={null}
            handleCancel={mockHandleCancel}
            handleSuccess={mockHandleSuccess}
          />
        </div>
      );
    });

    expect(screen.getByText('Crear lote de material')).toBeInTheDocument();
    expect(screen.getByText('Crear')).toBeInTheDocument();

    await waitFor(() => {
      expect(RecyclerServices.getAvailableWasteBottles).toHaveBeenCalledWith(
        1,
        100
      );
    });
  });

  it('renders in edit mode correctly', async () => {
    await act(async () => {
      render(
        <div id="modal-root">
          <BatchFormModal
            editingId={1}
            handleCancel={mockHandleCancel}
            handleSuccess={mockHandleSuccess}
          />
        </div>
      );
    });

    expect(screen.getByText('Editar lote de material #1')).toBeInTheDocument();
    expect(screen.getByText('Actualizar')).toBeInTheDocument();

    await waitFor(() => {
      expect(RecyclerServices.getRecyclingBatch).toHaveBeenCalledWith(1);
      expect(RecyclerServices.getAvailableWasteBottles).toHaveBeenCalledWith(
        1,
        100
      );
    });
  });

  it('handles bottle fetch error correctly', async () => {
    (
      RecyclerServices.getAvailableWasteBottles as jest.Mock
    ).mockResolvedValueOnce({
      ok: false,
    });

    await act(async () => {
      render(
        <div id="modal-root">
          <BatchFormModal
            editingId={null}
            handleCancel={mockHandleCancel}
            handleSuccess={mockHandleSuccess}
          />
        </div>
      );
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Ocurrió un error al cargar las botellas disponibles'
      );
    });
  });

  it('handles batch data fetch error correctly', async () => {
    (RecyclerServices.getRecyclingBatch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await act(async () => {
      render(
        <div id="modal-root">
          <BatchFormModal
            editingId={1}
            handleCancel={mockHandleCancel}
            handleSuccess={mockHandleSuccess}
          />
        </div>
      );
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Ocurrió un error al cargar los datos del lote de material'
      );
    });
  });

  it('shows loading spinner while fetching bottles', async () => {
    // Delay the resolution of the promise to ensure spinner is shown
    (RecyclerServices.getAvailableWasteBottles as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true, data: mockWasteBottles }), 100)
        )
    );

    await act(async () => {
      render(
        <div id="modal-root">
          <BatchFormModal
            editingId={null}
            handleCancel={mockHandleCancel}
            handleSuccess={mockHandleSuccess}
          />
        </div>
      );
    });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
