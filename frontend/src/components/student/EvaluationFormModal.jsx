import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';

// ============================================================================
// EVALUATION FORM MODAL
// ============================================================================
export const EvaluationFormModal = ({ onClose }) => {
  const [comment, setComment] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [tags, setTags] = useState([]);
  const [ratings, setRatings] = useState({
    communication: 0,
    collaboration: 0,
    reliability: 0
  });

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

        {/* Rubric Ratings */}
        <div className="eval-form-rating-section">
          {Object.entries(ratings).map(([key, value]) => (
            <div key={key}>
              <label className="eval-form-rating-label">
                {key}
              </label>
              <RatingPills
                value={value}
                onChange={(num) => setRatings({ ...ratings, [key]: num })}
              />
            </div>
          ))}
        </div>

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

        {/* Actions */}
        <div className="modal-actions">
          <Button className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Submit Evaluation
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

