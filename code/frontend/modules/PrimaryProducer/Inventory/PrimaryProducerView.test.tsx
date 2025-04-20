import TestAppWrapper from '@/common/utils/tests';
import PrimaryProducerPage from '@/pages/producer/index';
import { render } from '@testing-library/react';

describe('Primary Producer Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <TestAppWrapper>
        <PrimaryProducerPage />
      </TestAppWrapper>
    );
    expect(container).toMatchSnapshot();
  });
});
