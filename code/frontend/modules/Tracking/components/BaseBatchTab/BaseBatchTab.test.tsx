import { render } from '@testing-library/react';
import BaseBatchTab from './BaseBatchTab';

describe('Tracking - BaseBatchTab', () => {
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
      <BaseBatchTab
        batch={{
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
          createdAt: new Date('2025-04-13T13:00:00').toISOString(),
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
