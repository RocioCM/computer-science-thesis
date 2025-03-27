import { useEffect, useMemo, useState } from 'react';
import Input, { InputProps } from '../Input';
import cn from '@/common/utils/classNames';
import FaIcon from '../../FaIcon';
import { autoUpdate, useFloating } from '@floating-ui/react-dom';
import { FloatingPortal } from '@floating-ui/react';
import useClickOutside from '@/common/hooks/useClickOutside';
import useDebouncedState from '@/common/hooks/useDebouncedState';

export interface Option {
  label: string;
  value: string;
}

interface Props extends InputProps {
  handleSearch: (query: string) => Promise<Option[]>;
}

const InputAutocomplete: React.FC<Props> = ({
  handleSearch,
  inputClassName,
  value,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useDebouncedState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  });

  const handleSearchInput = async (_name: string, query: string) => {
    setSearchQuery(query);
    if (value) props.handleChange(props.name, '');
  };

  const handleRefreshSearch = async (query: string) => {
    setLoading(true);

    if (query) {
      const options = await handleSearch(query);
      setOptions(options);
      setShowOptions(true);
    }

    setLoading(false);
  };

  const handleSelect = (value: string) => {
    props.handleChange(props.name, value);
  };

  useEffect(() => {
    if (searchQuery) {
      handleRefreshSearch(searchQuery);
    } else {
      setShowOptions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (value) {
      setSearchQuery('');
      setShowOptions(false);
    }
  }, [value]);

  const selectedOption = useMemo(() => {
    return (
      options.find((option) => option.value === value) || {
        label: '',
        value: '',
      }
    );
  }, [options, value]);

  const optionsRef: { current: any } = useClickOutside(() => {
    setShowOptions(false);
  });
  optionsRef.current = refs.floating.current;

  return (
    <>
      <Input
        {...props}
        type="text"
        inputRef={refs.setReference as any}
        value={selectedOption.label || undefined}
        handleChange={handleSearchInput}
        inputClassName={cn('pr-8', inputClassName)}
        childrenEnd={
          loading ? (
            <FaIcon type="fa-solid fa-spinner mr-3" className="animate-spin" />
          ) : value ? (
            <FaIcon type="fa-solid fa-check mr-3" className="text-p1" />
          ) : (
            <FaIcon type="fa-solid fa-search mr-3" />
          )
        }
      />

      {showOptions && (
        <FloatingPortal>
          <div
            className="z-dropdown w-max rounded-md bg-white shadow-lg max-h-60 overflow-auto"
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              width: (refs.reference.current as HTMLElement)?.clientWidth,
            }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className="cursor-pointer select-none relative p-2 text-n6"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default InputAutocomplete;
