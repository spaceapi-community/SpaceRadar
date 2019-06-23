import { persistCombineReducers } from 'redux-persist'
import { reducer as spaces } from './spaces';
import FSStorage from 'redux-persist-expo-fs-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const persistConfig = {
  key: 'root',
  storage: FSStorage(),
  stateReconciler: autoMergeLevel2,
};

export default persistCombineReducers(persistConfig, {
  spaces,
});
