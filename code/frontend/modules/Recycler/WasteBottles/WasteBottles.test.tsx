import TestAppWrapper from '@/common/utils/tests';
import Page from '@/pages/recycler/waste-bottles';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import auth from '@/common/libraries/auth';
import { ROLES } from '@/common/constants/auth';

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
