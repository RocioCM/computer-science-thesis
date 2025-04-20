import { render } from '@testing-library/react';
import WasteBottleTab from './WasteBottleTab';

describe('Tracking - WasteBottleTab', () => {
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
      <WasteBottleTab
        bottle={{
          id: 1,
          owner: '0x1234567890abcdef1234567890abcdef12345678',
          creator: '0xabcdef1234567890abcdef1234567890abcdef12',
          recycledBatchId: 1,
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
      <WasteBottleTab
        bottle={null}
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
