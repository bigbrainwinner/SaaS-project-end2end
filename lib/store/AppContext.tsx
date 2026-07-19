'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Order, Settings, BrandVoicePreset, OrderStatus } from '../../types';
import { mockUser, mockOrders, mockBrandVoicePresets } from '../../data/mockData';
import { toSentenceCase } from '../utils';

interface AppContextType {
  user: User;
  orders: Order[];
  brandVoicePresets: BrandVoicePreset[];
  settings: Settings;
  isLoading: boolean;
  addOrder: (orderData: {
    title: string;
    contentType: string;
    wordCount: number;
    deadline: string;
    targetAudience: string;
    toneVoice: string;
    keywords: string[];
    referenceLinks: string[];
    additionalNotes: string;
    attachments: File[];
  }) => Order;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  addBrandVoicePreset: (preset: Omit<BrandVoicePreset, 'id'>) => void;
  deleteBrandVoicePreset: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [brandVoicePresets, setBrandVoicePresets] = useState<BrandVoicePreset[]>([]);
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      emailOnStatusChange: true,
      emailOnCompletion: true,
      weeklyDigest: false
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('saas_user');
      const storedOrders = localStorage.getItem('saas_orders');
      const storedPresets = localStorage.getItem('saas_presets');
      const storedSettings = localStorage.getItem('saas_settings');

      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(mockUser);

      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders(mockOrders);
        localStorage.setItem('saas_orders', JSON.stringify(mockOrders));
      }

      if (storedPresets) {
        setBrandVoicePresets(JSON.parse(storedPresets));
      } else {
        setBrandVoicePresets(mockBrandVoicePresets);
        localStorage.setItem('saas_presets', JSON.stringify(mockBrandVoicePresets));
      }

      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch (e) {
      console.error('Error loading local state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync helpers
  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('saas_orders', JSON.stringify(newOrders));
  };

  const saveUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('saas_user', JSON.stringify(newUser));
  };

  const savePresets = (newPresets: BrandVoicePreset[]) => {
    setBrandVoicePresets(newPresets);
    localStorage.setItem('saas_presets', JSON.stringify(newPresets));
  };

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('saas_settings', JSON.stringify(newSettings));
  };

  const addOrder = (orderData: {
    title: string;
    contentType: string;
    wordCount: number;
    deadline: string;
    targetAudience: string;
    toneVoice: string;
    keywords: string[];
    referenceLinks: string[];
    additionalNotes: string;
    attachments: File[];
  }) => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: user.id,
      title: toSentenceCase(orderData.title),
      contentType: orderData.contentType,
      status: 'Draft',
      deadline: new Date(orderData.deadline).toISOString(),
      wordCount: Number(orderData.wordCount),
      targetAudience: orderData.targetAudience,
      toneVoice: orderData.toneVoice,
      keywords: orderData.keywords,
      referenceLinks: orderData.referenceLinks,
      additionalNotes: orderData.additionalNotes,
      createdAt: new Date().toISOString(),
      attachments: orderData.attachments.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        fileName: file.name,
        filePath: URL.createObjectURL(file), // Local blob URI
        fileSize: file.size,
        createdAt: new Date().toISOString()
      }))
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    const updated = orders.map(o => {
      if (o.id === id) {
        const title = updates.title !== undefined ? toSentenceCase(updates.title) : o.title;
        return { ...o, ...updates, title };
      }
      return o;
    });
    saveOrders(updated);
  };

  const deleteOrder = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    saveOrders(updated);
  };

  const updateProfile = (updates: Partial<User>) => {
    const updated = { ...user, ...updates };
    saveUser(updated);
  };

  const updateSettings = (updates: Partial<Settings>) => {
    const updated = { ...settings, ...updates };
    saveSettings(updated);
  };

  const addBrandVoicePreset = (preset: Omit<BrandVoicePreset, 'id'>) => {
    const newPreset: BrandVoicePreset = {
      id: `bvp-${Date.now()}`,
      ...preset
    };
    const updated = [...brandVoicePresets, newPreset];
    savePresets(updated);
  };

  const deleteBrandVoicePreset = (id: string) => {
    const updated = brandVoicePresets.filter(p => p.id !== id);
    savePresets(updated);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        orders,
        brandVoicePresets,
        settings,
        isLoading,
        addOrder,
        updateOrder,
        deleteOrder,
        updateProfile,
        updateSettings,
        addBrandVoicePreset,
        deleteBrandVoicePreset
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
