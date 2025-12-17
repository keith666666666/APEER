import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { mockData } from '../../services/mockData';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

// ============================================================================
// CREATE ACTIVITY MODAL
// ============================================================================
export const CreateActivityModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedRubric, setSelectedRubric] = useState(null);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal max-w-2xl w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">Create Evaluation Activity</h2>

        <div className="activity-form-field">
          <Input
            label="Activity Title"
            placeholder="e.g., Midterm Peer Review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <div className="activity-form-rubric-section">
            <label className="activity-form-rubric-label">Select Rubric</label>
            <div className="activity-form-rubric-list">
              {mockData.rubrics.map((rubric) => (
                <motion.div
                  key={rubric.id}
                  className={`activity-form-rubric-item ${
                    selectedRubric?.id === rubric.id
                      ? 'activity-form-rubric-item-active'
                      : 'activity-form-rubric-item-inactive'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedRubric(rubric)}
                >
                  <h4 className="activity-form-rubric-title">{rubric.name}</h4>
                  <div className="activity-form-rubric-criteria">
                    {rubric.criteria.map((c, i) => (
                      <span key={i} className="activity-form-rubric-criterion">
                        {c.name} ({c.weight}%)
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <Button className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Create Activity
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

