#!/bin/bash

# Copy the logo to public directory with different sizes
PUBLIC_DIR="public"

# Create opengraph image (1200x630) - use the logo image
cp public/kilalo-logo.png "$PUBLIC_DIR/opengraph-image.png"

# Create favicon (32x32) - use the logo image
cp public/kilalo-logo.png "$PUBLIC_DIR/favicon.png"

# Create Apple touch icon (180x180) - use the logo image
cp public/kilalo-logo.png "$PUBLIC_DIR/apple-touch-icon.png"

echo "✅ Static brand assets copied successfully!"
