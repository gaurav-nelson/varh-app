<p align="center">
  <img src="https://github.com/gaurav-nelson/varh-app/blob/main/resources/icons/appIcon.png?raw=true" alt="Logo" height=170>
</p>

# varh-app
Desktop app for linting your AsciiDoc files with [vale-at-red-hat](https://github.com/redhat-documentation/vale-at-red-hat).

<img src="https://neutralino.js.org/img/apps/varh-app-demo.gif">

## Pre-requisites
You must have the following applications installed on your system:
- [Asciidoctor](https://asciidoctor.org/)
- [Vale](https://vale.sh/docs/vale-cli/installation/)

## Installation
1. Download the latest release for your platform from the [releases page](https://github.com/gaurav-nelson/varh-app/releases).
2. Extract the zip file.
   ```
    unzip varh-app-<platform>_<arch>.zip
   ```
3. Run the executable from your command line.
    ```
     ./varh-app-<platform>_<arch>
    ```

## Usage
1. Click on `Select openshift-docs directory` and select your `openshift-docs` directory. Or any other directory containing the Vale configuration `.vale.ini` file.
2. Drag and drop or paste file contents into the editor.
3. Click `Lint` to lint the file and view errors.

## Other features
- Click `Clear` to clear the editor.
- Click on the tray icon and select `Vale sync` to sync your local vale rules with the latest vale-at-red-hat rules.
- Click on the `sun` or `moon` icon to toggle between light and dark mode.
