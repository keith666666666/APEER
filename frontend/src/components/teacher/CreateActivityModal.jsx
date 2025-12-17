import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { activityService } from '../../services/activityService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

// ============================================================================
// CREATE ACTIVITY MODAL
// ============================================================================
export const CreateActivityModal = ({ onClose, onActivityCreated }) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [rubrics, setRubrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const rubricList = await activityService.getRubrics();
        setRubrics(rubricList);
      } catch (err) {
        console.error('Error fetching rubrics:', err);
        setError('Failed to load rubrics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRubrics();
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || !deadline || !selectedRubric) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Convert date from HTML input format (YYYY-MM-DD) to ISO datetime format (YYYY-MM-DDTHH:mm:ss)
      // The backend expects ISO_DATE_TIME format
      const dueDateISO = deadline.includes('T') 
        ? deadline 
        : `${deadline}T23:59:59`; // Set to end of day if only date provided
      
      const activity = await activityService.createActivity(
        title,
        selectedRubric.id,
        dueDateISO,
        [] // participantIds - empty for now, can be populated later
      );

      setSuccess(true);
      
      // Call callback if provided
      if (onActivityCreated) {
        onActivityCreated(activity);
      }
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        // Refresh dashboard if callback not provided
        if (!onActivityCreated && window.location.reload) {
          window.location.reload();
        }
      }, 2000);
    } catch (err) {
      console.error('Error creating activity:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create activity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading rubrics...</div>
            ) : (
              <div className="activity-form-rubric-list">
                {rubrics.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No rubrics available</div>
                ) : (
                  rubrics.map((rubric) => (
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
                        {rubric.criteria?.map((c, i) => (
                          <span key={i} className="activity-form-rubric-criterion">
                            {c.name} ({c.weight || 0}%)
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="text-green-400 text-sm">Activity created successfully!</p>
          </motion.div>
        )}

        <div className="modal-actions">
          <Button 
            className="flex-1" 
            onClick={handleCreate}
            disabled={submitting || !title.trim() || !deadline || !selectedRubric}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Activity
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

