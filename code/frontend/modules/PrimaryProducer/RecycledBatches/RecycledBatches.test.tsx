import TestAppWrapper from '@/common/utils/tests';
import Page from '@/pages/producer/recycled-batches';
import { render } from '@testing-library/react';

describe('Primary Producer - Recycled Batches Page', () => {
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
