import {
  getImageMetadata,
  saveImageMetadata,
} from '../handlers/localstorage/globalSettings';

// // -- Constants --------------------------------------- //
const CLEAR = 'imageMetadata/CLEAR';
const LOAD = 'imageMetadata/LOAD';
const MERGE = 'imageMetadata/MERGE';

export const clearImageMetadataCache = () => dispatch =>
  dispatch({ type: CLEAR });

export const imageMetadataCacheLoadState = () => async dispatch => {
  const metadataCache = await getImageMetadata();
  dispatch({
    payload: metadataCache,
    type: LOAD,
  });
};

export const updateImageMetadataCache = ({ id, metadata }) => (
  dispatch,
  getState
) => {
  const { imageMetadata } = getState().imageMetadata;
  dispatch({ id, metadata, type: MERGE });
  saveImageMetadata({
    ...imageMetadata,
    [id]: metadata,
  });
};

// // -- Reducer ----------------------------------------- //
const INITIAL_STATE = {
  imageMetadata: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        imageMetadata: action.payload,
      };
    case MERGE:
      return {
        ...state,
        imageMetadata: {
          ...state.imageMetadata,
          [action.id]: action.metadata,
        },
      };
    default:
      return INITIAL_STATE;
  }
};
