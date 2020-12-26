# kontext common

This is the repository for all commonly shared JS code of the kontext project.

## Get started

### Prerequisites

- node@^14
- yarn@^1.22

### Install dependencies

```bash
yarn
```

### Set env variables

Copy the distributed `.env` file to a new `.env.local` file and set the environmental variables there.

## Publish schemas and definitions

To publish the JSON schemas in `schemas` run

```bash
yarn idx:publish
```

This will publish them to the configured ceramic node and update the doc ids.

## Tests

```bash
yarn test
```
