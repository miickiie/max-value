/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Item, ComparisonResult, HistoryEntry } from './types';
import { generateId, vibrate } from './utils';
import { ItemInput } from './components/ItemInput';
import { ResultCard } from './components/ResultCard';
import { HistoryModal } from './components/HistoryModal';
import { Plus, RotateCcw, Share2, BookmarkPlus, Check, Clock, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';

export default function App() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Item[]>([
    { id: generateId(), name: '', size: '', price: '' },
    { id: generateId(), name: '', size: '', price: '' },
  ]);
  const [productName, setProductName] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [showCopiedMsg, setShowCopiedMsg] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('maxValueHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  const saveHistoryToLocal = (newHistory: HistoryEntry[]) => {
    setHistory(newHistory);
    localStorage.setItem('maxValueHistory', JSON.stringify(newHistory));
  };

  const results = useMemo(() => {
    let validItems: ComparisonResult[] = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        const price = parseFloat(item.price);
        const size = parseFloat(item.size);
        return !isNaN(price) && !isNaN(size) && price > 0 && size > 0;
      })
      .map(({ item, index }) => ({
        ...item,
        unitPrice: parseFloat(item.price) / parseFloat(item.size),
        isBest: false,
        savingsPercent: 0,
        originalIndex: index,
      }));

    if (validItems.length > 0) {
      const minUnitPrice = Math.min(...validItems.map(i => i.unitPrice));
      const maxUnitPrice = Math.max(...validItems.map(i => i.unitPrice));

      validItems = validItems.map(item => {
        const isBest = item.unitPrice === minUnitPrice;
        // Compare best vs most expensive to show X% cheaper
        let savingsPercent = 0;
        if (isBest && maxUnitPrice > minUnitPrice) {
            savingsPercent = ((maxUnitPrice - minUnitPrice) / maxUnitPrice) * 100;
        }
        return {
          ...item,
          isBest,
          savingsPercent
        };
      });
      // Sort: best first
      validItems.sort((a, b) => a.unitPrice - b.unitPrice);
    }

    return validItems;
  }, [items]);

  const handleUpdateItem = (id: string, field: keyof Item, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAddItem = () => {
    vibrate(50);
    setItems([...items, { id: generateId(), name: '', size: '', price: '' }]);
  };

  const handleRemoveItem = (id: string) => {
    vibrate(50);
    setItems(items.filter(item => item.id !== id));
  };

  const handleReset = () => {
    vibrate([50, 50, 50]);
    setProductName('');
    setItems([
      { id: generateId(), name: '', size: '', price: '' },
      { id: generateId(), name: '', size: '', price: '' },
    ]);
  };

  const handleSave = () => {
    if (results.length < 2) return;
    vibrate([30, 50, 30]);
    const newEntry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      productName: productName.trim() || undefined,
      items: items.map(i => ({...i}))
    };
    saveHistoryToLocal([newEntry, ...history].slice(0, 50));
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  };

  const handleDeleteEntry = (id: string) => {
    vibrate(50);
    const newHistory = history.filter(h => h.id !== id);
    saveHistoryToLocal(newHistory);
  };

  const handleShare = async () => {
    if (results.length < 2) return;
    vibrate(50);
    const best = results.find(r => r.isBest);
    const text = `${t('shareTextBest')} ${t('option')} ${best ? best.originalIndex + 1 : ''} ${t('shareTextAt')}${best?.unitPrice.toFixed(2)}${t('shareTextEnd')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('title'),
          text: text,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      setShowCopiedMsg(true);
      setTimeout(() => setShowCopiedMsg(false), 2000);
    }
  };

  const toggleLanguage = () => {
    vibrate(50);
    const newLang = i18n.language === 'en' ? 'th' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleCreditClick = () => {
    vibrate([100, 30, 100, 30, 100, 200, 200]);
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 flex flex-col items-center selection:bg-blue-200">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-4 relative z-10 glass rounded-full px-6 py-3 border-t border-white/60">
          <h1 
            onClick={() => {
              vibrate(50);
              const root = document.documentElement;
              const isDark = root.classList.contains('dark') || 
                (!root.classList.contains('light') && window.matchMedia('(prefers-color-scheme: dark)').matches);
              
              if (isDark) {
                root.classList.remove('dark');
                root.classList.add('light');
                localStorage.setItem('theme', 'light');
              } else {
                root.classList.remove('light');
                root.classList.add('dark');
                localStorage.setItem('theme', 'dark');
              }
            }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight cursor-pointer select-none hover:opacity-80 active:scale-95 transition-all"
            title="Toggle Light/Dark Mode"
          >
            {t('title')}
          </h1>
          <div className="flex items-center gap-3">
            <button
               onClick={toggleLanguage}
               className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
               title="Change Language"
            >
              <Languages size={16} />
              {i18n.language === 'en' ? 'EN' : 'TH'}
            </button>
            <button 
              onClick={() => { vibrate(50); setIsHistoryOpen(true); }}
              className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300 relative group"
              aria-label={t('viewHistory')}
            >
              <Clock size={20} />
              {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-[#1a1c23]"></span>
              )}
              <span className="absolute -bottom-8 right-0 text-xs font-medium bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{t('history')}</span>
            </button>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex gap-2 mb-4">
           <button 
             onClick={handleSave} 
             disabled={results.length < 2}
             title={t('saveComparison')}
             className="glass-button p-2.5 flex-1 flex justify-center items-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400"
           >
              {showSavedMsg ? <Check size={20} className="text-green-500 dark:text-green-500" /> : <BookmarkPlus size={20} />}
           </button>
           <button 
             onClick={handleShare} 
             disabled={results.length < 2}
             title={t('shareResults')}
             className="glass-button p-2.5 flex-1 flex justify-center items-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-purple-500 hover:text-purple-600 dark:text-purple-500 dark:hover:text-purple-400"
           >
              {showCopiedMsg ? <Check size={20} className="text-green-500 dark:text-green-500" /> : <Share2 size={20} />}
           </button>
           <button 
             onClick={handleReset} 
             title={t('resetAll')}
             className="glass-button p-2.5 flex-1 flex justify-center items-center rounded-xl text-red-500 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400"
           >
              <RotateCcw size={20} />
           </button>
        </div>

        {/* Inputs */}
        <div className="glass rounded-3xl p-4 sm:p-6 mb-6 shadow-sm border border-white/60 dark:border-white/10">
          <div className="mb-5">
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder={t('productNameOptional')}
              className="w-full glass-input rounded-xl px-4 py-3 text-base font-medium shadow-sm transition-all text-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item, index) => (
                <ItemInput 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  updateItem={handleUpdateItem} 
                  removeItem={handleRemoveItem}
                  canRemove={items.length > 2}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Add Button */}
          <button 
            onClick={handleAddItem}
            className="w-full mt-4 bg-white/40 dark:bg-black/20 border border-dashed border-gray-300 dark:border-gray-600 py-2.5 rounded-xl flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-white/60 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-blue-500 transition-all font-medium text-sm"
          >
            <Plus size={18} />
            <span>{t('addOption')}</span>
          </button>
        </div>

        {/* Results */}
        <ResultCard results={results} />
        
        {/* Helper Padding for mobile */}
        <div className="h-6 w-full"></div>

        <div 
          onClick={handleCreditClick}
          className="text-center text-xs font-medium text-gray-400 dark:text-gray-500/80 pb-6 opacity-80 hover:opacity-100 transition-all cursor-pointer select-none active:scale-95"
        >
          Vibe with ❤️ by Miickiie
        </div>

      </div>

      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onClearHistory={() => saveHistoryToLocal([])}
        onDeleteEntry={handleDeleteEntry}
        onLoadEntry={(entry) => {
          setProductName(entry.productName || '');
          setItems(entry.items.map(i => ({...i})));
        }}
      />
    </div>
  );
}
