This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and node@22.11.0.

## Getting Started

First time you open this repo, install dependencies:

```bash
npm install
# or
yarn install
```

Then you can run the development server anytime you need:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000/](http://localhost:3000/) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Scaffolding

There are two main folders at the root of the project used to store components, services, and all your logic and stuff: `/common` and `/modules`.

The `/common` folder is used for components and functionality shared across the entire application, while the `/modules` folder is for components specific to a particular module. The scaffolding inside the `/common` folder is similar to that inside a single module folder.

### Common Folder Structure

Inside common folder, there are only sub-folders, no files. Each sub-folder contains a set of related files. The following is the structure of the `/common` folder:

- **/components**: Common components used across multiple modules. Subfolders can be created to organize components, such as `/Inputs`, `/tinyComponents`, `/ModalsChildren`, etc.
- **/services**: Global reusable service files.
- **/utils**: Stateless reusable functions. Each file can contain multiple functions, or a folder can contain multiple files for more complex functionality. If implementing a library of functionalities, it should go in the `/libraries` folder instead of `utils`.
- **/libraries**: each library should have its own folder with multiple files, and the folder should be named after the library. Libraries implement complex functionalities that can be used across multiple modules or used globally.
- **/hooks**: Reusable custom hooks. Complex hooks that include multiple files can be organized into subfolders.
- **/constants**: Global constants or those used multiple times within the application. Files and folders can be created for related sets of constants. Global type files can be separated into a `types` subfolder.
- **/styles**: Global styles for the application. These are non-modular files applied to the entire application and imported in the [\_app.tsx](./pages/_app.tsx) file.
- **/context**: Files related to the global context of the application, including global state hooks used within the context.

You can create new folders on the `/common` folder to organize your code. The structure is flexible and can be adapted to your needs. Just remember to use this folder for shared components and functionality across the entire application or multiple modules, don't put module-specific code here.

### Modules and Pages

Files added to the `/pages` folder are automatically mapped to new routes. Each file in `/pages` should correspond to a module in the `/modules` folder. Files in `/pages` should not include business logic; they should only call the view from the module.

Modules separate business logic from view logic, organizing the code in a more maintainable way. Use `npm run cast <module-name> -- --module` to create a new module scaffold and its corresponding page.

### Modules Folder Structure

Modules implement MVC architecture using React Higher-Order Components (HOC). Each module has a folder with the following structure:

- **index.ts**: Exports the view component to be used in the page.
- **types.ts**: Includes the types used in the module. A `/types` folder can be created for organizing complex types.
- **services.ts**: Includes the services used in the module. A `/services` folder can be created for organizing multiple service files.
- **ModuleView.tsx**: Implements the module's view as a functional component that receives props from the controller and returns JSX.
- **withModuleController.tsx**: Implements the module's controller as a functional HOC that receives props from the page and returns the view component with the props.
- **/components**: Includes the components used in the module. Subfolders can be created to organize components.
- **/views**: If the module includes multiple sub-views or panels, they can be organized in this folder instead of placing everything in the `ModuleView.tsx` file or the components folder. Each view can have a simple component structure or be like a sub-module with its own view, controller, and other files if needed, such as types or components.

### Services and API Routes

Use the `/services` folder for service-related files and global constants. Services should fetch from API routes, and API routes should interact with backend endpoints. All API routes are in the `/pages/api` folder, with each file mapped to an API route endpoint.

### Tooling and Configurations
- **ESLint and Prettier**: Used to maintain clean and consistently formatted code. Run `npm run lint` to see errors and warnings in your code.
- **Type Checking**: Run `npm run check` to execute ESLint and validate TypeScript errors throughout the project, or `npm run type-check` to only run TypeScript validation.
- **Tailwind CSS**: Used for styling aligned with our design system in Figma.

## Custom Scripts to Generate Code (npm run cast)

This repo includes custom npm scripts to help you create pages, components, services and modules. Use the following commands to generate new code template structures quickly.

#### 1. Create a New Component

To generate a new component, use the following command:

```bash
npm run cast <ComponentName> [<directory>]
```

- Components names should be in **PascalCase**.

This will create a new component in the `/common/components` folder. If you want to create a component inside a different folder, you can pass the folder name as a second argument.

For example, if you want to create a component called `Button` inside the `/common/components` folder, you can simply run `npm run cast Button`.

This will create this simple scaffolding:

```bash
common/components
└───Button
		│   index.ts
		│   Button.tsx
```

If you want to create a component called `GoogleButton` inside a different folder, for example, `/modules/auth/login/components` folder, you can run `npm run cast GoogleButton modules/auth/login/components`.

#### 2. Create a New Module

To create a complete module (including multiple components or services), use this command:

```bash
npm run cast <ModuleName> [<page-route>] -- --module
```

- Modules names should be in **PascalCase**.
- The --module flag specifies that you're creating a full module, not just a page or component.

This command will create a simple module scaffold in the `/modules` folder and a page file in the `/pages` folder importing the module.

For example, if you want to create a component called `Login`, you can run `npm run cast Login -- --module`. This command will create the following scaffolding:

```bash
modules
└───Login
		│   index.ts
		│   LoginView.tsx
		│   withLoginController.tsx
		│   types.ts
		│   services.ts
		└───components
		└───views
		└───hooks
pages
		│   login.tsx
```

If you want to create a page with a different route, you can pass the route as a second argument. For example, if you want to create a module called `Login` with a page route `/auth/login`, you can run `npm run cast Login auth/login -- --module`.

#### 3. Create a New Page

To generate a new empty page in your project, run:

```bash
npm run cast <page-route> -- --page
```

- The page-route should be in **kebab-case**.
- The --page flag specifies that you're creating a new page.

For example, if you want to create a page called `AboutApp` with the route `/menu/about-app`, you can simply run `npm run cast menu/about-app -- --page`.

#### 4. Create a New Service

To create a service, you can use the following command:

```bash
npm run cast <ServiceName> -- --service
```

- Services names can be in **PascalCase**, **camelCase** or **kebab-case**.

This will create a new service in the `/common/services` folder with the specific name you provided. The name must not include the word "Services", as it will be appended automatically.

For example, if you want to create a service called `EmailServices`, you can simply run `npm run cast email -- --service`.

This will create the file `/common/services/EmailService.js` with the following basic CRUD methods for you to edit them:

```javascript
import request from '.';

const EmailServices = {
  get: (id) => request(`/email/${id}`),
  create: (payload) =>
    request(`/email`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/email/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id) => request(`/email/${id}`, { method: 'DELETE' }),
};

export default EmailServices;
```

### Docs

You can find docs on each library and hook on it's own README.md file if needed. If you create a new library or hook, remember to add a README.md or JavaDoc comments to document it.
