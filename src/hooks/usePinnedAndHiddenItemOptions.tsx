/* eslint-disable @typescript-eslint/no-empty-function */
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { union, without } from 'lodash';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const PINNED_HIDDEN_STORAGE_KEY = 'PINNED_BALANCES_STORAGE_KEY';

export enum PinnedHiddenSectionOption {
  BALANCES = 'BALANCES',
  PREPAID_CARDS = 'PREPAID_CARDS',
}

const PinnedHiddenItemOptionContext = createContext({
  editing: undefined as undefined | PinnedHiddenSectionOption,
  toggle: (_key: PinnedHiddenSectionOption) => {},
  pinned: [] as unknown[],
  hidden: [] as unknown[],
  selected: [] as string[],
  pin: () => {},
  unpin: () => {},
  hide: () => {},
  show: () => {},
  select: (_key: string) => {},
  deselect: (_key: string) => {},
});

interface Value {
  pinned: unknown[];
  hidden: unknown[];
  selected: string[];
}

export const usePinnedAndHiddenItemOptions = () =>
  useContext(PinnedHiddenItemOptionContext);

export const PinnedHiddenItemOptionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { getItem, setItem } = useAsyncStorage(PINNED_HIDDEN_STORAGE_KEY);

  const [ready, setReady] = useState<boolean>(false);
  const [editing, setEditing] = useState<
    PinnedHiddenSectionOption | undefined
  >();
  const [value, setValue] = useState<Value>({
    pinned: [],
    hidden: [],
    selected: [],
  });

  const toggle = (type: PinnedHiddenSectionOption) => {
    if (type === editing) {
      setEditing(undefined);
    } else {
      setEditing(type);
    }
  };

  const select = async (key: string) => {
    const stored = {
      pinned: value.pinned,
      hidden: value.hidden,
      selected: union(value.selected, [key]),
    };

    setValue(stored);
  };

  const deselect = async (key: string) => {
    const stored = {
      pinned: value.pinned,
      hidden: value.hidden,
      selected: without(value.selected, key),
    };

    setValue(stored);
  };

  const pin = async () => {
    const stored = {
      selected: [],
      hidden: value.hidden,
      pinned: union(value.pinned, value.selected),
    };

    await setItem(JSON.stringify(stored));

    setValue(stored);
  };

  const unpin = async () => {
    const stored = {
      selected: [],
      hidden: value.hidden,
      pinned: without(value.pinned, ...value.selected),
    };

    await setItem(JSON.stringify(stored));

    setValue(stored);
  };

  const hide = async () => {
    const stored = {
      selected: [],
      pinned: value.pinned,
      hidden: union(value.hidden, value.selected),
    };

    await setItem(JSON.stringify(stored));

    setValue(stored);
  };

  const show = async () => {
    const stored = {
      selected: [],
      pinned: value.pinned,
      hidden: without(value.hidden, ...value.selected),
    };

    await setItem(JSON.stringify(stored));

    setValue(stored);
  };

  useEffect(() => {
    getItem((_err, result) => {
      if (result) {
        const { pinned = [], hidden = [] } = JSON.parse(result);
        setValue({ pinned, hidden, selected: [] });
      } else {
        setValue({ pinned: [], hidden: [], selected: [] });
      }

      setReady(true);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { selected, pinned, hidden } = value;

  return (
    <PinnedHiddenItemOptionContext.Provider
      value={{
        pinned,
        hidden,
        selected,
        editing,
        toggle,
        select,
        deselect,
        pin,
        unpin,
        hide,
        show,
      }}
    >
      {ready ? children : null}
    </PinnedHiddenItemOptionContext.Provider>
  );
};
