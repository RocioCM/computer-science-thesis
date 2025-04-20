import TestAppWrapper from '@/common/utils/tests';
import Page from '@/pages/recycler/waste-bottles';
import { render } from '@testing-library/react';

describe('Recycler - Waste Bottles Page', () => {
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
