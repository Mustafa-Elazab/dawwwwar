# Dawwar Maestro Automation Suite

This directory contains production-grade E2E automation tests for the Dawwar Customer Android app, powered by [Maestro](https://maestro.mobile.dev/).

## Prerequisites

1. Install Maestro:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```
2. Have an Android Emulator running.
3. Have the local backend running (`npm run dev` in `backend/`).
4. Build and install the app on the emulator:
   ```bash
   cd apps/customer
   npm run android
   ```

## Folder Structure

- `config/`: Contains environment configurations.
- `flows/`: The actual test scenarios (Splash, Auth, Home, Checkout, etc.).
- `fragments/`: Reusable steps like Login and taking screenshots.
- `screenshots/`: Automatically generated screenshots during flows.

## Running Tests

Run a specific flow:
```bash
maestro test maestro/customer/flows/06_checkout.yaml
```

Run the entire suite:
```bash
maestro test maestro/customer/flows/full_flow.yaml
```

## Debugging

If a test fails, Maestro will output a report indicating the missing selector.
You can view the View Hierarchy natively by running:
```bash
maestro hierarchy
```

To run a script with a visual timeline of actions, you can use Maestro Studio:
```bash
maestro studio
```
This opens a web UI where you can click on elements directly and auto-generate assertions.

## Test Identifiers
To make tests bulletproof, ensure core React Native components have `testID` or `accessibilityLabel` set matching the selectors inside these YAML flows.
