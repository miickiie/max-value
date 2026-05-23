import React from 'react';
import { Item, ComparisonResult } from '../types';
import { formatCurrency, formatNumber } from '../utils';
import { Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface ItemInputProps {
  item: Item;
  index: number;
  updateItem: (id: string, field: keyof Item, value: string) => void;
  removeItem: (id: string) => void;
  canRemove: boolean;
}

export const ItemInput: React.FC<ItemInputProps> = ({ item, index, updateItem, removeItem, canRemove }) => {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent typing specific characters (e, E, +, -)
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleInput = (field: keyof Item) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val !== '' && parseFloat(val) < 0) return; // Prevent negative values
    updateItem(item.id, field, val);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
      className="flex gap-2 relative w-full"
    >
      <div className="flex-1 relative min-w-0">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-black/10 dark:bg-white/20 text-xs font-black text-gray-800 dark:text-gray-100 shadow-sm pointer-events-none">
          {index + 1}
        </div>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={item.price}
          onChange={handleInput('price')}
          onKeyDown={handleKeyDown}
          placeholder={t('price')}
          className="w-full glass-input rounded-xl pl-8 pr-12 py-2.5 text-base font-medium transition-all text-gray-800 dark:text-gray-100 peer"
        />
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400/80 transition-opacity pointer-events-none ${item.price ? 'opacity-100' : 'opacity-0 peer-focus:opacity-100'}`}>
          {t('priceLabel')}
        </div>
      </div>
      <div className="flex-1 relative min-w-0">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={item.size}
          onChange={handleInput('size')}
          onKeyDown={handleKeyDown}
          placeholder={t('size')}
          className={`w-full glass-input rounded-xl pl-3 py-2.5 text-base font-medium transition-all text-gray-800 dark:text-gray-100 peer ${canRemove ? 'pr-16' : 'pr-12'}`}
        />
        <div className={`absolute top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400/80 transition-opacity pointer-events-none ${canRemove ? 'right-9' : 'right-3'} ${item.size ? 'opacity-100' : 'opacity-0 peer-focus:opacity-100'}`}>
          {t('sizeLabel')}
        </div>
        {canRemove && (
          <button 
            onClick={() => removeItem(item.id)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors z-10"
            title="Remove item"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

