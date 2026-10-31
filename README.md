# description-converter

Converts the intermediate description database into the formats published for each consumer (`converterSettings`).

## Aliases

The same tooltip can be published under more than one hash. In the intermediate database such an alias may be a stub
(`AliasStub`): `{ hash, aliasOf, aliasKind: 'sandbox' | 'frame', name?, type?, itemHash?, itemName? }`. The stub only
carries the alias's own catalog facts, the descriptions are on the perk with hash `aliasOf`.

`settings.aliases` decides how an alias is output:

- `'legacy'` (clarity, dim, crayon, foundry, lightGG, braytech, vaultZero): `frame` aliases are output as full copies of the
  original, `sandbox` aliases are omitted.
- `'reference'` (clarityV2): every alias is output as `{ hash, aliasOf }` and nothing else.

Publisher usage, 3 steps inside `databaseConverter`:

```ts
const lookup = expandAliases(database) // full copies, pass as `database` to descriptionConverter and use for every lookup
const mode = isAliasStub(perk) ? getAliasOutput(settings, perk) : 'copy' // for each perk of `database`
// 'skip' -> output nothing; 'reference' -> acc[hash] = { hash: perk.hash, aliasOf: perk.aliasOf }; 'copy' -> convert lookup[hash] as usual
```

Run the usual filters (hash >= 50, non-empty English description, Bungie description) on `lookup[hash]`, so a reference
is only output when the alias would have been output as a copy. `expandAliases` leaves out stubs that point at a missing perk
(or at another stub) and never throws, so `lookup[hash]` can be `undefined` for those: skip them.
