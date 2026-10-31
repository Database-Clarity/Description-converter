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

## Publisher usage

`examples/publisher.ts` is the complete `index.ts` for Live-Clarity-Database `converter`, updated for alias stubs and
tested by `test/publisher.test.mjs`. Replace the publisher's `index.ts` with it (import from `@icemourne/description-converter`
instead of `../index.js`). The old `index.ts` throws on a stub (it reads `perk.editor.en`), so the new package alone is not
enough: the publisher has to be updated **before** the first stub is written to `liveDescriptions.json`.

What it does in `databaseConverter(converterType, database, inventoryItem)`:

```ts
const lookup = expandAliases(database) // full copies, pass as `database` to descriptionConverter and use for every lookup
const aliasOutput = isAliasStub(perk) ? getAliasOutput(settings, perk) : 'copy' // for each perk of `database`
// 'skip' -> nothing; 'copy' -> convert lookup[hash]; 'reference' -> keep { hash, aliasOf } for after the loop
```

- The usual filters (hash >= 50, non-empty English description, Bungie description) run on `lookup[hash]`.
- A reference is added after the loop and only if the row of `aliasOf` is part of the same output. The alias can pass
  the filters while the original does not (for example only the original repeats the Bungie description), and
  consumers have nothing to look the alias up with then.
- `expandAliases` leaves out stubs that point at a missing perk (or at another stub) and never throws, so `lookup[hash]`
  can be `undefined`: skip those.
- The example only publishes when run as the program, so `databaseConverter` can be imported by tests.

## Upgrading

Custom `DescriptionFilter` objects need the new `getFromPerk.associated` and `aliases` fields. `Database['perks']` values
are now `IntermediatePerk | AliasStub`; use `expandAliases` (result: `ExpandedPerks`) before reading `editor`.
`DescriptionData.database` has to be expanded.
