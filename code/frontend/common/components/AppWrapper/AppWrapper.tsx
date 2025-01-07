
interface Props {
  children: React.ReactNode;
}

/** This component is a wrapper for the entire application.
 * Init any global hooks or global logic here.
 * You can access AppContext here.
 */
const AppWrapper: React.FC<Props> = ({ children }) => {
  return children;
};

export default AppWrapper;
