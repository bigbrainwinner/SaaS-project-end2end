'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Bell, CreditCard, Volume2, Plus, Trash2, CheckCircle, Upload, FileText, Download, Trash } from 'lucide-react';
import { useApp } from '@/lib/store/AppContext';
import { uploadAvatarAction } from '@/lib/actions/orders';

type TabId = 'profile' | 'preferences' | 'billing' | 'voice';

export default function SettingsPage() {
  const {
    user,
    settings,
    brandVoicePresets,
    updateProfile,
    updateSettings,
    addBrandVoicePreset,
    deleteBrandVoicePreset,
    isLoading
  } = useApp();

  // Active tab state
  const [activeTab, setActiveTabState] = useState<TabId>('profile');

  // Success feedback state
  const [success, setSuccess] = useState('');

  // Load active tab from localStorage on mount
  useEffect(() => {
    const storedTab = localStorage.getItem('active_settings_tab') as TabId;
    if (storedTab && ['profile', 'preferences', 'billing', 'voice'].includes(storedTab)) {
      setActiveTabState(storedTab);
    }
  }, []);

  const setActiveTab = (tab: TabId) => {
    setActiveTabState(tab);
    localStorage.setItem('active_settings_tab', tab);
  };

  // Profile Form States
  const [profileName, setProfileName] = useState(user.name);
  const [profileCompany, setProfileCompany] = useState(user.company);

  // Sync profile fields when user loads/updates
  useEffect(() => {
    setProfileName(user.name);
    setProfileCompany(user.company);
  }, [user]);

  // Avatar Upload States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await uploadAvatarAction(formData);
      if (res.success && res.url) {
        await updateProfile({ avatarUrl: res.url });
        triggerSuccess('Profile picture updated successfully!');
      } else {
        alert(res.error || 'Failed to upload avatar');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred during avatar upload');
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (window.confirm('Are you sure you want to remove your profile picture?')) {
      setAvatarLoading(true);
      try {
        const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><rect width="24" height="24" fill="%23f3f4f6"/><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.42 0-8 2.58-8 6v2h16v-2c0-3.42-3.58-6-8-6z"/></svg>';
        await updateProfile({ avatarUrl: defaultAvatar });
        triggerSuccess('Profile picture removed.');
      } catch (err: any) {
        alert(err.message || 'An error occurred while removing avatar');
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  // New Brand Voice Preset States
  const [voiceName, setVoiceName] = useState('');
  const [voiceDescription, setVoiceDescription] = useState('');
  const [voiceTone, setVoiceTone] = useState('');
  const [voiceExampleText, setVoiceExampleText] = useState('');
  const [showAddVoice, setShowAddVoice] = useState(false);

  // Flash feedback helper
  const triggerSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: profileName, company: profileCompany });
    triggerSuccess('Profile information saved successfully!');
  };

  // Preferences Change
  const handleTogglePreference = (key: keyof typeof settings.notifications) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
    triggerSuccess('Notification preferences updated!');
  };

  // Brand Voice Add
  const handleAddVoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceName.trim() || !voiceTone.trim() || !voiceExampleText.trim()) return;

    addBrandVoicePreset({
      name: voiceName,
      description: voiceDescription,
      tone: voiceTone,
      exampleText: voiceExampleText
    });

    setVoiceName('');
    setVoiceDescription('');
    setVoiceTone('');
    setVoiceExampleText('');
    setShowAddVoice(false);
    triggerSuccess('Brand voice preset added successfully!');
  };

  // Brand Voice Delete
  const handleDeleteVoice = (id: string) => {
    deleteBrandVoicePreset(id);
    triggerSuccess('Brand voice preset deleted.');
  };

  // Left tab choices config
  const tabs = [
    { id: 'profile' as TabId, label: 'Profile Settings', icon: UserIcon },
    { id: 'preferences' as TabId, label: 'Preferences', icon: Bell },
    { id: 'billing' as TabId, label: 'Billing & Invoices', icon: CreditCard },
    { id: 'voice' as TabId, label: 'Brand Voice Presets', icon: Volume2 },
  ];



  return (
    <div className="grid gap-6 md:grid-cols-4 max-w-5xl mx-auto items-start">
      
      {/* Left Sidebar Tab Selector */}
      <div className="rounded-xl border border-neutral-100 bg-white p-2.5 shadow-sm space-y-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSuccess('');
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                active
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right Content Form Area */}
      <div className="md:col-span-3 space-y-4">
        
        {/* Success toast indicator */}
        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700 animate-fade-in shadow-sm">
            <CheckCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Cards */}
        <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm">
          
          {/* PROFILE SETTINGS TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-950">Profile Settings</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Manage your user profile credentials and business attributes.</p>
              </div>

              {/* Avatar Upload UI section */}
              <div className="flex items-center gap-5 border-y border-neutral-50 py-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="relative">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-16 w-16 rounded-full border border-neutral-100 object-cover"
                  />
                  {avatarLoading && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      disabled={avatarLoading}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-50"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload Image
                    </button>
                    {user.avatarUrl !== 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><rect width="24" height="24" fill="%23f3f4f6"/><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.42 0-8 2.58-8 6v2h16v-2c0-3.42-3.58-6-8-6z"/></svg>' && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        disabled={avatarLoading}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash className="h-3.5 w-3.5" />
                        Remove Image
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <p className="text-[9px] text-neutral-400 mt-1">Recommended size 256x256px. PNG, JPG or WEBP.</p>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-neutral-300 focus:bg-white focus:ring-2 focus:ring-neutral-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-400 cursor-not-allowed outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    value={profileCompany}
                    onChange={(e) => setProfileCompany(e.target.value)}
                    required
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-neutral-300 focus:bg-white focus:ring-2 focus:ring-neutral-100"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-50">
                <button
                  type="submit"
                  className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.98]"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-950">Preferences</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Control when and how you receive updates on order changes.</p>
              </div>

              <div className="divide-y divide-neutral-100">
                
                {/* Status Toggle */}
                <div className="flex items-center justify-between py-4.5">
                  <div className="space-y-0.5 max-w-md pr-4">
                    <h4 className="text-xs font-bold text-neutral-800">Email on Order Status Change</h4>
                    <p className="text-[10px] text-neutral-400 leading-normal">Send an email alert immediately when an order is moved between progress phases.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailOnStatusChange}
                      onChange={() => handleTogglePreference('emailOnStatusChange')}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>

                {/* Completion Toggle */}
                <div className="flex items-center justify-between py-4.5">
                  <div className="space-y-0.5 max-w-md pr-4">
                    <h4 className="text-xs font-bold text-neutral-800">Email on Order Completion</h4>
                    <p className="text-[10px] text-neutral-400 leading-normal">Send an email alert containing the final text document when writer completes it.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailOnCompletion}
                      onChange={() => handleTogglePreference('emailOnCompletion')}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>

                {/* Digest Toggle */}
                <div className="flex items-center justify-between py-4.5">
                  <div className="space-y-0.5 max-w-md pr-4">
                    <h4 className="text-xs font-bold text-neutral-800">Weekly Pipeline Digest</h4>
                    <p className="text-[10px] text-neutral-400 leading-normal">Receive a consolidated weekly report summarizing word counts, active, and completed orders.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyDigest}
                      onChange={() => handleTogglePreference('weeklyDigest')}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* BILLING & INVOICES TAB */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-950">Billing & Payment</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Manage your active payment instruments, subscription details, and invoices.</p>
              </div>

              {/* Credit Card mockup card */}
              <div className="border border-neutral-100 rounded-xl bg-neutral-50/50 p-5 space-y-4">
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Current Payment Method</h4>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    {/* Visa Icon builder */}
                    <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-black text-white text-xs font-black italic tracking-widest">
                      VISA
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-700">Visa ending in 4242</p>
                      <p className="text-[10px] text-neutral-400">Expires 12 / 2028</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Update billing method (mocked)')}
                    className="rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Edit Method
                  </button>
                </div>
              </div>

              {/* Invoice History Table */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Invoice History</h4>
                <div className="overflow-hidden border border-neutral-100 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-neutral-50 text-[9px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                      <tr>
                        <th className="p-3">Invoice</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-600">
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-neutral-400 font-medium">
                          No invoices found.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BRAND VOICE PRESETS TAB */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-950">Brand Voice Presets</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Save predefined styling templates to speed up order writing briefs.</p>
                </div>
                {!showAddVoice && (
                  <button
                    onClick={() => setShowAddVoice(true)}
                    className="inline-flex items-center gap-1 rounded-lg bg-black px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Preset
                  </button>
                )}
              </div>

              {/* Add New Preset Form overlay toggle */}
              {showAddVoice && (
                <form onSubmit={handleAddVoice} className="border border-neutral-100 bg-neutral-50/50 rounded-xl p-5 space-y-4 animate-fade-in">
                  <h4 className="text-xs font-bold text-neutral-800">Add New Preset</h4>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Preset Name</label>
                      <input
                        type="text"
                        value={voiceName}
                        onChange={(e) => setVoiceName(e.target.value)}
                        placeholder="e.g. Developer Friendly"
                        required
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-neutral-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tone & Style Summary</label>
                      <input
                        type="text"
                        value={voiceTone}
                        onChange={(e) => setVoiceTone(e.target.value)}
                        placeholder="e.g. Friendly, highly technical"
                        required
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-neutral-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description</label>
                    <input
                      type="text"
                      value={voiceDescription}
                      onChange={(e) => setVoiceDescription(e.target.value)}
                      placeholder="e.g. Use this for developer docs and technical APIs"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-neutral-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Sample Text Example</label>
                    <textarea
                      value={voiceExampleText}
                      onChange={(e) => setVoiceExampleText(e.target.value)}
                      placeholder="Add an example block showing this tone in action..."
                      rows={3}
                      required
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-neutral-300"
                    />
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-all"
                    >
                      Save Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddVoice(false)}
                      className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Presets List */}
              <div className="space-y-4">
                {brandVoicePresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="border border-neutral-100 rounded-xl bg-white p-4.5 space-y-3 relative group"
                  >
                    {/* Delete button (hidden until hover) */}
                    <button
                      onClick={() => handleDeleteVoice(preset.id)}
                      className="absolute top-4.5 right-4.5 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Preset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="space-y-1 pr-6">
                      <h4 className="text-xs font-bold text-neutral-800">{preset.name}</h4>
                      <p className="text-[10px] text-neutral-400">{preset.description}</p>
                    </div>

                    <div className="grid gap-2 border-t border-neutral-50 pt-3 text-[10px]">
                      <div>
                        <span className="font-bold text-neutral-400 uppercase tracking-wider">Style: </span>
                        <span className="text-neutral-700 font-semibold">{preset.tone}</span>
                      </div>
                      <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100/50">
                        <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">Example:</span>
                        <p className="text-neutral-600 leading-normal italic">"{preset.exampleText}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
