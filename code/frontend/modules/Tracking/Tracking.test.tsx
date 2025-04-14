import TestAppWrapper from '@/common/utils/tests';
import TrackingPage from '@/pages/tracking';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TrackingServices from '@/modules/Tracking/services';
import { toast } from 'react-toastify';

jest.mock('@/modules/Tracking/services');

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
    expect(screen.getByText('Tipo')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  it('disables the ID input when no type is selected', () => {
    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const idInput = screen.getByTestId('input');
    expect(idInput).toBeDisabled();
  });

  it('enables the ID input when a type is selected', async () => {
    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByTestId('dropdown');
    await act(async () => fireEvent.click(typeDropdown));
    const option = screen.getByText('Lote Base');
    await act(async () => fireEvent.click(option));

    const idInput = screen.getByTestId('input');
    expect(idInput).not.toBeDisabled();
  });

  it('calls the correct service when searching for a base batch', async () => {
    const mockGetBaseBottlesBatchById = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        bottleType: {
          color: 'Red',
          shapeType: 'Round',
          weight: 300,
          originLocation: 'Mza',
          thickness: 3,
          extraInfo: '900ml',
          composition: [{ name: 'Glass', amount: 100, measureUnit: '%' }],
        },
        owner: '0x1234567890abcdef1234567890abcdef12345678',
        quantity: 100,
        soldQuantity: 50,
        createdAt: new Date().toISOString(),
      },
    });
    TrackingServices.getBaseBottlesBatchById = mockGetBaseBottlesBatchById;

    const mockGetAllProductsFromBaseBatch = jest.fn().mockResolvedValue({
      ok: true,
      data: [1, 2, 3],
    });
    TrackingServices.getAllProductsFromBaseBatch =
      mockGetAllProductsFromBaseBatch;

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByTestId('dropdown');
    await act(async () => fireEvent.click(typeDropdown));
    const option = screen.getByText('Lote Base');
    await act(async () => fireEvent.click(option));

    const idInput = screen.getByTestId('input');
    await act(async () =>
      fireEvent.change(idInput, { target: { value: '1' } })
    );

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => fireEvent.click(searchButton));

    expect(TrackingServices.getBaseBottlesBatchById).toHaveBeenCalledWith(1);
    expect(TrackingServices.getAllProductsFromBaseBatch).toHaveBeenCalledTimes(
      1
    );
    expect(screen.getByText('Cantidad de envases:')).toBeInTheDocument();
  });

  it('shows an error toast when the base batch is not found', async () => {
    const mockGetBaseBottlesBatchById = jest.fn().mockResolvedValue({
      ok: false,
    });
    TrackingServices.getBaseBottlesBatchById = mockGetBaseBottlesBatchById;

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByTestId('dropdown');
    await act(async () => fireEvent.click(typeDropdown));
    const option = screen.getByText('Lote Base');
    await act(async () => fireEvent.click(option));

    const idInput = screen.getByTestId('input');
    await act(async () =>
      fireEvent.change(idInput, { target: { value: '1' } })
    );

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => fireEvent.click(searchButton));

    expect(TrackingServices.getBaseBottlesBatchById).toHaveBeenCalledWith(1);
    expect(toast.error).toHaveBeenCalledWith(
      'No encontramos el lote base que buscas, revisa el ID'
    );
  });

  it('calls the correct service when searching for a product batch', async () => {
    const mockGetBaseBottlesBatchById = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        bottleType: {
          color: 'Red',
          shapeType: 'Round',
          weight: 300,
          originLocation: 'Mza',
          thickness: 3,
          extraInfo: '900ml',
          composition: [{ name: 'Glass', amount: 100, measureUnit: '%' }],
        },
        owner: '0x1234567890abcdef1234567890abcdef12345678',
        quantity: 100,
        soldQuantity: 50,
        createdAt: new Date().toISOString(),
      },
    });
    TrackingServices.getBaseBottlesBatchById = mockGetBaseBottlesBatchById;

    const mockGetProductBatchByCode = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        owner: '0x1234567890abcdef1234567890abcdef12345678',
        quantity: 100,
        availableQuantity: 80,
        originBaseBatchId: 2,
        trackingCode: 'TRACK123',
        createdAt: new Date().toISOString(),
      },
    });
    TrackingServices.getProductBatchByCode = mockGetProductBatchByCode;

    const mockGetAllWasteBottlesFromProductBatchById = jest
      .fn()
      .mockResolvedValue({
        ok: true,
        data: [1, 2, 3],
      });
    TrackingServices.getAllWasteBottlesFromProductBatchById =
      mockGetAllWasteBottlesFromProductBatchById;

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByTestId('dropdown');
    await act(async () => fireEvent.click(typeDropdown));
    const option = screen.getByText('Lote Producto');
    await act(async () => fireEvent.click(option));

    const idInput = screen.getByTestId('input');
    await act(async () =>
      fireEvent.change(idInput, { target: { value: 'abc' } })
    );

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => fireEvent.click(searchButton));

    expect(TrackingServices.getProductBatchByCode).toHaveBeenCalledWith('abc');
    expect(TrackingServices.getBaseBottlesBatchById).toHaveBeenCalledWith(2);
    expect(
      TrackingServices.getAllWasteBottlesFromProductBatchById
    ).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Información General')).toBeInTheDocument();
    expect(screen.getByText('Código de seguimiento:')).toBeInTheDocument();
    expect(screen.getByText('Cantidad de envases:')).toBeInTheDocument();
  });

  it('shows an error toast when product batch is not found', async () => {
    const mockGetProductBatchByCode = jest.fn().mockResolvedValue({
      ok: false,
    });
    TrackingServices.getProductBatchByCode = mockGetProductBatchByCode;

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByTestId('dropdown');
    await act(async () => fireEvent.click(typeDropdown));
    const option = screen.getByText('Lote Producto');
    await act(async () => fireEvent.click(option));

    const idInput = screen.getByTestId('input');
    await act(async () =>
      fireEvent.change(idInput, { target: { value: 'abc' } })
    );

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => fireEvent.click(searchButton));

    expect(TrackingServices.getProductBatchByCode).toHaveBeenCalledWith('abc');
    expect(toast.error).toHaveBeenCalledWith(
      'No encontramos el lote de producto que buscas, revisa el código de seguimiento'
    );
  });

  it('calls the correct service when searching for a waste bottle', async () => {
    const mockGetBaseBottlesBatchById = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        bottleType: {
          color: 'Red',
          shapeType: 'Round',
          weight: 300,
          originLocation: 'Mza',
          thickness: 3,
          extraInfo: '900ml',
          composition: [{ name: 'Glass', amount: 100, measureUnit: '%' }],
        },
        owner: '0x1234567890abcdef1234567890abcdef12345678',
        quantity: 100,
        soldQuantity: 50,
        createdAt: new Date().toISOString(),
      },
    });
    TrackingServices.getBaseBottlesBatchById = mockGetBaseBottlesBatchById;

    const mockGetProductBatchByCode = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        owner: '0x1234567890abcdef1234567890abcdef12345678',
        quantity: 100,
        availableQuantity: 80,
        originBaseBatchId: 2,
        trackingCode: 'TRACK123',
        createdAt: new Date().toISOString(),
      },
    });
    TrackingServices.getProductBatchByCode = mockGetProductBatchByCode;

    const mockGetWasteBottleById = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        owner: '0x1234567890abcdef1234567890abcdef12345678',
        creator: '0xabcdef1234567890abcdef1234567890abcdef12',
        recycledBatchId: 3,
        trackingCode: 'TRACK123',
        createdAt: new Date().toISOString(),
      },
    });
    TrackingServices.getWasteBottleById = mockGetWasteBottleById;

    const mockGetRecyclingBatchById = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        id: 3,
        buyerOwner: '0x1234567890abcdef1234567890abcdef12345678',
        creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        extraInfo: 'Some extra info',
        materialType: 'Pure glass',
        wasteBottleIds: [1, 2, 3],
        size: '10x10x10',
        weight: 100,
        composition: [{ name: 'Glass', amount: 100, measureUnit: '%' }],
        createdAt: new Date().toISOString(),
      },
    });
    TrackingServices.getRecyclingBatchById = mockGetRecyclingBatchById;

    const mockGetAllWasteBottlesFromProductBatchById = jest
      .fn()
      .mockResolvedValue({ ok: true, data: [1, 2, 3] });
    TrackingServices.getAllWasteBottlesFromProductBatchById =
      mockGetAllWasteBottlesFromProductBatchById;

    const mockGetUserPublicData = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        email: 'test@mail.com',
        blockchainId: '0x123456789',
        userName: 'Test Name',
        phone: '1234567890',
      },
    });
    TrackingServices.getUserPublicData = mockGetUserPublicData;

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByTestId('dropdown');
    await act(async () => fireEvent.click(typeDropdown));
    const option = screen.getByText('Botella Reciclada');
    await act(async () => fireEvent.click(option));

    const idInput = screen.getByTestId('input');
    await act(async () =>
      fireEvent.change(idInput, { target: { value: '1' } })
    );

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => fireEvent.click(searchButton));

    expect(TrackingServices.getWasteBottleById).toHaveBeenCalledWith(1);
    expect(TrackingServices.getProductBatchByCode).toHaveBeenCalledWith(
      'TRACK123'
    );
    expect(TrackingServices.getBaseBottlesBatchById).toHaveBeenCalledWith(2);
    expect(TrackingServices.getRecyclingBatchById).toHaveBeenCalledWith(3);
    expect(
      TrackingServices.getAllWasteBottlesFromProductBatchById
    ).not.toHaveBeenCalled();

    expect(screen.getByText('Información General')).toBeInTheDocument();
    expect(screen.getByText('Código de seguimiento:')).toBeInTheDocument();
    expect(screen.getByText('Usuario reciclador:')).toBeInTheDocument();
    expect(screen.getByText('Fecha de reciclaje:')).toBeInTheDocument();
  });

  it('shows an error toast when waste bottle is not found', async () => {
    const mockGetWasteBottleById = jest.fn().mockResolvedValue({
      ok: false,
    });
    TrackingServices.getWasteBottleById = mockGetWasteBottleById;

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByTestId('dropdown');
    await act(async () => fireEvent.click(typeDropdown));
    const option = screen.getByText('Botella Reciclada');
    await act(async () => fireEvent.click(option));

    const idInput = screen.getByTestId('input');
    await act(async () =>
      fireEvent.change(idInput, { target: { value: '1' } })
    );

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => fireEvent.click(searchButton));

    expect(TrackingServices.getWasteBottleById).toHaveBeenCalledWith(1);
    expect(toast.error).toHaveBeenCalledWith(
      'No encontramos la botella reciclada que buscas, revisa el ID'
    );
  });

  it('calls the correct service when searching for a recycling batch', async () => {
    const mockGetRecyclingBatchById = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        buyerOwner: '0x1234567890abcdef1234567890abcdef12345678',
        creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        extraInfo: 'Some extra info',
        materialType: 'Pure glass',
        wasteBottleIds: [1, 2, 3],
        size: '10x10x10',
        weight: 100,
        composition: [{ name: 'Glass', amount: 100, measureUnit: '%' }],
        createdAt: new Date().toISOString(),
      },
    });
    TrackingServices.getRecyclingBatchById = mockGetRecyclingBatchById;

    const mockGetUserPublicData = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        email: 'test@mail.com',
        blockchainId: '0x123456789',
        userName: 'Test Name',
        phone: '1234567890',
      },
    });
    TrackingServices.getUserPublicData = mockGetUserPublicData;

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByTestId('dropdown');
    await act(async () => fireEvent.click(typeDropdown));
    const option = screen.getByText('Lote Reciclaje');
    await act(async () => fireEvent.click(option));

    const idInput = screen.getByTestId('input');
    await act(async () =>
      fireEvent.change(idInput, { target: { value: '1' } })
    );

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => fireEvent.click(searchButton));

    expect(TrackingServices.getRecyclingBatchById).toHaveBeenCalledWith(1);

    expect(screen.getByText('Información General')).toBeInTheDocument();
    expect(screen.getByText('Material:')).toBeInTheDocument();
    expect(screen.getByText('Tamaño:')).toBeInTheDocument();
    expect(screen.getByText('Composición')).toBeInTheDocument();
  });

  it('shows an error toast when recycling batch is not found', async () => {
    const mockGetRecyclingBatchById = jest.fn().mockResolvedValue({
      ok: false,
    });
    TrackingServices.getRecyclingBatchById = mockGetRecyclingBatchById;

    render(
      <TestAppWrapper>
        <TrackingPage />
      </TestAppWrapper>
    );

    const typeDropdown = screen.getByTestId('dropdown');
    await act(async () => fireEvent.click(typeDropdown));
    const option = screen.getByText('Lote Reciclaje');
    await act(async () => fireEvent.click(option));

    const idInput = screen.getByTestId('input');
    await act(async () =>
      fireEvent.change(idInput, { target: { value: '1' } })
    );

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await act(async () => fireEvent.click(searchButton));

    expect(TrackingServices.getRecyclingBatchById).toHaveBeenCalledWith(1);
    expect(toast.error).toHaveBeenCalledWith(
      'No encontramos el lote de material reciclado que buscas, revisa el ID'
    );
  });
});
