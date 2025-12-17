import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, AlertCircle, CheckCircle2, User, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { evaluationService } from '../../services/evaluationService';
import { activityService } from '../../services/activityService';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

// ============================================================================
// EVALUATION FORM MODAL
// ============================================================================
export const EvaluationFormModal = ({ onClose, activityId: propActivityId, targetStudentId: propTargetStudentId }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(propActivityId || '');
  const [selectedTargetStudentId, setSelectedTargetStudentId] = useState(propTargetStudentId || '');
  const [activities, setActivities] = useState([]);
  const [studentsToEvaluate, setStudentsToEvaluate] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [ratings, setRatings] = useState({
    communication: 0,
    collaboration: 0,
    reliability: 0
  });

  // Fetch activities and students to evaluate
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [activitiesData, studentsData] = await Promise.all([
          api.get('/student/activities').then(res => res.data).catch(() => 
            activityService.getAllActivities().catch(() => [])
          ),
          api.get('/student/students-to-evaluate').then(res => res.data).catch(() => [])
        ]);
        setActivities(activitiesData.filter(a => a.status === 'active' || !a.status));
        setStudentsToEvaluate(studentsData);
        
        // Auto-select first activity and student if available
        if (activitiesData.length > 0 && !selectedActivityId) {
          setSelectedActivityId(activitiesData[0].id);
        }
        if (studentsData.length > 0 && !selectedTargetStudentId) {
          setSelectedTargetStudentId(studentsData[0].id);
        }
      } catch (err) {
        console.error('Error fetching evaluation data:', err);
        setError('Failed to load activities or students. Please refresh and try again.');
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (comment.length > 20) {
      setAnalyzing(true);
      const timer = setTimeout(() => {
        setTags(['Constructive', 'Specific', 'Polite']);
        setAnalyzing(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setTags([]);
    }
  }, [comment]);

  const handleSubmit = async () => {
    // Validation
    if (!selectedActivityId) {
      setError('Please select an activity.');
      return;
    }
    if (!selectedTargetStudentId) {
      setError('Please select a student to evaluate.');
      return;
    }
    if (!comment.trim()) {
      setError('Please provide detailed feedback.');
      return;
    }
    if (Object.values(ratings).some(r => r === 0)) {
      setError('Please provide ratings for all criteria.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Convert ratings to scores array
      const scores = Object.entries(ratings).map(([criterionName, score]) => ({
        criterionName,
        score
      }));

      const result = await evaluationService.submitEvaluation(
        selectedActivityId,
        selectedTargetStudentId,
        comment,
        scores
      );

      setSuccess(true);
      setTags(result.analysis?.tags || tags);
      
      // Close modal after 2 seconds and refresh to show new feedback
      setTimeout(() => {
        onClose();
        // Refresh page to update dashboard and feedback history
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Error submitting evaluation:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit evaluation. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const RatingPills = ({ value, onChange }) => (
    <div className="eval-form-rating-pills">
      {[1, 2, 3, 4, 5].map((num) => (
        <motion.button
          key={num}
          className={`eval-form-rating-pill ${
            value >= num
              ? 'eval-form-rating-pill-active'
              : 'eval-form-rating-pill-inactive'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(num)}
        >
          {num}
        </motion.button>
      ))}
    </div>
  );

  return (
    <motion.div
      className="modal-overlay-scroll"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal max-w-2xl w-full my-8"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">Peer Evaluation</h2>

        {loadingData ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading activities and students...</p>
          </div>
        ) : (
          <>
            {/* Activity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Select Activity
              </label>
              <select
                value={selectedActivityId}
                onChange={(e) => {
                  setSelectedActivityId(e.target.value);
                  setError(null); // Clear error when selection changes
                }}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || loadingData}
              >
                <option value="">-- Select an activity --</option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name} {activity.dueDate ? `(Due: ${new Date(activity.dueDate).toLocaleDateString()})` : ''}
                  </option>
                ))}
              </select>
              {!loadingData && activities.length === 0 && (
                <p className="text-sm text-yellow-400 mt-2">No active activities available. Please contact your teacher.</p>
              )}
            </div>

            {/* Student Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Select Student to Evaluate
              </label>
              <select
                value={selectedTargetStudentId}
                onChange={(e) => {
                  setSelectedTargetStudentId(e.target.value);
                  setError(null); // Clear error when selection changes
                }}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || loadingData || !selectedActivityId}
              >
                <option value="">-- Select a student --</option>
                {studentsToEvaluate.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
              {!loadingData && !selectedActivityId && (
                <p className="text-sm text-gray-400 mt-2">Please select an activity first.</p>
              )}
              {!loadingData && selectedActivityId && studentsToEvaluate.length === 0 && (
                <p className="text-sm text-yellow-400 mt-2">No students available to evaluate. You may need to be assigned to a group, or there are no peers in your group.</p>
              )}
            </div>

            {/* Rubric Ratings */}
            <div className="eval-form-rating-section">
              {Object.entries(ratings).map(([key, value]) => (
                <div key={key}>
                  <label className="eval-form-rating-label">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <RatingPills
                    value={value}
                    onChange={(num) => setRatings({ ...ratings, [key]: num })}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Comment Textarea */}
        <div className="eval-form-textarea-wrapper">
          <Textarea
            label="Detailed Feedback"
            placeholder="Share your thoughtful feedback here..."
            rows={6}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {analyzing && (
            <motion.div
              className="eval-form-analyzing"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-teal-400" />
            </motion.div>
          )}
        </div>

        {/* AI Tags */}
        <AnimatePresence>
          {tags.length > 0 && (
            <motion.div
              className="eval-form-tags"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {tags.map((tag, i) => (
                <motion.span
                  key={i}
                  className="eval-form-tag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

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
            <p className="text-green-400 text-sm">Evaluation submitted successfully!</p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="modal-actions">
          <Button 
            className="flex-1" 
            onClick={handleSubmit}
            disabled={submitting || loadingData || !selectedActivityId || !selectedTargetStudentId || !comment.trim() || Object.values(ratings).some(r => r === 0)}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Evaluation
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

