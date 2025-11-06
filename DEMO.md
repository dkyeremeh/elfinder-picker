# Demo Setup Complete!

The elFinder Picker demo has been created with TypeScript and Vite.

## Quick Start

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev

# Visit http://localhost:3000/demo/
```

## What's Included

### 4 Separate Demo Pages

1. **Basic File Selection** ([/demo/basic.html](http://localhost:3000/demo/basic.html))
   - Simple file picker with minimal configuration
   - Shows basic callback handling
   - Displays file information

2. **Image Selection** ([/demo/image.html](http://localhost:3000/demo/image.html))
   - Image-specific filtering
   - Live preview of selected images
   - MIME type validation

3. **Custom Configuration** ([/demo/custom.html](http://localhost:3000/demo/custom.html))
   - Advanced usage with metadata
   - Custom callbacks
   - Console logging

4. **Reusable Instance** ([/demo/reusable.html](http://localhost:3000/demo/reusable.html))
   - Performance optimization
   - Single instance reused multiple times
   - Selection tracking

### Demo Gallery

Visit [/demo/](http://localhost:3000/demo/) to see all demos with descriptions and links.

## Structure

```
demo/
├── index.html              # Gallery landing page
├── basic.html             # Each demo in separate file
├── image.html
├── custom.html
├── reusable.html
├── mock-elfinder.html     # Mock elFinder interface
├── scripts/               # TypeScript modules
│   ├── basic.ts
│   ├── image.ts
│   ├── custom.ts
│   └── reusable.ts
└── styles/
    └── demo.css          # Shared styles
```

## Features

- ✅ TypeScript with full type checking
- ✅ Vite for fast dev experience and HMR
- ✅ Each demo is independent and self-contained
- ✅ Mock elFinder interface for testing (no backend needed)
- ✅ Responsive design
- ✅ Clean, modern UI
- ✅ Well-documented code

## Testing

The demo includes a mock elFinder interface with sample files (images, documents, videos, etc.). When you click on any file in the mock interface, it simulates the real elFinder behavior by sending file data via postMessage.

## Next Steps

To use with a real elFinder installation:
1. Deploy your elFinder instance
2. Update the `MOCK_ELFINDER_URL` constant in each script to point to your elFinder URL
3. Configure elFinder with the `filePickerCallback` from the library

Enjoy testing! 🎉
