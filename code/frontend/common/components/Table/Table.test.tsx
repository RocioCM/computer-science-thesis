import { render, screen, act } from '@testing-library/react';
import Table from './Table';

// Mock IntersectionObserver
class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

const mockHandleFetch = jest.fn();

describe('Table Component', () => {
  const columns = [
    { name: 'id', title: 'ID' },
    { name: 'name', title: 'Name', formatter: (data: any) => data.name },
  ];
  const mockData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  beforeAll(() => {
    window.IntersectionObserver = IntersectionObserver;
  });

  beforeEach(() => {
    mockHandleFetch.mockClear();
    mockHandleFetch.mockResolvedValue(mockData);
  });

  it('renders table and columns', async () => {
    await act(async () => {
      render(
        <Table columns={columns} handleFetch={mockHandleFetch} title="items" />
      );
    });
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('shows fetched data', async () => {
    await act(async () => {
      render(
        <Table columns={columns} handleFetch={mockHandleFetch} shouldRefresh />
      );
    });
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('shows no data message when empty', async () => {
    mockHandleFetch.mockResolvedValue([]);
    await act(async () => {
      render(
        <Table
          columns={columns}
          handleFetch={mockHandleFetch}
          shouldRefresh
          title="items"
        />
      );
    });

    // Regex for "No items found" with any scape character and content after it.
    expect(screen.getByText(/No se encontraron items/i)).toBeInTheDocument();
  });

  it('calls handleFetch on refresh', async () => {
    const { rerender } = render(
      <Table
        columns={columns}
        handleFetch={mockHandleFetch}
        shouldRefresh={true}
      />
    );
    expect(mockHandleFetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      rerender(
        <Table
          columns={columns}
          handleFetch={mockHandleFetch}
          shouldRefresh={false}
        />
      );
    });
    await act(async () => {
      rerender(
        <Table
          columns={columns}
          handleFetch={mockHandleFetch}
          shouldRefresh={true}
        />
      );
    });
    expect(mockHandleFetch).toHaveBeenCalledTimes(2);
  });
});
