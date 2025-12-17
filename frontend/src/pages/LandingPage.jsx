import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, TrendingUp, Shield, Users, LogIn, 
  ChevronRight, CheckCircle2, Target, Zap, Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

// ============================================================================
// LANDING PAGE
// ============================================================================
const LandingPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');

  const handleLogin = () => {
    if (email) {
      login(email);
      navigate('/student');
    }
  };

  const handleRegister = () => {
    if (email && name && selectedRole) {
      register(email, name, selectedRole);
      const route = selectedRole === 'student' ? '/student' : '/teacher';
      navigate(route);
    }
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
    setEmail('');
    setName('');
    setSelectedRole('student');
  };

  return (
    <div className="landing-page">
      {/* Aurora Background */}
      <div className="landing-aurora-bg">
        <div className="landing-aurora-base" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Navigation */}
      <nav className="landing-nav">
        <motion.div 
          className="landing-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          APEER
        </motion.div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => openAuth('register')}>
            Sign Up
          </Button>
          <Button variant="ghost" onClick={() => openAuth('login')}>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="landing-hero">
        <motion.div
          className="landing-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="landing-title">
            <span className="landing-title-gradient-1">
              Fair. Efficient.
            </span>
            <br />
            <span className="landing-title-gradient-2">
              Intelligent.
            </span>
          </h1>
          <p className="landing-subtitle">
            AI-powered peer evaluation for the modern classroom
          </p>
          <div className="landing-cta">
            <Button onClick={() => openAuth('register')}>
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="ghost">
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Bento Grid Features */}
        <div className="landing-bento-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card spotlight className="landing-feature-card">
              <Brain className="landing-feature-icon landing-feature-icon-teal" />
              <h3 className="landing-feature-title">AI Analysis</h3>
              <p className="landing-feature-desc">
                Automatically classify and tag feedback using advanced NLP
              </p>
              <div className="landing-feature-tags">
                <span className="landing-tag landing-tag-teal">Constructive</span>
                <span className="landing-tag landing-tag-purple">Polite</span>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card spotlight className="landing-feature-card">
              <Shield className="landing-feature-icon landing-feature-icon-purple" />
              <h3 className="landing-feature-title">Bias Detection</h3>
              <p className="landing-feature-desc">
                Statistical analysis to ensure fair grading
              </p>
              <div className="landing-chart-bars">
                {[65, 78, 82, 79, 95, 81, 77].map((h, i) => (
                  <div 
                    key={i}
                    className={`landing-chart-bar ${i === 4 ? 'bg-red-500' : 'bg-teal-500/50'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card spotlight className="landing-feature-card">
              <Sparkles className="landing-feature-icon landing-feature-icon-yellow" />
              <h3 className="landing-feature-title">Smart Summaries</h3>
              <p className="landing-feature-desc">
                Generate concise insights from multiple feedback sources
              </p>
              <ul className="landing-feature-list">
                <li className="landing-feature-list-item">
                  <CheckCircle2 className="landing-feature-list-icon landing-feature-list-icon-teal" />
                  Strong leadership skills
                </li>
                <li className="landing-feature-list-item">
                  <Target className="landing-feature-list-icon landing-feature-list-icon-yellow" />
                  Improve time management
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div
          className="landing-team-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="landing-team-title">Built by</h2>
          <div className="landing-team-grid">
            {[
              "Bajamunde, Louie V.",
              "Magpatoc, Mark Andrew G.",
              "Queddeng, James Adriane S.",
              "Rigodon, Keith Yancy A.",
              "Tabungar, Steven Jan M."
            ].map((name, i) => (
              <Card key={i} className="landing-team-card">
                <div className="landing-team-avatar" />
                <p className="landing-team-name">{name}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            className="auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              className="auth-modal max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Toggle between Login and Register */}
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${authMode === 'login' ? 'auth-tab-active' : ''}`}
                  onClick={() => setAuthMode('login')}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab ${authMode === 'register' ? 'auth-tab-active' : ''}`}
                  onClick={() => setAuthMode('register')}
                >
                  Sign Up
                </button>
              </div>

              {authMode === 'login' ? (
                <>
                  <h2 className="auth-form-title">Welcome Back</h2>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your.email@cit.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="auth-helper-text mt-2">
                    Use "student", "teacher", or "admin" in your email for demo
                  </p>
                  <div className="auth-actions">
                    <Button className="flex-1" onClick={handleLogin}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button variant="ghost" onClick={() => setShowAuth(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="auth-form-title">Create Account</h2>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="Juan Dela Cruz"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your.email@cit.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <label className="input-label">I am a...</label>
                      <div className="auth-role-grid">
                        <motion.button
                          className={`auth-role-button ${
                            selectedRole === 'student'
                              ? 'auth-role-button-student'
                              : 'auth-role-button-inactive'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRole('student')}
                        >
                          <Users className="auth-role-icon auth-role-icon-student" />
                          <div className="auth-role-label">Student</div>
                        </motion.button>
                        <motion.button
                          className={`auth-role-button ${
                            selectedRole === 'teacher'
                              ? 'auth-role-button-teacher'
                              : 'auth-role-button-inactive'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRole('teacher')}
                        >
                          <Shield className="auth-role-icon auth-role-icon-teacher" />
                          <div className="auth-role-label">Teacher</div>
                        </motion.button>
                      </div>
                    </div>

                    <p className="auth-helper-text">
                      By signing up, you agree to authenticate via Google Workspace
                    </p>
                  </div>
                  <div className="auth-actions">
                    <Button className="flex-1" onClick={handleRegister}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Account
                    </Button>
                    <Button variant="ghost" onClick={() => setShowAuth(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;

