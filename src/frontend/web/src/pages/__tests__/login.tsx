import React from 'react';
import { InMemoryCache } from '@apollo/client';
import gql from 'graphql-tag';

import {
  renderApollo,
  cleanup,
  fireEvent,
  waitForElement,
} from '../../test-utils';
import Login, { LOGIN_USER } from '../login';

describe('Login Page', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders login page', async () => {
    renderApollo(<Login />);
  });

  it('fires login mutation and updates cache after done', async () => {
    const cache = new InMemoryCache();
    const mocks = [
      {
        request: { query: LOGIN_USER, variables: { email: 'a@a.a' } },
        result: { data: { login: 'abc' } },
      },
    ];

    const { getByText, getByTestId } = await renderApollo(<Login />, {
      mocks,
      cache,
    });

    fireEvent.change(getByTestId('login-input'), {
      target: { value: 'a@a.a' },
    });

    fireEvent.click(getByText(/log in/i));

    // login is done if loader is gone
    await waitForElement(() => getByText(/log in/i));

    // check to make sure the cache's contents have been updated
    const response: any = cache.readQuery({
      query: gql`
        query IsUserLoggedIn {
          isLoggedIn @client
        }
      `,
    });
    const { isLoggedIn } = response;
    expect(isLoggedIn).toBeTruthy();
  });
});
