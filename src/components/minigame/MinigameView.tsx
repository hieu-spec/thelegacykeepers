'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { HistoricalStory, StoryStage } from '@/types/story';
import { StoryHubView } from './StoryHubView';
import { StoryLevelMapView } from './StoryLevelMapView';
import { StorytellerEngine } from './StorytellerEngine';

type MinigameStep = 'hub' | 'level_map' | 'game';

export const MinigameView: React.FC = () => {
  const {
    stories,
    activePlayingStory,
    setActivePlayingStory,
  } = useApp();

  const [step, setStep] = useState<MinigameStep>('hub');
  const [selectedStage, setSelectedStage] = useState<StoryStage | null>(null);

  // Sync with activePlayingStory if changed from external (e.g. from LocationCardModal)
  useEffect(() => {
    if (activePlayingStory) {
      // Find latest updated reference of story from stories state
      const updatedStory = stories.find((s) => s.id === activePlayingStory.id) || activePlayingStory;
      if (step === 'hub') {
        setStep('level_map');
      }
    } else {
      setStep('hub');
      setSelectedStage(null);
    }
  }, [activePlayingStory, stories]);

  // Current working story
  const currentStory = activePlayingStory
    ? stories.find((s) => s.id === activePlayingStory.id) || activePlayingStory
    : null;

  // STEP 1: STORY HUB -> Select story
  const handleSelectStoryFromHub = (story: HistoricalStory) => {
    setActivePlayingStory(story);
    setStep('level_map');
  };

  // STEP 2: LEVEL MAP -> Select stage to play
  const handleSelectStageFromLevelMap = (stage: StoryStage) => {
    setSelectedStage(stage);
    setStep('game');
  };

  // STEP 2 -> Back to STEP 1
  const handleBackToHub = () => {
    setActivePlayingStory(null);
    setSelectedStage(null);
    setStep('hub');
  };

  // STEP 3 -> Back to STEP 2
  const handleBackToLevelMap = () => {
    setSelectedStage(null);
    setStep('level_map');
  };

  // STEP 3 -> Stage Completed
  const handleStageCompleted = () => {
    setSelectedStage(null);
    setStep('level_map');
  };

  // -------------------------------------------------------------
  // RENDER BASED ON CURRENT STEP
  // -------------------------------------------------------------
  if (step === 'game' && currentStory && selectedStage) {
    return (
      <StorytellerEngine
        story={currentStory}
        stage={selectedStage}
        onBack={handleBackToLevelMap}
        onStageCompleted={handleStageCompleted}
      />
    );
  }

  if (step === 'level_map' && currentStory) {
    return (
      <StoryLevelMapView
        story={currentStory}
        onBack={handleBackToHub}
        onSelectStage={handleSelectStageFromLevelMap}
      />
    );
  }

  return <StoryHubView onSelectStory={handleSelectStoryFromHub} />;
};
