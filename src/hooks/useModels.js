import { useState } from 'react';
import { modelOptions } from '../constants/models';

function useModels() {
  const modelIds = modelOptions.map(model => model.id);
  const [selectedModel, setSelectedModel] = useState(modelIds[0]);

  return {
    availableModels: modelIds,
    selectedModel,
    setSelectedModel,
  };
}

export default useModels;