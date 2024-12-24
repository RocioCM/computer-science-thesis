interface ReactNativeWebView {
  postMessage: (_message: string) => void;
}

declare global {
  interface Window {
    ReactNativeWebView?: ReactNativeWebView;
  }
}

export interface MessageEvent {
  data: string;
}

export interface Message {
  type: string;
  payload?: any;
}
