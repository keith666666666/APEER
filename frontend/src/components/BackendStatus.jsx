import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const BackendStatus = ({ children }) => {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);

  const checkBackend = async () => {
    try {
      const response = await api.get('/auth/health', { timeout: 3000 });
      if (response.data === 'APEER Backend is running' || response.status === 200) {
        setIsBackendReady(true);
        setLastCheck(new Date());
      } else {
        setIsBackendReady(false);
      }
    } catch (error) {
      setIsBackendReady(false);
      setLastCheck(new Date());
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <RefreshCw className="w-12 h-12 text-teal-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Connecting to server...</p>
        </motion.div>
      </div>
    );
  }

  if (!isBackendReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-red-500/20 rounded-3xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Backend Not Running</h2>
          
          <p className="text-gray-400 mb-6">
            Please start the Spring Boot backend server on port 8080.
          </p>
          
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-300 mb-2 font-semibold">Run this command:</p>
            <code className="block text-teal-400 text-sm whitespace-pre-wrap break-all">
              cd backend{'\n'}
              mvn spring-boot:run
            </code>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <RefreshCw className="w-4 h-4" />
            <span>Checking every 5 seconds...</span>
          </div>

          <button
            onClick={checkBackend}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Check Again
          </button>

          {lastCheck && (
            <p className="text-xs text-gray-600 mt-4">
              Last checked: {lastCheck.toLocaleTimeString()}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Optional: Show backend status indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs text-green-400"
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Backend Connected</span>
        </motion.div>
      </div>
    </>
  );
};

