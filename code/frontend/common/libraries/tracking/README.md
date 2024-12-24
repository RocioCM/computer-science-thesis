# Tracking library

This library is a simple way to track events in your app. It is a custom hook that provides a function to track events and screens. It is designed to be simple to use and to provide a lot of metadata to the metrics backend.

By default, it's configured to track screens and click events globally in the app (check [AppWrapper](/common/components/AppWrapper/AppWrapper.tsx)). This means that you don't have to worry about setting up the tracking in every component.

In case you need to track an specific event, you can use the hook in the components you want to track and the library will do the rest. But you may ask how the hell this library works. I'll try to explain it in simple terms.

You don't have to worry about the complex implementation of the library, we tried to do its usage as simple as possible and as not-frequent as possible.

There are 2 kinds of tracks we track in the app:

- Screen loaded: this track is dispatched whenever a user enters a screen.
- Event: this track is dispatched whenever the user does the action you want to track. For example, if you track a button's onClick event, then the track will be dispatched every time the user clicks/taps that button. By default, all clicks on the app are tracked.

### Development

Tracking is disabled in development mode by default to avoid sending test data to the metrics backend. If you want to enable it during integration, you can do it by setting the variable `TRACKING_DISABLED` to `false` in the [services](./services.ts) file.

Don't forget to set it back to `true` after you finish testing.

## How to use

This library provides an easy-to-use custom hook which will provide you all you need to configure all your tracking events in the code.

```js
import useTracking from 'utils/tracking';
```

useTracking hook does not require any parameters. It will return a function that you can use to track events.

WARNING: DON'T pass a truthy first param to the hook, as it will re-init global tracking and will cause duplicated tracking events which mess up the real metrics.

```jsx
const HomePage = () => {
  const track = useTracking();

  return <div>Hello World!</div>;
};
```

### Event track

useTracking returns a function that can be used to track events. The convention is to name this function `track`. It can be used to track interactions, for example, clicking a button:

```jsx
const HomePage = () => {
  const track = useTracking();

  return (
    <div>
      <button onClick={track('button-click')}>Click me!</button>
    </div>
  );
};
```

The track sent to backend has a lot of metadata, this is an example of a track:

```json
{
  "application": "Greenly Points",
  "trackType": "event",
  "deviceInfo": "1400x820",
  "eventData": {
    "id": "",
    "innerText": "Canjear cupón",
    "nodeName": "BUTTON",
    "pageX": 822,
    "pageY": 217
  },
  "path": "greenly/home/click",
  "platform": "web-Windows",
  "timeStamp": "2023-07-26T14:16:27.366Z",
  "userId": 1,
  "trackingId": "ac50925d-9183-42e6-8973-c0e6b0735a9b",
  "userToken": "2acc5c94-621b-475a-88b6-7b3c456874f7"
}
```

That example was pretty simple, as the button didn't have any custom handler. But what happens when the element you want to track already has a handler? For example:

```jsx
<button onClick={handleClick}>Click me!</button>
```

In these cases, you can pass the previous handler to the track function as second parameter. This ensures the track event is sent **and** the handler is invoked.

```jsx
<button onClick={track('button-click', handleClick)}>Click me!</button>
```

#### Custom params

You can send extra tracking information about the event to backend. This extra information can have any JSON format you want and is sent in the `eventData` attribute of the payload sent to backend.

```json
"eventData": { ... },
```

This information can be sent as third and fourth parameters of the `track` function. For more information about its use, you can read the docs in the [code of the library](./utils.ts).

There are 4 different possible use cases to build eventData:

If you can set the eventData for the track during render time, you should send custom params as third parameter of the track function. In this case, the third parameter must be an object and it will be sent as is as eventData.

```jsx
<button
  onClick={track('button-click', handleClick, { username: 'myUsername' })}
>
  Click me!
</button>
```

This will send the following eventData in the track:

```json
"eventData": { "username": "myUsername" }
```

If you need to set the eventData for the track during the execution of the handler, you should send custom params as fourth parameter of the track function. In this case, the shape of the fourth parameter determines the shape of the eventData.

This is useful when you need to send information that is not available during render time, for example, the value of an input.

You can configure this behaviour in some different ways, depending on your needs:

1. Send a `string` as fourth parameter of the track function. When the handler is invoked, the arguments of the handler will be sent as eventData with the key name of the string. For example:

```jsx
<button onClick={track('button-click', handleClick, {}, 'customName')}>
  Click me!
</button>
```

Let's suppose that handleClick is invoked with the following arguments: `handleClick({ username: "myUsername" })`. This will send the following eventData in the track:

```json
"eventData": { "customName": { "username": "myUsername" } }
```

2. Send an `array` as fourth parameter of the track function. This array is used to map some properties from the function arguments to event data. Each element of the array may be an string or a 2-elements-array. When the handler is invoked, the arguments of the handler will be sent as eventData with the key names of the array. For example:

```jsx
<button onClick={track('button-click', handleClick, {}, ['username', 'age'])}>
  Click me!
</button>
```

Let's suppose that handleClick is invoked with the following arguments: `handleClick({ username: "myUsername", age: 18, email: "test@lila.com" })`. This will send the following eventData in the track:

```json
"eventData": { "username": "myUsername", "age": 18 }
```

Note that the `email` property is not sent in the eventData, as it is not included in the array.

In case you send an array of 2-elements-arrays, the first element of each subarray is used as the key name in the eventData, and the second element is used as the key name in the function arguments. For example:

```jsx
<button
  onClick={track('button-click', handleClick, {}, [
    ['username', 'name'],
    'age',
  ])}
>
  Click me!
</button>
```

Let's suppose that handleClick is invoked with the following arguments: `handleClick({ name: "myUsername", age: 18, email: "test@lila.com" })`. This will send the following eventData in the track:

```json
"eventData": { "name": "myUsername", "age": 18 }
```

Note that the property "username" is renamed to "name" in the eventData because of the array configuration, but the "age" property is sent as is.

### Hook Caveats

Invoking the hook with arguments will re-init the global tracking and will cause duplicated tracking events which mess up the real metrics. So, don't pass any arguments to the hook.

Just call it without arguments, like this:

```jsx
const Button = () => {
  const track = useTracking();

  return <button onClick={track('button-click')}>Click me!</button>;
};
```

The global tracking is already set up in the [AppWrapper](/common/components/AppWrapper/AppWrapper.tsx) component, so you don't need to worry about it.

## How to configure the repo

To get this library working, you need to follow these steps:

1. Import the folder [common/libraries/tracking](./) into your project.
2. Install the library `uuid` using npm: `npm install uuid`.
3. Set the correct value for all the variables in the file [constants.js](./constants.js). The values of these variables are the name of your app, the keyname of your app that will appear in the metrics backoffice and the url of the metrics API.

That's it, you should be ready to go!
