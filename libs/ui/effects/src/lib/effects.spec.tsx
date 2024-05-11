import { render } from '@testing-library/react';

import Effects from './effects';

describe('Effects', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Effects />);
    expect(baseElement).toBeTruthy();
  });
});
