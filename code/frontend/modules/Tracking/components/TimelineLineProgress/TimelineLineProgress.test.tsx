import { render } from '@testing-library/react';
import TimelineLineProgress from './TimelineLineProgress';

describe('Tracking - TimeLineProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <TimelineLineProgress
        tabsData={{
          baseBatch: null,
          productBatch: null,
          wasteBottle: null,
          recyclingBatch: null,
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
