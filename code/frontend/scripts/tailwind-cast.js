const fs = require('fs');
const prettier = require('prettier');
const prettierConfig = require('../.prettierrc.json');
const baseTailwindConfig = require('../tailwind.config.ts');

/** Maps variables prefixes to tailwind extend properties. */
const MAPPING = {
  colors: 'colors',
  spacing: 'spacing',
  elevation: 'boxShadow',
  radius: 'borderRadius',
  text: 'fontSize',
};

const CUSTOM_FORMATTERS = {
  fontSize: (key) => key.split('-').shift(), // Get the first word of the variable name.
  colors: (key) => key.split('-').slice(1).join('-'), // Remove the first 2 words of the variable name (for example, 'colors-palette-p1-500' becomes 'p1-500').
  default: (key) => key.split('-').pop(), // Get the last word of the variable name.
};

const tailwindConfig = JSON.parse(JSON.stringify(baseTailwindConfig));

// Extract CSS variables
const variablesCssFile = fs.readFileSync(
  './common/styles/variables.css',
  'utf-8'
);

const cssVariables = variablesCssFile.match(/--[^:]+:\s*[^;]+/g);

// Fallback initial tailwind config
if (!tailwindConfig.theme?.extend) {
  tailwindConfig.theme = {
    ...tailwindConfig?.theme,
    extend: { ...tailwindConfig?.theme?.extend },
  };
}

cssVariables?.forEach((variable) => {
  const [name, value] = variable.split(':').map((str) => str.trim());
  const [prefix, ...variableName] = name.replace('--', '').split('-'); // Obtains the prefix (for example, 'colors' from '--colors-feedback-alert')
  const tailwindProperty = MAPPING[prefix] || prefix;

  // It will be used as the key in the tailwind config.
  const keyFormatter =
    CUSTOM_FORMATTERS[tailwindProperty] || CUSTOM_FORMATTERS.default;
  const key = keyFormatter(variableName.join('-'));
  // variableName.length > 0 ? `${variableName.map((word) => word[0]).join('')}-${lastWord}` : lastWord // Create the key from the variable name. For example, '--colors-feedback-important-alert' becomes 'fi-alert'.
  // Add the variable to the tailwind config.
  tailwindConfig.theme.extend[tailwindProperty] = {
    ...tailwindConfig.theme.extend[tailwindProperty],
    [key]: value,
  };
});

const newTailwindConfigFile = prettier.format(
  `/** @type {import('tailwindcss').Config} */
	module.exports = ${JSON.stringify(tailwindConfig, null, 2)};
  `,
  { parser: 'typescript', ...prettierConfig }
);

// Write the new tailwind config file.
fs.writeFile('tailwind.config.ts', newTailwindConfigFile, (err) => {
  if (err) {
    console.error('\x1b[31mERROR writing tailwind.config.ts file:\x1b[0m', err);
    return;
  }
  console.log('\x1b[32mFile: tailwind.config.ts updated successfully.\x1b[0m');
});
