// Simple component tagger plugin for Vite
// Adds component name comments to React files during development

export function componentTagger() {
  return {
    name: 'component-tagger',
    transform(code, id) {
      // Only process React component files
      if (!/\.(jsx|tsx)$/.test(id)) {
        return null;
      }

      // Add data attributes to help identify components in the DOM
      const componentName = id.split('/').pop().replace(/\.(jsx|tsx)$/, '');
      
      // Simple transformation to add data-component attribute to JSX elements
      // This is a basic implementation and may need refinement
      let modified = code;
      
      // Add component name as a comment at the top of the file
      modified = `// Component: ${componentName}\n${modified}`;
      
      return {
        code: modified,
        map: null // We're not modifying the source map
      };
    }
  };
}