import { useEffect, useRef, useState } from 'react';
import useInfiniteScroll from '@/common/hooks/useInfiniteScroll';
import cn from '@/common/utils/classNames';
import FaIcon from '@/common/components/FaIcon';
import LoadingSpinner from '@/common/components/LoadingSpinner';
import useFirstRender from '@/common/hooks/useFirstRender';

const DEFAULT_LIMIT = 10;

interface Column {
  name: string;
  title: string;
  formatter?: (value: any) => React.ReactNode;
}

type DataType = Record<string, any>;

export interface Props {
  columns: Column[];
  className?: string;
  limit?: number;
  shouldRefresh?: boolean;
  handleRefreshComplete?: () => void;
  title?: string;
  handleFetch: (page: number, limit: number) => Promise<DataType[]>;
}

function Table({
  columns,
  handleFetch,
  title,
  className,
  limit = DEFAULT_LIMIT,
  shouldRefresh,
  handleRefreshComplete = () => {},
}: Props) {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(1);
  const reachedEnd = useRef(false); // To prevent multiple fetches when the user reaches the end of the table.
  const firstRender = useFirstRender();

  const fetchData = async () => {
    if (reachedEnd.current) return; // Prevent multiple fetches when the user reaches the end of the table.

    setLoading(true);

    const page = pageRef.current; // Get the current page from the ref
    const newData = await handleFetch(page, limit);
    page === 1 // First page
      ? setData(newData)
      : data?.length
      ? setData((prevData) => [...prevData, ...newData])
      : setData([]);

    if (newData?.length < limit) reachedEnd.current = true;

    // Update the page to load the next page in future requests
    pageRef.current = page + 1; // Increment the page for the next fetch
    setLoading(false);
  };

  const bottomRef = useInfiniteScroll(fetchData, [
    pageRef.current,
    firstRender,
  ]);

  // Reset the table to its initial state and fetch the first page.
  const handleFullRefresh = async () => {
    reachedEnd.current = false;
    setData([]);
    if (pageRef.current === 1) {
      await fetchData(); // Manually re-fetch the first page if we are already on it.
    } else {
      pageRef.current = 1; // Reset the page to 1
      // The next fetch will be triggered by the observer due to the re-render of setData and page value change-
    }
    handleRefreshComplete();
  };

  useEffect(() => {
    if (shouldRefresh) {
      handleFullRefresh();
    }
  }, [shouldRefresh]);

  if (firstRender) return null;

  return (
    <div
      data-testid="table"
      className={cn('w-full h-full overflow-auto', className)}
    >
      <table className="w-full relative h-fit">
        <thead className="sticky top-0 z-10 bg-n0 rounded-lg text-left">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn('h6 p-s bg-p3 text-n0 last:text-center')}
              >
                <span className="font-medium">{column.title}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="bg-n0 border border-n2">
              {columns.map((column) => (
                <td key={column.name} className="p p-s">
                  {column.formatter ? column.formatter(row) : row[column.name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot
          ref={bottomRef as React.RefObject<HTMLTableSectionElement>}
          className="h-full"
        >
          <tr className="h-full">
            <td
              colSpan={columns.length}
              className="px-4 py-2 h-full text-center"
            >
              {loading && (
                <LoadingSpinner size="1.7rem" className="mx-auto mt-8" />
              )}
              {data.length === 0 && !loading && (
                <div className="w-full mt-[5rem]">
                  <FaIcon
                    type="fa-solid fa-boxes-stacked"
                    className="text-6xl mb-2 text-p3"
                  />
                  <h5 className="text-center text-lowercase first-letter:uppercase">
                    No se encontraron {title} <br />
                    ¡Crea el primero!
                  </h5>
                </div>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Table;
