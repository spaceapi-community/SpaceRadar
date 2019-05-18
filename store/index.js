import { persistCombineReducers } from 'redux-persist'
import { reducer as spaces } from './spaces';
import ExpoFileSystemStorage from "redux-persist-expo-filesystem"
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const persistConfig = {
  key: 'root',
  storage: ExpoFileSystemStorage,
  stateReconciler: autoMergeLevel2,
};

export default persistCombineReducers(persistConfig, {
  spaces,
});
