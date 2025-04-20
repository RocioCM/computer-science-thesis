import TestAppWrapper from '@/common/utils/tests';
import Page from '@/pages/consumer/index';
import { render } from '@testing-library/react';

describe('Consumer Page', () => {
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
