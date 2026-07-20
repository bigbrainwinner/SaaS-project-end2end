'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { User, Order, Settings, BrandVoicePreset, OrderStatus, NotificationItem } from '../../types';
import { mockUser, mockOrders, mockBrandVoicePresets } from '../../data/mockData';
import { toSentenceCase } from '../utils';
import { isSupabaseConfigured } from '../supabase/config';
import { createBrowserSupabaseClient } from '../supabase/browser';
import { createOrderAction, updateProfileAction } from '../actions/orders';

interface AppContextType {
  user: User;
  orders: Order[];
  brandVoicePresets: BrandVoicePreset[];
  settings: Settings;
  isLoading: boolean;
  notifications: NotificationItem[];
  setNotifications: (notifications: NotificationItem[]) => void;
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
  }) => Promise<Order>;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => void;
  addBrandVoicePreset: (preset: Omit<BrandVoicePreset, 'id'>) => void;
  deleteBrandVoicePreset: (id: string) => void;
}

const sanitizeAvatarUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.includes('unsplash.com') || url.includes('data:image/svg+xml')) {
    return '';
  }
  return url;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    id: '',
    email: '',
    name: '',
    company: '',
    avatarUrl: ''
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [brandVoicePresets, setBrandVoicePresets] = useState<BrandVoicePreset[]>([]);
  const [notifications, setNotificationsState] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      emailOnStatusChange: true,
      emailOnCompletion: true,
      weeklyDigest: false
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Reset state helper
  const resetState = useCallback(() => {
    setUser({
      id: '',
      email: '',
      name: '',
      company: '',
      avatarUrl: ''
    });
    setOrders([]);
    setBrandVoicePresets([]);
    setNotificationsState([]);
  }, []);

  // Main data loader helper
  const loadData = useCallback(async (userId?: string, forceLoading = false) => {
    const startTime = Date.now();
    if (forceLoading || orders.length === 0) {
      setIsLoading(true);
    }

    const enforceMinDelay = async () => {
      const elapsed = Date.now() - startTime;
      const minDuration = 800; // 800ms minimum loading duration for a smooth experience
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createBrowserSupabaseClient();
        if (supabase) {
          const activeUserId = userId || (await supabase.auth.getUser()).data.user?.id;
          if (activeUserId) {
            // 1. Fetch Profile, Orders, and Auth details in parallel
            const [profileRes, ordersRes, authUserRes] = await Promise.all([
              supabase
                .from('profiles')
                .select('*')
                .eq('id', activeUserId)
                .single(),
              supabase
                .from('orders')
                .select('*, attachments(*)')
                .order('created_at', { ascending: false }),
              supabase.auth.getUser()
            ]);

            const profileData = profileRes.data;
            const dbOrders = ordersRes.data;
            const authUser = authUserRes.data.user;

            let name = '';
            let company = '';
            let email = '';
            let avatarUrl = '';

            if (profileData) {
              name = profileData.name || authUser?.user_metadata?.name || 'User';
              company = profileData.company || authUser?.user_metadata?.company || 'My Company';
              email = profileData.email;
              avatarUrl = sanitizeAvatarUrl(profileData.avatar_url || authUser?.user_metadata?.avatar_url || avatarUrl);
            } else if (authUser) {
              name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User';
              company = authUser.user_metadata?.company || 'My Company';
              email = authUser.email || '';
              avatarUrl = sanitizeAvatarUrl(authUser.user_metadata?.avatar_url || avatarUrl);
            }

            setUser({
              id: activeUserId,
              email,
              name,
              company,
              avatarUrl
            });

            if (dbOrders) {
              const mapped: Order[] = dbOrders.map((o: any) => ({
                id: o.id,
                userId: o.user_id,
                title: o.title,
                contentType: o.content_type,
                status: o.status as OrderStatus,
                deadline: o.deadline,
                wordCount: o.word_count,
                targetAudience: o.target_audience,
                toneVoice: o.tone_voice,
                keywords: o.keywords || [],
                referenceLinks: o.reference_links || [],
                additionalNotes: o.additional_notes || '',
                createdAt: o.created_at,
                attachments: (o.attachments || []).map((att: any) => ({
                  id: att.id,
                  fileName: att.file_name,
                  filePath: att.file_path,
                  fileSize: att.file_size,
                  createdAt: att.created_at
                }))
              }));
              setOrders(mapped);
            } else {
              setOrders([]);
            }

            // Load mock presets & notifications (scoped to activeUserId)
            const storedPresets = localStorage.getItem(`saas_presets_${activeUserId}`);
            if (storedPresets) {
              setBrandVoicePresets(JSON.parse(storedPresets));
            } else {
              setBrandVoicePresets(mockBrandVoicePresets);
              localStorage.setItem(`saas_presets_${activeUserId}`, JSON.stringify(mockBrandVoicePresets));
            }

            const storedNotifications = localStorage.getItem(`saas_notifications_${activeUserId}`);
            if (storedNotifications) {
              setNotificationsState(JSON.parse(storedNotifications));
            } else {
              setNotificationsState([]);
            }

            const storedSettings = localStorage.getItem(`saas_settings_${activeUserId}`);
            if (storedSettings) {
              setSettings(JSON.parse(storedSettings));
            }
          } else {
            resetState();
          }
        }
      } catch (err) {
        console.error('Error loading Supabase content:', err);
        resetState();
      } finally {
        await enforceMinDelay();
        setIsLoading(false);
      }
      return;
    }

    // Local Mock Load Fallback
    try {
      const storedUser = localStorage.getItem('saas_user');
      const activeUserId = storedUser ? JSON.parse(storedUser).id : 'usr-1';

      const storedUserObj = localStorage.getItem('saas_user');
      const storedOrders = localStorage.getItem(`saas_orders_${activeUserId}`);
      const storedPresets = localStorage.getItem(`saas_presets_${activeUserId}`);
      const storedNotifications = localStorage.getItem(`saas_notifications_${activeUserId}`);
      const storedSettings = localStorage.getItem(`saas_settings_${activeUserId}`);

      if (storedUserObj) {
        const parsed = JSON.parse(storedUserObj);
        if (parsed) {
          parsed.avatarUrl = sanitizeAvatarUrl(parsed.avatarUrl);
        }
        setUser(parsed);
      } else {
        setUser({ ...mockUser, avatarUrl: sanitizeAvatarUrl(mockUser.avatarUrl) });
      }

      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders(mockOrders);
        localStorage.setItem(`saas_orders_${activeUserId}`, JSON.stringify(mockOrders));
      }

      if (storedPresets) {
        setBrandVoicePresets(JSON.parse(storedPresets));
      } else {
        setBrandVoicePresets(mockBrandVoicePresets);
        localStorage.setItem(`saas_presets_${activeUserId}`, JSON.stringify(mockBrandVoicePresets));
      }

      if (storedNotifications) {
        setNotificationsState(JSON.parse(storedNotifications));
      } else {
        setNotificationsState([]);
      }

      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch (e) {
      console.error('Error loading local state:', e);
    } finally {
      await enforceMinDelay();
      setIsLoading(false);
    }
  }, [orders.length, resetState]);

  // Load from Supabase or localStorage on mount
  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;

    if (isSupabaseConfigured()) {
      const supabase = createBrowserSupabaseClient();
      if (supabase) {
        // Handle auth status changes dynamically
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            loadData(session?.user?.id, false);
          } else if (event === 'SIGNED_OUT') {
            resetState();
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
              window.location.href = '/auth/login';
            }
          }
        });
        authSubscription = subscription;
      }
    }

    const timer = setTimeout(() => {
      loadData(undefined, true);
    }, 0);

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      clearTimeout(timer);
    };
  }, [loadData, resetState]);

  // Listen to protected route changes when context states are missing user data
  useEffect(() => {
    const isProtectedRoute = pathname.startsWith('/dashboard') || 
                            pathname.startsWith('/orders') || 
                            pathname.startsWith('/notifications') || 
                            pathname.startsWith('/settings');
    
    if (isProtectedRoute && !user.id && !isLoading) {
      const timer = setTimeout(() => {
        loadData(undefined, true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, user.id, isLoading, loadData]);

  // Sync helpers
  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    if (user.id) {
      localStorage.setItem(`saas_orders_${user.id}`, JSON.stringify(newOrders));
    }
  };

  const saveUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('saas_user', JSON.stringify(newUser));
  };

  const savePresets = (newPresets: BrandVoicePreset[]) => {
    setBrandVoicePresets(newPresets);
    if (user.id) {
      localStorage.setItem(`saas_presets_${user.id}`, JSON.stringify(newPresets));
    }
  };

  const setNotifications = (newNotifications: NotificationItem[]) => {
    setNotificationsState(newNotifications);
    if (user.id) {
      localStorage.setItem(`saas_notifications_${user.id}`, JSON.stringify(newNotifications));
    }
  };

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    if (user.id) {
      localStorage.setItem(`saas_settings_${user.id}`, JSON.stringify(newSettings));
    }
  };

  const addOrder = async (orderData: {
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
    if (isSupabaseConfigured()) {
      const formData = new FormData();
      formData.append('title', toSentenceCase(orderData.title));
      formData.append('contentType', orderData.contentType);
      formData.append('wordCount', String(orderData.wordCount));
      formData.append('deadline', new Date(orderData.deadline).toISOString());
      formData.append('targetAudience', orderData.targetAudience);
      formData.append('toneVoice', orderData.toneVoice);
      formData.append('keywords', JSON.stringify(orderData.keywords));
      formData.append('referenceLinks', JSON.stringify(orderData.referenceLinks));
      formData.append('additionalNotes', orderData.additionalNotes);

      orderData.attachments.forEach((file) => {
        formData.append('files', file);
      });

      const res = await createOrderAction(formData);
      if (!res.success) {
        throw new Error(res.error || 'Failed to create order in Supabase');
      }

      // Re-fetch all orders to keep context unified
      const supabase = createBrowserSupabaseClient();
      if (supabase) {
        const { data: dbOrders } = await supabase
          .from('orders')
          .select('*, attachments(*)')
          .order('created_at', { ascending: false });

        if (dbOrders) {
          const mapped: Order[] = dbOrders.map((o: any) => ({
            id: o.id,
            userId: o.user_id,
            title: o.title,
            contentType: o.content_type,
            status: o.status as OrderStatus,
            deadline: o.deadline,
            wordCount: o.word_count,
            targetAudience: o.target_audience,
            toneVoice: o.tone_voice,
            keywords: o.keywords || [],
            referenceLinks: o.reference_links || [],
            additionalNotes: o.additional_notes || '',
            createdAt: o.created_at,
            attachments: (o.attachments || []).map((att: any) => ({
              id: att.id,
              fileName: att.file_name,
              filePath: att.file_path,
              fileSize: att.file_size,
              createdAt: att.created_at
            }))
          }));
          setOrders(mapped);
          
          // Return fresh created order
          const created = mapped.find(o => o.title === toSentenceCase(orderData.title)) || mapped[0];
          return created;
        }
      }
    }

    // Fallback Mock creation logic
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

  const updateProfile = async (updates: Partial<User>) => {
    if (isSupabaseConfigured()) {
      const res = await updateProfileAction({
        name: updates.name !== undefined ? updates.name : user.name,
        company: updates.company !== undefined ? updates.company : user.company,
        avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : user.avatarUrl
      });
      if (!res.success) {
        throw new Error(res.error || 'Failed to update profile in database');
      }
    }

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
        notifications,
        setNotifications,
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
