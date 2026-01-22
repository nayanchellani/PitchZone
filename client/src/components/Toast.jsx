import { useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info 
} from 'lucide-react';
import '../styles/Toast.css';

const Toast = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastIcon = () => {
    const iconProps = { size: 18, strokeWidth: 2.5 };
    
    switch (type) {
      case 'login':
      case 'logout':
      case 'pitch-created':
      case 'investment':
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'pitch-deleted':
      case 'error':
        return <XCircle {...iconProps} />;
      case 'warning':
        return <AlertTriangle {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  const getToastClass = () => {
    switch (type) {
      case 'login':
        return 'toast-login';
      case 'logout':
        return 'toast-logout';
      case 'pitch-created':
        return 'toast-pitch-created';
      case 'pitch-deleted':
        return 'toast-pitch-deleted';
      case 'investment':
        return 'toast-investment';
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      default:
        return 'toast-info';
    }
  };

  return (
    <div className={`toast-notification ${getToastClass()}`}>
      <div className="toast-icon">{getToastIcon()}</div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
