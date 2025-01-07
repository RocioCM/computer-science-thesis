# HOOK: useForm()

This hook is used to manage form state and validation. It provides a way to define a form structure and to handle form changes, validation errors and a tool to generate form inputs JSX easily.

The hook automates the process of managing form state and validation, so you can focus on building your form logic and UI. For example:

- errors: the hook will automatically run validations on your inputs and show error messages when needed.
- progress: the hook will automatically track the progress of your form (0-100%) and disable the submit button when the form is not ready to be submitted.
- values: the hook will automatically update the form values when the user interacts with the inputs.
- submit: the hook will automatically know when the form is ready to be submitted and enable or disable the submit button.

## USAGE: Docs for devs using useForms

To use the useForm hook, you have to import it from the `@/hooks/useForm` module and call it with the form structure you want to manage. The hook will return an object with the form values and some helper functions to handle the form state.

```javascript
import { useForm } from '@/hooks/useForm';

const FORM_STRUCT = [
  { name: 'username', default: 'John' },
  { name: 'email', default: '' },
];

const INPUTS_LIST = [
  { name: 'username', type: 'text', label: 'Username' },
  { name: 'email', type: 'email', label: 'Email' },
];

const Component = (props) => {
  const { form, formBuilder } = useForm(FORM_STRUCT);

  return <form>{formBuilder(INPUTS_LIST)}</form>;
};
```

To work with useForm, you have to get used to build your form structure and form inputs using the `useForm` hook.

The form structure usually specifies form fields names, default values and information related to validations, This information is static and cannot be changed across renders.

The form inputs can be built in two different ways:

- Manually: you can build your form inputs manually, using the form values and the handleChange function provided by the useForm hook.
- Automatically: you can use the `formBuilder` function provided by the useForm hook to generate the JSX of the form inputs based on the list of inputs you provide. This list must include input names, types and all the additional props you want to pass to the input components. formBuilder automatically handles the form values and the handleChange function for you.

In the following sections, we will explain how to define the form structure and how to build your form inputs using the useForm hook. Let's see how to do it.

### Form structure

To use useForm hook to manage your forms, first of all you need to "describe" the shape of your form. The hook will use this information to build your initial form structure and then run validations on your inputs while the user interacts with them.

The form structure must be an array of objects, where each object represents a field in the form. Each field object should have the following mandatory properties:

- `name`: the name of the field.

So, for example, a simple form with two fields, `username` and `email`, could be defined as follows:

```javascript
const FORM_STRUCT = [{ name: 'username' }, { name: 'email' }];
```

This will create the form with those two fields and no validation rules. The initial form created will have the following shape:

```javascript
{
	username: null,
	email: null,
}
```

If you want to add default values to the fields, you can do it by adding a `default` property to the field object. If you don't specify a default value, the field will be initialized with `null`.

```javascript
const FORM_STRUCT = [
  { name: 'username', default: 'John' },
  { name: 'email', default: '' },
];
```

And the initial form will be:

```javascript
{
	username: 'John',
	email: '',
}
```

#### Nested forms

That example was quite simple, but what if you have a more complex form with nested fields? Let's imagine you need to describe the following form:

```javascript
const form = {
  username: 'John',
  email: '',
  address: {
    street: 'Main St.',
    number: 123,
  },
};
```

You can define nested fields by adding a `structure` property to a field's object. There are some different types of nested fields you can define, let's start with the `object` type.

##### object

You can define nested fields by adding a `structure` property to a field's object. Inside the `structure` field, you should use `object` util to specify you want a nested object field and pass an array of field objects that represent the nested fields. Just like the bigger form, nested forms follow the same rules:

```javascript
import { object } from '@/hooks/useForm';
const FORM_STRUCT = [
  { name: 'username', default: 'John' },
  { name: 'email', default: '' },
  {
    name: 'address',
    structure: object([
      { name: 'street', default: 'Main St.' },
      { name: 'number', default: 123 },
    ]),
  },
];
```

There are three types of nested fields you can define using the `structure` property of a form field:

- `object`: a nested object field.
- `arrayOf`: a nested array field. It may be an array of objects or an array of primitives.
- `mapOf`: a nested object field where the keys are dynamic and all fields have the same structure.

Let's see the other two types of nested fields.

##### arrayOf

How can you define an array of ids or an array of elements in a form? You can do it similarly to the nested object example, but using the `arrayOf` util:

Let's suppose you want to describe this form:

```javascript
const form = {
  username: 'John',
  email: 'john@mail.com',
  permissions: ['read', 'write'],
};
```

You may just define a field with a default value of an empty array:

```javascript
const FORM_STRUCT = [
  { name: 'username', default: 'John' },
  { name: 'email', default: '' },
  { name: 'permissions', default: [] },
];

// This will create a form with the following shape:
const form = {
  username: 'John',
  email: '',
  permissions: [],
};
```

It will work, but you won't have any validation on the `permissions` field. We haven't explained validations yet, but if you want to add validations to your array field, you can use the `arrayOf` util to specify the type of the array elements.

You can describe arrays of primitives using the `arrayOf` util plus one of primitive types:

```javascript
import { arrayOf, TYPES } from '@/hooks/useForm';

const FORM_STRUCT = [
  { name: 'username', default: '' },
  { name: 'email', default: '' },
  {
    name: 'permissions',
    structure: arrayOf(TYPES.string),
  },
];
```

To see all available types, check the `TYPES` object in the [constants file](./constants.js). This definition will support only strings in the `permissions` array.

But let's go further: what if you want to define an array of objects? Let's say you want to represent this form:

```javascript
{
  username: 'John',
  email: 'john@mail.com',
  addresses: [
    { street: 'Main St.', number: 123 },
    { street: 'Other St.', number: 1000 },
  ],
}
```

You can do it similarly to the nested object example, but using the `arrayOf` util. You have to specify all the fields that each element of the array will have:

```javascript
import { arrayOf } from '@/hooks/useForm';

const FORM_STRUCT = [
  { name: 'username', default: '' },
  { name: 'email', default: '' },
  {
    name: 'addresses',
    structure: arrayOf([{ name: 'street' }, { name: 'number' }]),
  },
];

// The initial form will be:
const form = {
  username: 'John',
  email: '',
  addresses: [],
};
```

Array fields are always initialized with an empty array by default. If you need a different default array in the initial form, you can get it by adding a `default` property to the field with the array you want as default value. For example:

```javascript
const FORM_STRUCT = [
  { name: 'username', default: '' },
  { name: 'email', default: '' },
  {
    name: 'addresses',
    structure: arrayOf([{ name: 'street' }, { name: 'number' }]),
    default: [{ street: 'Main St.', number: 123 }],
  },
];
```

##### mapOf

Let's suppose you have a form where the keys are dynamic and all fields have the same structure. For example:

```javascript
const usersByIdObject = {
  1: { name: 'John', email: '' },
  2: { name: 'Jane', email: '' },
  3: { name: 'Doe', email: '' },
};
```

You can declare simply declare it as a field with an empty object as initial value:

```javascript
const FORM_STRUCT = [
  {
    name: 'users',
    default: {},
  },
];
```

But what if you want to add validations to the `users` field? You cannot use the `object` util because you don't know the keys of the object, they are dynamic. But you know all the values have the same structure, just like in an array. Then you can use the `mapOf` util to define the structure of the nested fields, similarly to the `arrayOf` util. You can define fields of primitive types or objects. Let's see the `users` example using the `mapOf` util:

```javascript
import { mapOf } from '@/hooks/useForm';

const FORM_STRUCT = [
  {
    name: 'users',
    structure: mapOf([{ name: 'name' }, { name: 'email' }]),
  },
];

// The initial form will be:
const form = {
  users: {},
};
```

Map fields are always initialized with an empty object by default. If you need a different default object in the initial form, you can get it by adding a `default` property to the field with the object you want as default value. For example:

```javascript
const FORM_STRUCT = [
  {
    name: 'users',
    structure: mapOf([{ name: 'name' }, { name: 'email' }]),
    default: {
      1: { name: 'John', email: '' },
      2: { name: 'Jane', email: '' },
    },
  },
];
```

#### Validations

useForm hook can be configured to automatically run validations on your form fields and show error messages in your inputs when needed.

This hook supports automatic progress tracking and submit button disabling. When you call the hook, you can get these two variables:

- `progress`: a number that represents the completeness of required fields of the form (0-100%).
- `submitEnabled`: a boolean that indicates if the form is ready to be submitted.

```javascript
const { form, progress, submitEnabled } = useForm(FORM_STRUCT);

return (
	<form>
		<ProgressBar progress={progress}>
		...
		<Button disabled={!submitEnabled}>
			Submit
		</Button>
	</form>
);
```

The `submitEnabled` variable will be `true` when the form is ready to be submitted. There are three conditions that must be met for the form to be ready to be submitted:

1. All required fields must have a value.
2. All fields must pass their validations (the form must not have any errors).
3. The user must have interacted with the form (form must have changes).

The hook will automatically track the progress of your form (0-100%) and disable the submit button when the form is not ready to be submitted.

You can add validations to your form fields by combining some properties. Each field in your form may have some of these properties along with the `name` and `default` properties:

- `required`: a boolean or a function that returns a boolean that indicates if the field is required.
- `disabled`: a boolean or a function that returns a boolean that indicates if the field is disabled.
- `validators`: an array of functions that validate the field value.

Let's see an example of a form with validations:

```javascript
import { validators } from '@/hooks/useForm';

const FORM_STRUCT = [
  {
    name: 'username',
    defaulxt: '',
    required: false,
  },
  {
    name: 'email',
    default: '',
    required: true,
    validators: [validators.isEmail],
  },
];
```

In this example, the `username` field is not required and has no validations. The `email` field is required and has a validation that checks if the value is a valid email.

##### required

The `required` property can be a boolean or a function that returns a boolean. If it's a function, it will receive the form values as an argument. This way, you can define dynamic validations based on the form values. For example, you may want to disable a field based on the value of another field. You can do it by defining a function that receives the form values and returns a boolean.

```javascript
const FORM_STRUCT = [
  {
    name: 'username',
    default: '',
    required: true,
  },
  {
    name: 'email',
    default: '',
    required: (form) => form.username === 'admin',
    validators: [validators.isEmail],
  },
];
```

When a field is required, it will count as filled if its value is any value different from `null`, `undefined`, empty string or `[]`. If you need to check your field is different from some other value, you can achieve it using `validators` instead.

If you don't specify the `required` property, the field will be considered optional.

##### disabled

The `disabled` property can be a boolean or a function that returns a boolean. If it's a function, it will receive the form values as an argument. This way, you can define dynamic validations based on the form values. For example, you may want to disable a field based on the value of another field. You can do it by defining a function that receives the form values and returns a boolean.

```javascript
const FORM_STRUCT = [
  {
    name: 'userType',
    default: 'admin',
    disabled: true,
  },
  {
    name: 'email',
    default: '',
    disabled: (form) => form.userType === 'admin',
    required: true,
    validators: [validators.isEmail],
  },
];
```

When a field is disabled, it will not count as required and it will not be validated, even if it has validators and required properties, those will be bypassed.

If you don't specify the `disabled` property, the field will be considered enabled.

##### validators

The `validators` property must contain a single validator function or an array of functions that validate the field value. Each function should return an error message if the value is not valid. If the value is valid, the function should return an empty string.

All the validators of the project are on the [validators file](./validators.js), you can check their implementation and add your own validators there if ypu need. Let's see an example:

```javascript
const INITIAL_FORM_STRUCTURE = [
  {
    name: 'username',
    required: true,
    default: '',
    validators: [validators.minLength(4), validators.maxLength(20)],
  },
  {
    name: 'email',
    required: true,
    default: '',
    validators: validators.isEmail,
  },
];
```

In this example, the `username` field is required and has two validators: one that checks if the value has a minimum length of 4 characters and another that checks if the value has a maximum length of 20 characters. The `email` field is required and has a validator that checks if the value is a valid email.

If a field has validators, the hook will automatically run them when the user interacts with the field and automatically show error messages in the input when needed. When a field has an error message, the `submitEnabled` variable will be `false` and the `progress` variable will be less than 100%, to indicate that the form is not ready to be submitted.

### Form builder

After defining the form structure, you can use the `formBuilder` function to build your form. The useForm hook will return an object with the form values and some helper functions to handle the form state. One of these functions is the `formBuilder` function, which is used to generate the JSX of the form inputs you need, based on the form structure you defined and the current form values. To use it, you have to provide an array of objects that represent the fields you want to render.

```javascript
const { form, formBuilder } = useForm(FORM_STRUCT);

return <form>{formBuilder(INPUTS_LIST)}</form>;
```

The `formBuilder` function will generate the JSX of the form inputs based on the `INPUTS_LIST` you provide. The `INPUTS_LIST` is an array of objects that represent the fields you want to render. Each object should have the following properties:

- `name`: the name of the field.
- `type`: the type of the input (e.g. text, email, password, etc). Look the formBuilder implementation to see available types.
- ...props: any other props you want to pass to the input component.

```javascript
const INPUTS_LIST = [
  {
    name: 'username',
    type: 'text',
    label: 'Username',
    className: 'customInput',
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'john@mail.com',
    label: 'Email',
  },
];

const FORM_STRUCT = [
  { name: 'username', default: '' },
  { name: 'email', default: '' },
];

const { form, formBuilder } = useForm(FORM_STRUCT);

return <form>{formBuilder(INPUTS_LIST)}</form>;
```

#### Nested fields

formBuilder supports accessing nested fields. In case you want to access a nested field, just specify the field name with dot notation. For example, if you have a nested field `address` with a nested field `street`, you can access it like this:

```javascript
const INPUTS_LIST = [
  {
    name: 'username',
    type: 'text',
    label: 'Username',
  },
  {
    name: 'address.street',
    type: 'text',
    label: 'Street',
  },
];
```

The `formBuilder` function will automatically handle the nested fields for you. You don't need to worry about it.

If all the inputs from your list belong to the same nested form, you can use the `prefix` option to avoid repeating the same prefix for all the inputs. For example:

```javascript
const INPUTS_LIST = [
  {
    name: 'street',
    type: 'text',
    label: 'Street',
  },
  {
    name: 'number',
    type: 'number',
    label: 'Number',
  },
];

const { form, formBuilder } = useForm(FORM_STRUCT);

return <form>{formBuilder(INPUTS_LIST, { prefix: 'address' })}</form>;
```

This will generate a form that will look something like this:

```javascript
<form>
  <input type="text" name="address.street" value={form.address.street} />
  <input type="number" name="address.number" value={form.address.number} />
</form>
```

### Manually building form inputs

If you don't want to use the `formBuilder` function to generate the JSX of the form inputs or it's not suitable for your needs, you can build your inputs manually using the form values and the `handleChange` function provided by the useForm hook, as you would do with a regular form. The hook also exposes getFieldErrorMessage to get the error message of a field. Let's see an example:

```javascript
const { form, handleChange, getFieldErrorMessage } = useForm(FORM_STRUCT);

return (
  <form>
    <input
      type="text"
      name="username"
      value={form.username}
      onChange={(e) => handleChange(e.target.name, e.target.value)}
    />
    <span>{getFieldErrorMessage('username')}</span>
    <input
      type="email"
      name="email"
      value={form.email}
      onChange={(e) => handleChange(e.target.name, e.target.value)}
    />
    <span>{getFieldErrorMessage('email')}</span>
  </form>
);
```

#### List of useForm stateful utils

The useForm hook returns some utility functions and variables that you can use to build your form inputs or complex form bussiness logic. These functions are:

- `form`: an object with the form values.
- `errors`: an object with the form errors.
- `errorsCount`: a number that represents the number of fields with errors.
- `progress`: a number that represents the completeness of required fields of the form (0-100%).
- `hasChanges`: a boolean that indicates if the form has changes to save.
- `submitEnabled`: a boolean that indicates if the form is ready to be submitted.
- `handleChange`: a function that handles the form changes. It receives the field name and the field value as arguments. It may receive a boolean as a third argument to indicate if the change should be recorded as a user interaction in the hasChanges variable.
- `handleMultipleChange`: a function that handles multiple form changes. It receives an object with the field names and values as arguments. It may receive a boolean as a third argument to indicate if the change should be recorded as a user interaction in the hasChanges variable.
- `getFieldErrorMessage`: a function that receives a field name and returns the error message of the field.
- `getDefaultForm`: a function that returns the default initial form based on FORM_STRUCT.
- `formBuilder`: a function that generates the JSX of the form inputs based on the list of inputs you provide.
- `resetForm`: a function that resets the form to its initial state.
- `setDangerousForm`: a function that sets the form values directly. This function is dangerous because it bypasses validations. Use with caution.
- `setInitialForm`: a function that sets the form values to the initial state. This function is safe and will not bypass validations. It reset's the hasChanges variable to false.

Go to each function's inline docs to get more information about how to use them.

## DEVELOP: Docs for devs editing useForm hook

/// TODO: this section docs are pending.

### What is a "fieldData" object?

A "fieldData" object is an object that contains all the data related to a field in a form. It represents the static logic layer of a form field and it includes the following properties (some or all of them):

- `name`: the name of the field
- `required`: a boolean that indicates if the field is required
- `disabled`: a boolean that indicates if the field is disabled
- `default`: the default value of the field
- `validators`: an array of functions that validate the field value
- `parser`: a function that parses the field value
- `structure`: for nested fields, it's an object that contains the structure of the field (e.g. list of fields of the nested object).

```

```

```

```
