import { useState, useCallback } from 'react';
import { updateEnergyValue, updateMultipleValues, handleApiResponse } from './energyData';
import { updateNodesWithEnergyData } from './initial-elements';

// Custom hook for managing energy data updates
export const useEnergyData = (setNodes) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Update single energy value
  const updateSingleValue = useCallback((nodeId, newValue) => {
    const success = updateEnergyValue(nodeId, newValue);
    if (success && setNodes) {
      const updatedNodes = updateNodesWithEnergyData();
      setNodes(updatedNodes);
    }
    return success;
  }, [setNodes]);

  // Update multiple energy values
  const updateValues = useCallback((updates) => {
    const results = updateMultipleValues(updates);
    if (setNodes) {
      const updatedNodes = updateNodesWithEnergyData();
      setNodes(updatedNodes);
    }
    return results;
  }, [setNodes]);

  // Handle API response and update nodes
  const handleApiUpdate = useCallback(async (apiData) => {
    setIsUpdating(true);
    try {
      const updates = handleApiResponse(apiData);
      if (setNodes) {
        const updatedNodes = updateNodesWithEnergyData();
        setNodes(updatedNodes);
      }
      return updates;
    } catch (error) {
      console.error('Failed to update energy data:', error);
      return {};
    } finally {
      setIsUpdating(false);
    }
  }, [setNodes]);

  // Simulate API call for testing
  const simulateApiUpdate = useCallback(() => {
    const mockApiData = [
      { id: 'solar', value: Math.random() * 20 },
      { id: 'battery', value: Math.random() * 60 },
      { id: 'load', value: Math.random() * 30 },
      { id: 'grid', value: Math.random() * 25 }
    ];
    return handleApiUpdate(mockApiData);
  }, [handleApiUpdate]);

  return {
    updateSingleValue,
    updateValues,
    handleApiUpdate,
    simulateApiUpdate,
    isUpdating
  };
};