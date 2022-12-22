import matchSorter from 'match-sorter';

export const filterList = (list, searchQuery, keys = null, options = null) =>
  matchSorter(list, searchQuery, {
    keys,
    ...options,
  });
