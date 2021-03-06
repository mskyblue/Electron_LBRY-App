import * as types from "constants/action_types";
import lbryuri from "lbryuri";

const reducers = {};
const defaultState = {};

reducers[types.FILE_LIST_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    isFetchingFileList: true,
  });
};

reducers[types.FILE_LIST_SUCCEEDED] = function(state, action) {
  const { fileInfos } = action.data;
  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const pendingByOutpoint = Object.assign({}, state.pendingByOutpoint);

  fileInfos.forEach(fileInfo => {
    const { outpoint } = fileInfo;

    if (outpoint) newByOutpoint[fileInfo.outpoint] = fileInfo;
  });

  return Object.assign({}, state, {
    isFetchingFileList: false,
    byOutpoint: newByOutpoint,
    pendingByOutpoint,
  });
};

reducers[types.FETCH_FILE_INFO_STARTED] = function(state, action) {
  const { outpoint } = action.data;
  const newFetching = Object.assign({}, state.fetching);

  newFetching[outpoint] = true;

  return Object.assign({}, state, {
    fetching: newFetching,
  });
};

reducers[types.FETCH_FILE_INFO_COMPLETED] = function(state, action) {
  const { fileInfo, outpoint } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newFetching = Object.assign({}, state.fetching);

  newByOutpoint[outpoint] = fileInfo;
  delete newFetching[outpoint];

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
    fetching: newFetching,
  });
};

reducers[types.DOWNLOADING_STARTED] = function(state, action) {
  const { uri, outpoint, fileInfo } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newDownloading = Object.assign({}, state.downloadingByOutpoint);
  const newLoading = Object.assign({}, state.urisLoading);

  newDownloading[outpoint] = true;
  newByOutpoint[outpoint] = fileInfo;
  delete newLoading[uri];

  return Object.assign({}, state, {
    downloadingByOutpoint: newDownloading,
    urisLoading: newLoading,
    byOutpoint: newByOutpoint,
  });
};

reducers[types.DOWNLOADING_PROGRESSED] = function(state, action) {
  const { uri, outpoint, fileInfo } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newDownloading = Object.assign({}, state.downloadingByOutpoint);

  newByOutpoint[outpoint] = fileInfo;
  newDownloading[outpoint] = true;

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
    downloadingByOutpoint: newDownloading,
  });
};

reducers[types.DOWNLOADING_COMPLETED] = function(state, action) {
  const { uri, outpoint, fileInfo } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const newDownloading = Object.assign({}, state.downloadingByOutpoint);

  newByOutpoint[outpoint] = fileInfo;
  delete newDownloading[outpoint];

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
    downloadingByOutpoint: newDownloading,
  });
};

reducers[types.FILE_DELETE] = function(state, action) {
  const { outpoint } = action.data;

  const newByOutpoint = Object.assign({}, state.byOutpoint);
  const downloadingByOutpoint = Object.assign({}, state.downloadingByOutpoint);

  delete newByOutpoint[outpoint];
  delete downloadingByOutpoint[outpoint];

  return Object.assign({}, state, {
    byOutpoint: newByOutpoint,
    downloadingByOutpoint,
  });
};

reducers[types.LOADING_VIDEO_STARTED] = function(state, action) {
  const { uri } = action.data;

  const newLoading = Object.assign({}, state.urisLoading);

  newLoading[uri] = true;

  return Object.assign({}, state, {
    urisLoading: newLoading,
  });
};

reducers[types.LOADING_VIDEO_FAILED] = function(state, action) {
  const { uri } = action.data;

  const newLoading = Object.assign({}, state.urisLoading);

  delete newLoading[uri];

  return Object.assign({}, state, {
    urisLoading: newLoading,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
