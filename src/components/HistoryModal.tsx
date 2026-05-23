import React from 'react';
import { HistoryEntry } from '../types';
import { formatCurrency, vibrate } from '../utils';
import { X, Clock, Trash2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onClearHistory: () => void;
  onDeleteEntry: (id: string) => void;
  onLoadEntry: (entry: HistoryEntry) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ 
  isOpen, onClose, history, onClearHistory, onDeleteEntry, onLoadEntry 
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm p-4 sm:p-0"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md max-h-[80vh] flex flex-col bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/10 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-5 border-b border-gray-200/50 dark:border-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <Clock size={20} className="text-blue-500" />
              {t('history')}
            </h2>
            <button 
              onClick={() => { vibrate(50); onClose(); }}
              className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 scroll-smooth">
            {history.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <p>{t('noHistory')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {history.map((entry) => (
                    <motion.div 
                      key={entry.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      onClick={() => {
                          vibrate(50);
                          onLoadEntry(entry);
                          onClose();
                      }}
                      className="glass rounded-2xl p-4 cursor-pointer hover:bg-white/60 dark:hover:bg-white/10 transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 group relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                         <div>
                            {entry.productName && (
                              <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                                {entry.productName}
                              </h4>
                            )}
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                         </div>
                         <div className="flex items-center gap-2">
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               onDeleteEntry(entry.id);
                             }}
                             className="p-1.5 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                             title="Delete entry"
                             aria-label="Delete entry"
                           >
                             <Trash2 size={16} />
                           </button>
                           <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                         </div>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1 text-sm no-scrollbar">
                          {entry.items.filter(i => i.price && i.size).map((i, idx) => (
                             <div key={idx} className="bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md whitespace-nowrap text-gray-700 dark:text-gray-300">
                                Opt {idx + 1}: {i.price}/{i.size}
                             </div>
                          ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div className="p-4 border-t border-gray-200/50 dark:border-white/5">
              <button 
                onClick={() => { vibrate([50, 50, 50]); onClearHistory(); }}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium transition-colors"
              >
                <Trash2 size={18} />
                {t('clearAllHistory')}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
