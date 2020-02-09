# @xrathus/jupyterlab

Official Xrathus extension for JupyterLab.

## Requirements

* JupyterLab >= 1.1.0
* A Xrathus account for accessing Xrathus API

To run this extension, you will need to download a Xrathus API token.  You can
find the token on your [Xrathus account page](https://www.xrathus.com/me/account).

Once you download the token to your local machine, you can drag & drop the
token onto the settings page of the Xrathus extension for JupyterLab.

## Overview

Xrathus extension for JupyterLab enables you to browse and download Xrathus
Datasets for use in your JupyterLab instance.

![Xrathus](XrathusJupyterLab.png 'Xrathus')

## Getting started

### Install

Run the following command on your JupyterLab system to install the extension.

```bash
jupyter labextension install @xrathus/jupyterlab
```

Next time you start JupyterLab, you should see a shiny new Xrathus icon on the left panel.

![SideIcon](ExtensionIcon.png 'Icon')

### Configure

To use the extension, you’ll need to download your Xrathus API token from your account page.  You can import the token into the extension by dragging & dropping the downloaded file into the dotted area, or you can click on the input box to bring up the file browser (1).  Once you’ve imported the file, be sure to save your changes (2).

![Configure](Configure.png 'Configure')

Once you save the changes, it will automatically take you to the dataset list panel, but you can always click on the settings icon to update the token.

### Work

1. On the dataset listing page, you can enter a search term in the input box to filter the results.  
2. Once you find the dataset you’re interested in, click the download icon to download the dataset to your system.


![Work](Work.png 'Work')

## Contributing

We'd love to accept your patches and contributions to this project. See
[CONTRIBUTING.md](CONTRIBUTING.md) for more information.

### Development

Here are some quick instructions to get you started experimenting with
this extension locally.

#### Requirements

* JupyterLab >= 1.1.0
* A Xrathus account for accessing Xrathus API
* [Yarn](https://yarnpkg.com)
* [Docker](https://www.docker.com)

#### Build & Run

```bash
# Clone the repo to your local environment
# Move to jupyterlab directory

# Install dependencies
> yarn

# Build All
> yarn build:all

# Start the docker running JupyterLab with @xrathus/jupyterlab extension
# Look for the url to access the JupyterLab instance in the console output
# once the service finishes starting up
> yarn docker

# If you are working on Windows, run this command instead
> yarn docker:win
```

You can modify the Typescript files while docker is running and rebuild
the extension to see the changes in JupyterLab.  This requires a refresh of
your browser after the extension has been rebuilt.

```bash
# Rebuild Typescript source after making changes
> yarn build
```
