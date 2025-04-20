import TestAppWrapper from '@/common/utils/tests';
import Page from '@/pages/recycler/index';
import { render } from '@testing-library/react';

describe('Recycler - Inventory Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <TestAppWrapper>
        <Page />
      </TestAppWrapper>
    );
    expect(container).toMatchSnapshot();
  });
});
