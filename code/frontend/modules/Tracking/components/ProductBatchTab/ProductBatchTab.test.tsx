import { render } from '@testing-library/react';
import ProductBatchTab from './ProductBatchTab';

describe('Tracking - ProductBatchTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  it('Matches snapshot with batch', () => {
    const { container } = render(
      <ProductBatchTab
        batch={{
          id: 1,
          owner: '0x1234567890abcdef1234567890abcdef12345678',
          quantity: 100,
          availableQuantity: 80,
          originBaseBatchId: 2,
          trackingCode: 'TRACK123',
          createdAt: new Date('2025-04-13T13:00:00').toISOString(),
        }}
        options={[]}
        handleOption={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('Matches snapshot with options', () => {
    const { container } = render(
      <ProductBatchTab
        batch={null}
        options={[
          {
            label: 'Option 1',
            value: 1,
          },
          {
            label: 'Option 2',
            value: 2,
          },
        ]}
        handleOption={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
