import Sign from './Sign';

interface Props {
  title?: string;
}

const ComingSoon: React.FC<Props> = ({ title }) => {
  return (
    <main className="w-full h-full flex flex-col justify-center items-center px-3xl">
      {title && <h3 className="text-center max-w-[300px] mb-m">{title}</h3>}
      <Sign />
    </main>
  );
};

export default ComingSoon;
