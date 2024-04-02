import { getClient, search, isAvailable, TendzinClient, CalendarSearchResult } from 'tendzin'

async function getSearchResults(client: TendzinClient): Promise<CalendarSearchResult[]> {
  const result = await search(client, {
    id: '251c991c-c3b1-4d96-8207-33af585504fd',
    months: 2,
    offset: 1,
    period: 2,
  })
  return result
}

async function getIsAvailableResults(client: TendzinClient): Promise<boolean> {
  const result = await isAvailable(client, {
    id: '251c991c-c3b1-4d96-8207-33af585504fd',
    start: "2024-10-01",
    end: "2024-10-02",
  })
  return result
}

async function main() {
  const client = getClient({ token: process.env.TOKEN, node: 'sydney' });

  const searchResults = await getSearchResults(client);
  const isAvailableResults = await getIsAvailableResults(client);

  return { searchResults, isAvailableResults }
}

main().then((result) => {
  console.log(result)
  process.exit(0)
}).catch((e) => {
  console.log(e)
  process.exit(1)
})
