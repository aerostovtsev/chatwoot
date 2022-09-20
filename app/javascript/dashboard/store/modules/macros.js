import * as MutationHelpers from 'shared/helpers/vuex/mutationHelpers';
import types from '../mutation-types';
import MacrosAPI from '../../api/macros';

export const state = {
  records: [],
  uiFlags: {
    isFetching: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
  },
};

export const getters = {
  getMacros(_state) {
    return _state.records;
  },
  getUIFlags(_state) {
    return _state.uiFlags;
  },
};

export const actions = {
  get: async function getMacros({ commit }) {
    commit(types.SET_MACROS_UI_FLAG, { isFetching: true });
    try {
      const response = await MacrosAPI.get();
      commit(types.SET_MACROS, response.data.payload);
    } catch (error) {
      // Ignore error
    } finally {
      commit(types.SET_MACROS_UI_FLAG, { isFetching: false });
    }
  },
  create: async function createMacro({ commit }, macrosObj) {
    commit(types.SET_MACROS_UI_FLAG, { isCreating: true });
    try {
      const response = await MacrosAPI.create(macrosObj);
      commit(types.ADD_MACRO, response.data);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_MACROS_UI_FLAG, { isCreating: false });
    }
  },
  update: async ({ commit }, { id, ...updateObj }) => {
    commit(types.SET_MACROS_UI_FLAG, { isUpdating: true });
    try {
      const response = await MacrosAPI.update(id, updateObj);
      commit(types.EDIT_MACRO, response.data.payload);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_MACROS_UI_FLAG, { isUpdating: false });
    }
  },
  delete: async ({ commit }, id) => {
    commit(types.SET_MACROS_UI_FLAG, { isDeleting: true });
    try {
      await MacrosAPI.delete(id);
      commit(types.DELETE_MACRO, id);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_MACROS_UI_FLAG, { isDeleting: false });
    }
  },
  clone: async ({ commit }, id) => {
    commit(types.SET_MACROS_UI_FLAG, { isCloning: true });
    try {
      await MacrosAPI.clone(id);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_MACROS_UI_FLAG, { isCloning: false });
    }
  },
  uploadAttachment: async (_, file) => {
    try {
      const { data } = await MacrosAPI.attachment(file);
      return data.blob_id;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export const mutations = {
  [types.SET_MACROS_UI_FLAG](_state, data) {
    _state.uiFlags = {
      ..._state.uiFlags,
      ...data,
    };
  },
  [types.ADD_MACRO]: MutationHelpers.create,
  [types.SET_MACROS]: MutationHelpers.set,
  [types.EDIT_MACRO]: MutationHelpers.update,
  [types.DELETE_MACRO]: MutationHelpers.destroy,
};

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations,
};