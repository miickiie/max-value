import React from 'react';
import { ComparisonResult } from '../types';
import { formatCurrency, formatNumber } from '../utils';
import { Trophy, ArrowDownCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface ResultCardProps {
  results: ComparisonResult[];
}

export const ResultCard: React.FC<ResultCardProps> = ({ results }) => {
  const { t } = useTranslation();

  if (results.length === 0) return null;

  const bestItem = results.find(r => r.isBest);
  const worstItem = [...results].sort((a, b) => b.unitPrice - a.unitPrice)[0];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-6 mt-6 border-blue-200/50 dark:border-blue-500/30 shadow-[0_8px_32px_rgba(59,130,246,0.1)]"
    >
      <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
        <Trophy size={24} className="text-yellow-500" />
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{t('bestValue')}</h2>
      </div>

      {bestItem ? (
        <div className="space-y-4">
          <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-5 border border-white/60 dark:border-white/5">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {t('option')} {bestItem.originalIndex + 1}
            </h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                {formatCurrency(bestItem.unitPrice)}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/ {t('unit')}</span>
            </div>
            
            {bestItem.savingsPercent > 0 && worstItem && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-500/10 px-3 py-2 rounded-xl text-sm font-medium w-fit">
                <ArrowDownCircle size={16} />
                <span>{bestItem.savingsPercent.toFixed(1)}% {t('cheaper')}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">{t('vsMostExpensive')}</span>
              </div>
            )}
          </div>

          {results.length > 1 && (
            <div className="pt-2">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1 uppercase tracking-wider">{t('otherOptions')}</h4>
              <div className="space-y-2">
                {results.filter(r => !r.isBest).map((result, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/30 dark:bg-white/5 px-4 py-3 rounded-xl">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {t('option')} {result.originalIndex + 1}
                    </span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {formatCurrency(result.unitPrice)}<span className="text-xs text-gray-500 font-normal"> / {t('unit')}</span>
                      </div>
                      {bestItem && result.unitPrice > bestItem.unitPrice && (
                        <div className="text-xs text-red-500 dark:text-red-400 font-medium">
                          +{(((result.unitPrice - bestItem.unitPrice) / bestItem.unitPrice) * 100).toFixed(1)}% {t('extra')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
         <div className="flex items-center gap-2 text-gray-500 p-4">
            <AlertCircle size={20} />
            <p>{t('pleaseEnterValid')}</p>
         </div>
      )}
    </motion.div>
  );
};
