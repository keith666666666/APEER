import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const CreateGroupModal = ({ onClose, onCreate }) => {
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      await onCreate(groupName.trim());
      setGroupName('');
      onClose();
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create New Group</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Group Name"
              placeholder="e.g., Team A, Group 1"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError(null);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreate();
                }
              }}
            />

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreate}
                disabled={isCreating || !groupName.trim()}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Group'
                )}
              </Button>
              <Button variant="ghost" onClick={onClose} disabled={isCreating}>
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

