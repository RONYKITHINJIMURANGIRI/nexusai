import { modelOptions } from '../constants/models';

const modelStore = {
  selectedModel: modelOptions[0]?.id || 'gpt-4o',
  setModel(model) {
    this.selectedModel = model;
  },
};

export default modelStore;