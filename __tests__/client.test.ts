import { getClient } from './support/clientMock';

test('spawn a compute unit', async () => {
  const client = getClient({ token: 'f8c1c63f002740d6a837fa661bc2719f', node: 'sydney' });

  const { id } = await client.spawn('days');

  expect(id)
});
