
---

# Scribble - A Tauri & Next.js Application

## Overview
**Scribble** is a cross-platform note-taking application built using [Next.js](https://nextjs.org/) and [Tauri](https://tauri.app/). The app saves notes in a folder called `Scribble`, located inside the `Documents` directory on both Linux and Windows.

## Prerequisites

### Windows
To develop and run the app on Windows, you need the following dependencies:

1. **Microsoft C++ Build Tools**
    - Download and install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
    - During installation, select the "Desktop development with C++" option.

2. **Microsoft Edge WebView2**
    - WebView2 is pre-installed on Windows 10 (version 1803 and later). If you don't have it, download and install the [WebView2 Runtime Evergreen Bootstrapper](https://developer.microsoft.com/en-us/microsoft-edge/webview2/).

3. **Rust**
    - Install Rust using [rustup](https://www.rust-lang.org/tools/install).
    - After installation, restart your terminal (or system) to apply changes.

4. **Node.js**
    - Install [Node.js](https://nodejs.org/) if you wish to use Next.js.

### Linux (Ubuntu)
To develop and run the app on Ubuntu or similar distributions, follow these steps:

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

Install Rust using:

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

### Install Dependencies
Once the environment is set up, install the project dependencies:

```bash
bun install
# or alternatively, you can use pnpm
pnpm install
```
https://beta.tauri.app/start/prerequisites/ for troubleshooting

## Running the Application

### Development
To launch the development version of the application, use the following command:

```bash
bun tauri dev
```

### Notes Storage
All notes will be saved in the `Scribble` folder located inside your `Documents` directory.

- **Linux Path**: `~/Documents/Scribble`
- **Windows Path**: `C:\Users\<YourUserName>\Documents\Scribble`

---

