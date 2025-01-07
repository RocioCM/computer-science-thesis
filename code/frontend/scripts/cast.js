/* eslint-disable no-console */
const fs = require('fs');

const DEFAULT_COMPONENTS_DIRECTORY = 'common/components';
const DEFAULT_SERVICES_DIRECTORY = 'common/services';

main();

function main() {
  // Get the command line arguments
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

  // Get the command line flags
  const flags = process.argv.slice(2).filter((arg) => arg.startsWith('--'));

  // Name is always required.
  if (args.length < 1) {
    console.error('Usage: npm run cast <componentName> [<directory>]');
    process.exit(1);
  }

  if (flags.includes('--module')) {
    createModuleScaffold(args);
  } else if (flags.includes('--page')) {
    createPageScaffold(args);
  } else if (flags.includes('--service')) {
    createServiceScaffold(args);
  } else {
    createComponentScaffold(args);
  }
}

// ----------------------------------------- //
// -------------- Functions ---------------- //
// ----------------------------------------- //

/**
 * Creates a file with the given filename and content.
 * @param {string} filename - The filename to create.
 * @param {string} content - The content to write to the file.
 */
function createFile(filename, content) {
  // Create the directories recursively if they don't exist yet.
  const directory = filename.split('/').slice(0, -1).join('/');
  createDirectoryRecursively(directory);

  // Check if the file already exists
  if (fs.existsSync(filename)) {
    console.warn(`WARN: File ${filename} already exists. Skipping...`);
    return;
  }

  // Write the file
  fs.writeFile(filename, content, (err) => {
    if (err) {
      console.error(`ERROR writing ${filename} file:`, err);
      return;
    }
    console.log(`File ${filename} has been created.`);
  });
}

/** Creates the directories recursively if they don't exist yet.
 * @param {string} path - The directory path to create. */
function createDirectoryRecursively(path) {
  // Create the directories recursively if they don't exist yet.
  path.split('/').reduce((parentPath, childPath, i) => {
    // Check root parent folder exists.
    if (i === 1 && !fs.existsSync(parentPath)) {
      fs.mkdirSync(parentPath);
    }

    // Create the current directory.
    const currentPath = `${parentPath}/${childPath}`;
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
    return currentPath;
  });
}

function createComponentScaffold(args) {
  const componentName = args[0];
  const directory = args[1] || DEFAULT_COMPONENTS_DIRECTORY;
  const componentPath = `${directory}/${componentName}`;

  // Build the index file:
  const indexFilename = `${componentPath}/index.ts`;
  const indexContent = `import ${componentName} from './${componentName}';\n\nexport default ${componentName};\n`;
  createFile(indexFilename, indexContent);

  // Build the JSX file:
  const jsxFilename = `${componentPath}/${componentName}.tsx`;
  const jsxContent = `interface Props {}\n\nconst ${componentName}: React.FC<Props> = () => {\n  return (\n    <div className="w-full h-full">\n      Hello World!\n    </div>\n  );\n};\n\nexport default ${componentName};\n\n`;
  createFile(jsxFilename, jsxContent);
}

function createPageScaffold(args) {
  const pageName = args[0].toLowerCase(); // Must be kebab-case
  const componentName = pageName
    .split('/')
    .pop()
    .split('-')
    .map((word) => {
      const formattedWord = word.toLowerCase().replace(/[\[\]\.]/g, '');
      return formattedWord.charAt(0).toUpperCase() + formattedWord.slice(1);
    })
    .join(''); // It's PascalCase
  const pagePath = `pages/${pageName}`;

  // Build the JSX file:
  const jsxFilename = `${pagePath}.tsx`;
  const jsxContent = `import ComingSoon from '@/common/components/ComingSoon';\n\nconst ${componentName}Page = () => {\n  return (\n    <main className="h-screen w-full">\n      <ComingSoon title="Welcome to ${componentName} Page!" />\n    </main>\n  );\n};\n\nexport default ${componentName}Page;\n\n`;
  createFile(jsxFilename, jsxContent);
}

// TODO: fix it.
function createServiceScaffold(args) {
  const cleanedEntityName = args[0].replace(/[\[\]\.\-]/g, ''); // It may be CamelCase or kebab-case
  const entityName = cleanedEntityName.toLowerCase(); // It's lowercase
  const serviceName = `${
    cleanedEntityName.charAt(0).toUpperCase() + cleanedEntityName.slice(1)
  }Services`; // It's PascalCase
  const directory = DEFAULT_SERVICES_DIRECTORY;

  // Build the JS file:
  const jsFileName = `${directory}/${serviceName}.ts`;
  const jsContent = `import request from '@/common/services/request';\n\nconst ${serviceName} = {\n  get: (id) => request(\`/${entityName}/\${id}\`),\n  create: (payload) =>\n    request(\`/${entityName}\`, { method: 'POST', body: JSON.stringify(payload) }),\n  update: (id, payload) =>\n    request(\`/${entityName}/\${id}\`, { method: 'PUT', body: JSON.stringify(payload) }),\n  delete: (id) => request(\`/${entityName}/\${id}\`, { method: 'DELETE' }),\n};\n\nexport default ${serviceName};\n`;
  createFile(jsFileName, jsContent);
}

function createModuleScaffold(args) {
  const moduleName = args[0];
  const pageRoute = args[1] || moduleName.toLowerCase();
  const directory = 'modules';
  const modulePath = `${directory}/${moduleName}`;
  const viewName = `${moduleName}View`;
  const controllerName = `with${moduleName}Controller`;

  // Build the index file:
  const indexFilename = `${modulePath}/index.ts`;
  const indexContent = `import ${viewName} from './${viewName}';\n\nexport default ${viewName};\n`;
  createFile(indexFilename, indexContent);

  // Build the View file:
  const viewFilename = `${modulePath}/${viewName}.tsx`;
  const viewContent = `import ${controllerName} from './${controllerName}';\nimport { ${viewName}Type } from './types';\nimport ComingSoon from '@/common/components/ComingSoon';\n\nconst ${viewName}: ${viewName}Type = ({ name }) => {\n  return (\n    <main className="w-full h-screen">\n      <ComingSoon title={\`Welcome to \${name} Page!\`} />\n    </main>\n  );\n};\n\nexport default ${controllerName}(${viewName});\n`;
  createFile(viewFilename, viewContent);

  // Build the Controller file:
  const controllerFilename = `${modulePath}/${controllerName}.tsx`;
  const controllerContent = `import { useState } from 'react';\nimport { ${viewName}Type, ${moduleName}ControllerProps, ${viewName}Props } from './types';\n\nconst ${controllerName} = (View: ${viewName}Type) =>\n  function Controller(props: ${moduleName}ControllerProps): JSX.Element {\n    const [name, _setName] = useState<string>('${moduleName}');\n\n    const viewProps: ${viewName}Props = {\n      name: name,\n    };\n\n    return <View {...viewProps} />;\n  };\n\nexport default ${controllerName};\n`;
  createFile(controllerFilename, controllerContent);

  // Build the types file:
  const typesFilename = `${modulePath}/types.ts`;
  const typesContent = `// -------- VIEW / CONTROLLER -------- //\n\nexport interface ${viewName}Props {\n  name: string;\n}\n\nexport type ${viewName}Type = React.FC<${viewName}Props>;\n\nexport interface ${moduleName}ControllerProps {}\n\n// ---------- SERVICES ---------- //\n\nexport interface ${moduleName} {\n  name: string;\n}\n`;
  createFile(typesFilename, typesContent);

  // Build the services file:
  const servicesFilename = `${modulePath}/services.ts`;
  const servicesContent = `import request from '@/common/services/request';\nimport { ${moduleName} } from './types';\n\nconst ${moduleName}Services = {\n  get: () => request<${moduleName}>('/${moduleName}'),\n};\n\nexport default ${moduleName}Services;\n`;
  createFile(servicesFilename, servicesContent);

  // Build the page file:
  const pageFilename = `pages/${pageRoute}.tsx`;
  const pageContent = `import ${viewName} from '@/modules/${moduleName}';\n\nconst ${moduleName}Page = () => {\n  return <${viewName} />;\n};\n\nexport default ${moduleName}Page;\n`;
  createFile(pageFilename, pageContent);

  createDirectoryRecursively(`${modulePath}/components`);
  createDirectoryRecursively(`${modulePath}/hooks`);
  createDirectoryRecursively(`${modulePath}/views`);
}
