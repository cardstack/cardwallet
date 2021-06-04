import { useAsyncStorage } from '@react-native-community/async-storage';
import { union, without } from 'lodash';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const PINNED_HIDDEN_STORAGE_KEY = 'PINNED_BALANCES_STORAGE_KEY';

type PinnedAndHiddenItemOptionContextType = any;

const PinnedHiddenItemOptionContext = createContext({
  editing: false,
  toggle: () => {},
  pinned: [],
  hidden: [],
  selected: [],
  pin: () => {},
  unpin: () => {},
  hide: () => {},
  show: () => {},
  select: (_key: string) => {},
  deselect: (_key: string) => {},
});

export const usePinnedAndHiddenItemOptions = (): PinnedAndHiddenItemOptionContextType =>
  useContext(PinnedHiddenItemOptionContext);

export enum PinnedHiddenSectionOption {
  BALANCES = 'BALANCES',
  PREPAID_CARDS = 'PREPAID_CARDS',
}

export const PinnedHiddenItemOptionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { getItem, setItem } = useAsyncStorage(PINNED_HIDDEN_STORAGE_KEY);

  const [ready, setReady] = useState<boolean>(false);
  const [editing, setEditing] = useState<PinnedHiddenSectionOption | null>();
  const [value, setValue] = useState<any>({
    pinned: [],
    hidden: [],
    selected: [],
  });

  const toggle = (type: PinnedHiddenSectionOption) => {
    if (type === editing) {
      setEditing(null);
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
