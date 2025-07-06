'use client';

import { useState, useEffect, useCallback } from 'react';
import { sections as allSectionsData, type Section } from '@/app/page'; // Import sections and Section type

const LOCALSTORAGE_KEY = 'dashboardSectionVisibility';

export interface SectionVisibility {
  [key: string]: boolean;
}

export interface DashboardSectionConfig extends Section {
  isVisible: boolean;
}

// Helper function to get settings from localStorage
const getStoredSettings = (): SectionVisibility | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const storedValue = localStorage.getItem(LOCALSTORAGE_KEY);
  if (storedValue) {
    try {
      return JSON.parse(storedValue) as SectionVisibility;
    } catch (error) {
      console.error("Error parsing dashboardSectionVisibility from localStorage:", error);
      return null;
    }
  }
  return null;
};

export const useDashboardSettings = () => {
  const [visibilitySettings, setVisibilitySettings] = useState<SectionVisibility | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setVisibilitySettings(getStoredSettings());
    setIsLoading(false);
  }, []);

  const setSectionVisibility = useCallback((sectionKey: string, isVisible: boolean) => {
    setVisibilitySettings(prevSettings => {
      const newSettings = { ...prevSettings, [sectionKey]: isVisible };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(newSettings));
      }
      return newSettings;
    });
  }, []);

  const configuredSections: DashboardSectionConfig[] = allSectionsData.map(section => ({
    ...section,
    isVisible: isLoading ? true : (visibilitySettings?.[section.key] ?? true), // Default to true if not set or while loading
  }));

  return {
    configuredSections,
    setSectionVisibility,
    isLoadingSettings: isLoading,
    // Function to get raw visibility setting for a specific key, might be useful
    isSectionVisible: (sectionKey: string): boolean => {
      if (isLoading) return true; // Assume visible while loading to prevent UI flicker
      return visibilitySettings?.[sectionKey] ?? true;
    }
  };
};
