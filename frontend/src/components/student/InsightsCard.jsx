import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const InsightsCard = ({ feedbackSummary }) => {
  const navigate = useNavigate();

  if (!feedbackSummary) {
    return null;
  }

  const strengths = feedbackSummary.strengths 
    ? feedbackSummary.strengths.split('. ').filter(s => s.trim().length > 0)
    : [];
  const weaknesses = feedbackSummary.weaknesses 
    ? feedbackSummary.weaknesses.split('. ').filter(s => s.trim().length > 0)
    : [];
  const tips = feedbackSummary.tips || [];

  return (
    <Card spotlight className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold">AI Personalized Insights</h3>
      </div>

      <div className="space-y-6">
        {/* Strengths */}
        {strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold text-green-300">Strengths</h4>
            </div>
            <ul className="space-y-2 ml-7">
              {strengths.map((strength, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Growth */}
        {weaknesses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-yellow-300">Areas for Growth</h4>
            </div>
            <ul className="space-y-2 ml-7">
              {weaknesses.map((weakness, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips */}
        {tips.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-teal-400" />
              <h4 className="font-semibold text-teal-300">Recommendations</h4>
            </div>
            <ul className="space-y-2 ml-7">
              {tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-teal-400 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* View Full Report Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => navigate('/student/feedback')}
          >
            View Full Report
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </Card>
  );
};

