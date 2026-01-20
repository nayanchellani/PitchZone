import { useState, useEffect } from 'react';
import { isValidImageUrl } from '../utils/formValidation';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

const ImagePreview = ({ imageUrl, alt = "Preview", className = "" }) => {
  const [imageStatus, setImageStatus] = useState('loading'); // loading, success, error
  const [imageError, setImageError] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!imageUrl || imageUrl.trim() === '') {
      setImageStatus('empty');
      return;
    }

    // Check for validation warnings
    const validation = isValidImageUrl(imageUrl);
    setShowWarning(!!validation.warning);

    setImageStatus('loading');
    setImageError('');

    // Create a new image to test if URL is valid
    const img = new Image();
    
    img.onload = () => {
      setImageStatus('success');
      setImageError('');
    };
    
    img.onerror = () => {
      setImageStatus('error');
      setImageError('Unable to load image from this URL. Please check if the URL is correct and publicly accessible.');
    };
    
    // Set a timeout for slow loading images
    const timeout = setTimeout(() => {
      if (imageStatus === 'loading') {
        setImageStatus('error');
        setImageError('Image is taking too long to load. Please try a different URL.');
      }
    }, 8000); // Reduced timeout to 8 seconds
    
    img.src = imageUrl;
    
    return () => clearTimeout(timeout);
  }, [imageUrl, imageStatus]);

  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  return (
    <div className={`image-preview-container ${className}`}>
      {imageStatus === 'loading' && (
        <div className="image-preview-loading">
          <Loader2 className="animate-spin" size={24} color="#66fcf1" />
          <span>Loading image...</span>
        </div>
      )}
      
      {imageStatus === 'success' && (
        <div className="image-preview-success">
          <img 
            src={imageUrl} 
            alt={alt}
            className="image-preview"
            style={{
              maxWidth: '200px',
              maxHeight: '150px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '2px solid #e0e0e0'
            }}
          />
          <div className="image-preview-status success">
            <CheckCircle size={16} /> Image loaded successfully
          </div>
          {showWarning && (
            <div className="image-preview-status warning">
              <AlertTriangle size={16} /> Make sure this URL points to an image file
            </div>
          )}
        </div>
      )}
      
      {imageStatus === 'error' && (
        <div className="image-preview-error">
          <div className="image-preview-placeholder error">
            <XCircle size={32} />
          </div>
          <div className="image-preview-status error">
            {imageError}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;