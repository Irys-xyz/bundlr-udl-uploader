# Bundlr UDL Uploader

This is a [Bundlr](https://bundlr.network) + [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Tailwind](https://tailwindcss.com/) project that demonstrates how to upload content with a [UDL](https://arwiki.wiki/#/en/Universal-Data-License-How-to-use-it#toc_Commercial_Use) to [Arweave](https://www.arweave.org/) using [Bundlr](https://bundlr.network).

<img height="400" src="https://github.com/Bundlr-Network/bundlr-udl-uploder/blob/master/assets/udl-uploader.png?raw=true" />

## Getting Started

Clone this repo and then run:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Overview

This repo demonstrates how to attach a UDL (Universal Data License) to files uploaded to Arweave using Bundlr. The UDL is built dynamically using the parameters specified in the UI, converted to a set of metatags that are then attached to the file at upload.

You can fork and build directly on top of it or copy-paste specific code into your projects.

-   `utils/getBundlr.ts`: Configures and returns a Bundlr object. This is where you set your node and currency.
-   `utils/fundAndUpload.ts`: Is passed a file and tags, funds the node if necessary and then uploads.
-   `componennts/Spinner.tsx`: UI spinner, used to show a transaction is in progress.
-   `components/BundlrUploader.tsx`: File uploder UI.

## Confirming With GraphQL

Once you have successfully uploaded your file, you will receive a link containing a transaction ID. This ID can be used to query UDL data via [GraphQL](https://docs.bundlr.network/developer-docs/graphql).

To get started, connect to the GraphQL endpoint associated with the node where you uploaded your transaction:

-   Node 1: https://node1.bundlr.network/graphql
-   Node 2: https://node2.bundlr.network/graphql
-   Devnet: https://devnet.bundlr.network/graphql

After connecting, execute a query similar to the following, replacing the ID with the actual transaction ID generated during your upload:

```graphql
query getUDL {
  transactions(ids: ["521Bu2eyPqIYeGiBhQ04zbd9QhHokVaGmg1vLH5D78A"]) {
    edges {
      node {
        tags {
          name
          value
        }
      }
    }
  }
}
```

<img height="400" src="https://github.com/Bundlr-Network/bundlr-udl-uploder/blob/master/assets/graphql-udl.png?raw=true" />


## Further Reading
- [Bundlr GraphQL](https://docs.bundlr.network/developer-docs/graphql)
- [Bundlr Docs](https://docs.bundlr.network/developer-docs/graphql)
- [Bundlr Discord](https://discord.bundlr.network/)
-   [Introducing the Universal Data License](https://mirror.xyz/0x64eA438bd2784F2C52a9095Ec0F6158f847182d9/AjNBmiD4A4Sw-ouV9YtCO6RCq0uXXcGwVJMB5cdfbhE)
-   [Universal Data License: How to use it](https://arwiki.wiki/#/en/Universal-Data-License-How-to-use-it)
-   [The Universal Data License Explained](https://dev.to/fllstck/the-universal-data-license-explained-2di)
-   [Monetize Your Content with the UDL](https://dev.to/fllstck/monetize-your-content-with-the-udl-1i1l)
