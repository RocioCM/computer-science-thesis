import { render } from '@testing-library/react';
import BottleSearchModal from './BottleSearchModal';

describe('Consumer - BottleSearchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <div id="modal-root">
        <BottleSearchModal handleRecycle={() => {}} handleCancel={() => {}} />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
