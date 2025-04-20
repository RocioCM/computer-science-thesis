import TestAppWrapper from '@/common/utils/tests';
import Page from '@/pages/consumer/index';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import auth from '@/common/libraries/auth';
import { ROLES } from '@/common/constants/auth';

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
