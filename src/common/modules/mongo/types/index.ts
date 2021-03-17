type FixtureBase = {
  collectionName: string;
};

type FixtureInput =
  | string
  | (FixtureBase & {
      source?: string;
    });

type Fixture = FixtureBase & {
  [x: string]: any;
};

export { FixtureBase, FixtureInput, Fixture };
