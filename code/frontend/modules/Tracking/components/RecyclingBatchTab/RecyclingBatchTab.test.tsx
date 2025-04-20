import { render, screen, fireEvent, act } from '@testing-library/react';
import RecyclingBatchTab from './RecyclingBatchTab';

describe('Tracking - RecyclingBatchTab', () => {
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

  it('Matches snapshot', () => {
    const { container } = render(
      <RecyclingBatchTab
        batch={{
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
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
