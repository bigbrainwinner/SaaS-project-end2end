'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Calendar, Text, Users, Volume2, Plus, X, Paperclip, Check, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/store/AppContext';

export default function NewOrderPage() {
  const router = useRouter();
  const { addOrder } = useApp();

  // Form Field States
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('Blog Post');
  const [wordCount, setWordCount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [toneVoice, setToneVoice] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // SEO Keywords list state
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  // Reference links list state
  const [linkInput, setLinkInput] = useState('');
  const [referenceLinks, setReferenceLinks] = useState<string[]>([]);

  // Attachments state
  const [attachments, setAttachments] = useState<File[]>([]);

  // Error & Submit state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Content type presets
  const contentTypes = ['Blog Post', 'Newsletter Email', 'Website Copy', 'Technical Guide', 'Social Media Post', 'Whitepaper'];

  // Add keyword helper
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = keywordInput.trim();
    if (clean && !keywords.includes(clean)) {
      setKeywords([...keywords, clean]);
      setKeywordInput('');
    }
  };

  // Remove keyword helper
  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // Add link helper
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = linkInput.trim();
    if (clean && !referenceLinks.includes(clean)) {
      // Basic URL check/addition
      setReferenceLinks([...referenceLinks, clean]);
      setLinkInput('');
    }
  };

  // Remove link helper
  const handleRemoveLink = (index: number) => {
    setReferenceLinks(referenceLinks.filter((_, i) => i !== index));
  };

  // Handle files selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  // Remove file helper
  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Validate form client-side
  const validateForm = () => {
    const tempErrors: Record<string, string> = {};

    if (!title.trim()) tempErrors.title = 'Task title is required';
    else if (title.trim().length < 5) tempErrors.title = 'Title must be at least 5 characters';

    if (!contentType) tempErrors.contentType = 'Please select a content type';

    const wordsNum = Number(wordCount);
    if (!wordCount) tempErrors.wordCount = 'Word count is required';
    else if (isNaN(wordsNum) || wordsNum <= 0) tempErrors.wordCount = 'Must be a valid positive number';
    else if (wordsNum < 100) tempErrors.wordCount = 'Minimum word count is 100 words';
    else if (wordsNum > 20000) tempErrors.wordCount = 'Maximum word count is 20,000 words';

    if (!deadline) tempErrors.deadline = 'Deadline date is required';
    else {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // compare dates only
      if (deadlineDate < today) {
        tempErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    if (!targetAudience.trim()) tempErrors.targetAudience = 'Target audience is required';
    if (!toneVoice.trim()) tempErrors.toneVoice = 'Tone and voice guidance is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(async () => {
      try {
        const newOrder = await addOrder({
          title,
          contentType,
          wordCount: Number(wordCount),
          deadline,
          targetAudience,
          toneVoice,
          keywords,
          referenceLinks,
          additionalNotes,
          attachments,
        });

        // Redirect to detail page
        router.push(`/orders/${newOrder.id}`);
      } catch (err) {
        console.error('Failed to submit task:', err);
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
      
      {/* Left 2 Columns: Main Info Form Card */}
      <div className="md:col-span-2 rounded-xl border border-neutral-100 bg-white p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-neutral-900 font-sans">Create a new task brief</h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">Configure your task parameters, brief, and deadline settings below.</p>
        </div>

        <div className="space-y-4">
          
          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Project Title</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                <FileText className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 Growth Marketing Playbook"
                className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-neutral-100 ${
                  errors.title ? 'border-red-300 bg-red-50/10 focus:border-red-400' : 'border-neutral-200 bg-neutral-50/50 focus:border-neutral-300'
                }`}
              />
            </div>
            {errors.title && (
              <p className="flex items-center gap-1 text-[10px] font-bold text-red-500 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Type & Word Count row */}
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* Content Type Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-neutral-300 focus:bg-white"
              >
                {contentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Word Count Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Target Word Count</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                  <Text className="h-4 w-4" />
                </span>
                <input
                  type="number"
                  value={wordCount}
                  onChange={(e) => setWordCount(e.target.value)}
                  placeholder="e.g. 1500"
                  className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-neutral-100 ${
                    errors.wordCount ? 'border-red-300 bg-red-50/10 focus:border-red-400' : 'border-neutral-200 bg-neutral-50/50 focus:border-neutral-300'
                  }`}
                />
              </div>
              {errors.wordCount && (
                <p className="flex items-center gap-1 text-[10px] font-bold text-red-500 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.wordCount}
                </p>
              )}
            </div>
          </div>

          {/* Deadline Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Deadline Date</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                <Calendar className="h-4 w-4" />
              </span>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-neutral-100 ${
                  errors.deadline ? 'border-red-300 bg-red-50/10 focus:border-red-400' : 'border-neutral-200 bg-neutral-50/50 focus:border-neutral-300'
                }`}
              />
            </div>
            {errors.deadline && (
              <p className="flex items-center gap-1 text-[10px] font-bold text-red-500 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.deadline}
              </p>
            )}
          </div>

          {/* Target Audience Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Target Audience</label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-neutral-400">
                <Users className="h-4 w-4" />
              </span>
              <textarea
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your ideal readers, e.g. Technical SEO professionals, developers at scale..."
                rows={2}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-neutral-100 ${
                  errors.targetAudience ? 'border-red-300 bg-red-50/10 focus:border-red-400' : 'border-neutral-200 bg-neutral-50/50 focus:border-neutral-300'
                }`}
              />
            </div>
            {errors.targetAudience && (
              <p className="flex items-center gap-1 text-[10px] font-bold text-red-500 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.targetAudience}
              </p>
            )}
          </div>

          {/* Tone & Voice Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Tone & Voice Guidance</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                <Volume2 className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={toneVoice}
                onChange={(e) => setToneVoice(e.target.value)}
                placeholder="e.g. Authoritative, conversational, clear, avoiding passive structures"
                className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-neutral-100 ${
                  errors.toneVoice ? 'border-red-300 bg-red-50/10 focus:border-red-400' : 'border-neutral-200 bg-neutral-50/50 focus:border-neutral-300'
                }`}
              />
            </div>
            {errors.toneVoice && (
              <p className="flex items-center gap-1 text-[10px] font-bold text-red-500 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.toneVoice}
              </p>
            )}
          </div>

          {/* Additional Notes Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Additional Instructions / Notes</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Outline specific sections, sections to avoid, word bounds, internal docs, etc..."
              rows={4}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-neutral-300 focus:bg-white focus:ring-2 focus:ring-neutral-100"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-neutral-50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-violet-700 disabled:opacity-50 active:scale-[0.98] font-sans"
          >
            {isSubmitting ? 'Submitting brief...' : 'Save task'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/orders')}
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-600 transition-all hover:bg-neutral-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Right Column: Assets, Keywords, Reference Links & File Attachments */}
      <div className="space-y-6">
        
        {/* SEO Keywords Card */}
        <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">SEO Keywords</h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">Attach target keywords for the copywriters.</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="e.g. sharding"
              className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-1.5 text-xs font-semibold outline-none transition-all focus:border-neutral-300 focus:bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddKeyword(e);
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Keywords tags display */}
          <div className="flex flex-wrap gap-1.5">
            {keywords.length === 0 ? (
              <span className="text-[10px] text-neutral-400 italic">No keywords added</span>
            ) : (
              keywords.map((kw, idx) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 rounded-md bg-neutral-50 border border-neutral-200/50 pl-2 pr-1.5 py-0.5 text-[10px] font-bold text-neutral-600"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(idx)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Reference Links Card */}
        <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Reference Links</h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">Attach helpful links, specs or references.</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="e.g. google.com/docs"
              className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-1.5 text-xs font-semibold outline-none transition-all focus:border-neutral-300 focus:bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLink(e);
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Links list display */}
          <div className="space-y-1.5">
            {referenceLinks.length === 0 ? (
              <span className="text-[10px] text-neutral-400 italic block">No links added</span>
            ) : (
              referenceLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-1.5 rounded bg-neutral-50 text-[10px] font-semibold text-neutral-600 truncate"
                >
                  <span className="truncate flex-1 pr-2">{link}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    className="text-neutral-400 hover:text-neutral-600 shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* File Attachments Dropzone Card */}
        <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">File Attachments</h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">Upload outlines, structures or graphic files.</p>
          </div>

          {/* Custom styled file input */}
          <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-neutral-200 rounded-lg cursor-pointer bg-neutral-50/30 hover:bg-neutral-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <Paperclip className="h-5 w-5 text-neutral-400 mb-1.5" />
              <p className="text-[10px] font-bold text-neutral-600">Click to upload files</p>
              <p className="text-[8px] text-neutral-400 mt-0.5">PDF, DOCX, PNG up to 10MB</p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Listed files */}
          <div className="space-y-1.5">
            {attachments.length === 0 ? (
              <span className="text-[10px] text-neutral-400 italic block">No files selected</span>
            ) : (
              attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg border border-neutral-100 bg-neutral-50/50 text-[10px]"
                >
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <FileText className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="font-bold text-neutral-600 truncate">{file.name}</span>
                    <span className="text-neutral-400 shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="text-neutral-400 hover:text-neutral-600 shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
