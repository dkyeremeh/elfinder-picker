# elFinder Picker Demo

This demo showcases the elFinder Picker library with multiple examples using Vite and TypeScript.

## Demo Structure

Each demo is in a separate HTML file with its own TypeScript module:

- **[index.html](./index.html)** - Main gallery/landing page with links to all demos
- **[basic.html](./basic.html)** - Simple file selection demo
- **[image.html](./image.html)** - Image selection with preview
- **[custom.html](./custom.html)** - Custom configuration with metadata
- **[reusable.html](./reusable.html)** - Reusable picker instance demo
- **[mock-elfinder.html](./mock-elfinder.html)** - Mock elFinder interface for testing

## Getting Started

### Install Dependencies

```bash
yarn install
```

### Run Development Server

```bash
yarn dev
```

This will start the Vite dev server at `http://localhost:3000` and automatically open the demo gallery.

### Build for Production

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

## File Structure

```
demo/
├── index.html              # Main gallery page
├── basic.html             # Basic demo
├── image.html             # Image demo
├── custom.html            # Custom config demo
├── reusable.html          # Reusable instance demo
├── mock-elfinder.html     # Mock elFinder page
├── scripts/
│   ├── basic.ts          # Basic demo logic
│   ├── image.ts          # Image demo logic
│   ├── custom.ts         # Custom demo logic
│   └── reusable.ts       # Reusable demo logic
└── styles/
    └── demo.css          # Shared styles for all demos
```

## Features Demonstrated

### Basic File Selection
- Minimal configuration
- Simple callback handling
- Display file information

### Image Selection
- Image-specific file filtering
- Live preview display
- MIME type validation

### Custom Configuration
- Custom metadata passing
- Advanced callback features
- Console logging

### Reusable Instance
- Performance optimization
- Single instance reuse
- Multiple selections tracking

## How It Works

1. Each demo creates an `ElFinderPicker` instance
2. The picker opens a modal with an iframe to `mock-elfinder.html`
3. When a file is selected in the mock interface, it sends a postMessage
4. The picker receives the message and calls your callback with the file data
5. The demo displays the file information

## Customization

You can modify any of the demos to test different configurations. Each TypeScript file is independent and clearly documented.

To use with a real elFinder installation, change the `MOCK_ELFINDER_URL` constant to your actual elFinder URL.
