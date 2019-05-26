const Tendzin = require('../src');

test('spawn a compute unit', async () => {
  const client = Tendzin({ token: 'f8c1c63f002740d6a837fa661bc2719f', node: 'sydney' });

  const { id } = await client.spawn();

  expect(id)
});
