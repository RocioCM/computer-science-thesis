import TestAppWrapper from '@/common/utils/tests';
import PrimaryProducerPage from '@/pages/producer/index';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import auth from '@/common/libraries/auth';
import { ROLES } from '@/common/constants/auth';

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
