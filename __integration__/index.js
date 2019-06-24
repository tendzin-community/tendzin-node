const { getClient, calendar } = require('tendzin');

async function main() {
  const client = getClient({ token: process.env.TOKEN, node: 'sydney' });
  const result = await calendar.search(client, {
    id: '251c991c-c3b1-4d96-8207-33af585504fd',
    months: 12
  })
  return result
}

main().then((result) => {
  console.log(result)
  process.exit(0)
}).catch((e) => {
  console.log(e)
  process.exit(1)
})
