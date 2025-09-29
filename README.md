# Git Utils Extension

This VS Code extension provides several utilities to enhance the Git integration in Visual Studio Code.

## Features

*   **Undo Last Commit**: Adds a button to the Source Control view to easily undo the last commit.
*   **Open File in Write Mode**: A command to open the active file in write mode.

## Building and Installing

To build and install this extension locally, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/) and npm must be installed.

### Build

1.  Clone the repository or download the source code.
2.  Open a terminal in the project's root directory.
3.  Install the development dependencies:
    ```bash
    npm install
    ```
4.  Package the extension into a `.vsix` file using the following command:
    ```bash
    npx vsce package
    ```
    This will create a file named `git-utils-extension-x.x.x.vsix` in the project directory.

### Installation

1.  Open Visual Studio Code.
2.  Go to the **Extensions** view (`Ctrl+Shift+X`).
3.  Click the **...** (More Actions) menu in the top-right corner of the view.
4.  Select **Install from VSIX...**.
5.  Locate and select the `.vsix` file you created in the build step.
6.  Reload VS Code when prompted.
