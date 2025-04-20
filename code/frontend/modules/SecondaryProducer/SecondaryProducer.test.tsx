import TestAppWrapper from '@/common/utils/tests';
import Page from '@/pages/secondary-producer/index';
import { render } from '@testing-library/react';

describe('Secondary Producer Page', () => {
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
