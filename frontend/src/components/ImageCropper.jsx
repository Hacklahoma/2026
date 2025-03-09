import React, { useState, useRef, useEffect, useMemo } from 'react';

const ProfilePictureCropper = ({ 
  initialImage, 
  onCropComplete, 
  onCancel,
  aspectRatio = 1
}) => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageElement, setImageElement] = useState(null);
  const [minScale, setMinScale] = useState(0.1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCropped, setIsCropped] = useState(false);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  
  // Generate a unique ID for the SVG mask to prevent conflicts with multiple instances
  const maskId = useMemo(() => `circle-mask-${Math.random().toString(36).substr(2, 9)}`, []);
  
  const imageRef = useRef(null);
  const cropperRef = useRef(null);
  const viewingWindowRef = useRef(null);
  
  // Check for dark mode on component mount
  useEffect(() => {
    // Get the theme from localStorage instead of system preference
    const savedTheme = localStorage.getItem('darkMode');
    setIsDarkMode(savedTheme === 'true');
    
    console.log("ImageCropper - Using theme from localStorage:", savedTheme === 'true' ? 'dark' : 'light');
  }, []);
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Process a file (either from input or passed as prop)
  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageElement(img);
        setImage(e.target.result);
        // Reset state for new image
        setIsCropped(false);
        
        // Store original dimensions
        setOriginalDimensions({ width: img.width, height: img.height });
        console.log("Original image dimensions:", { width: img.width, height: img.height });

        // Calculate the minimum scale needed to cover the circle
        calculateMinimumScale(img.width, img.height);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // COMPLETELY REWRITTEN: Calculate the minimum scale needed to cover the circle
  const calculateMinimumScale = (imageWidth, imageHeight) => {
    if (!cropperRef.current || !viewingWindowRef.current) return;
    
    const cropperSize = cropperRef.current.offsetWidth;
    const viewingWindowWidth = viewingWindowRef.current.offsetWidth;
    const viewingWindowHeight = viewingWindowRef.current.offsetHeight;
    
    // For a circular crop, we need to ensure the entire circle is covered
    // Calculate the scale needed for both width and height
    const widthRatio = cropperSize / imageWidth;
    const heightRatio = cropperSize / imageHeight;
    
    // For the viewing window, calculate the scale needed to fill it completely
    const viewingWidthRatio = viewingWindowWidth / imageWidth;
    const viewingHeightRatio = viewingWindowHeight / imageHeight;
    
    // Use the larger ratio to ensure the image covers the entire circle
    // This ensures no empty space is visible within the crop area
    const coverScale = Math.max(widthRatio, heightRatio);
    
    // Use the larger ratio to ensure the image covers the entire viewing window
    const viewingCoverScale = Math.max(viewingWidthRatio, viewingHeightRatio);
    
    // Choose the larger of the two scales to ensure both the circle and viewing window are covered
    const finalScale = Math.max(coverScale, viewingCoverScale);
    
    console.log("Setting minimum scale to:", finalScale);
    console.log("Image dimensions:", { imageWidth, imageHeight });
    console.log("Cropper dimensions:", { cropperSize });
    console.log("Viewing window dimensions:", { width: viewingWindowWidth, height: viewingWindowHeight });
    console.log("Width ratio:", widthRatio, "Height ratio:", heightRatio);
    console.log("Viewing width ratio:", viewingWidthRatio, "Viewing height ratio:", viewingHeightRatio);
    
    // Set min scale to exactly what's needed to cover both the circle and viewing window
    setMinScale(finalScale);
    
    // Set initial scale to the final scale to fill the viewing window
    setScale(finalScale);
    
    // Center the image with the new scale
    centerImageWithScale(imageWidth, imageHeight, finalScale);
  };
  
  // COMPLETELY REWRITTEN: Center the image with a specific scale and shift it to match circle margins
  const centerImageWithScale = (imageWidth, imageHeight, scaleValue) => {
    if (!cropperRef.current || !viewingWindowRef.current) return;
    
    const cropperSize = cropperRef.current.offsetWidth;
    const viewingWindowWidth = viewingWindowRef.current.offsetWidth;
    const viewingWindowHeight = viewingWindowRef.current.offsetHeight;
    const scaledWidth = imageWidth * scaleValue;
    const scaledHeight = imageHeight * scaleValue;
    
    // Calculate the horizontal margin between the circle and the viewport
    const horizontalMargin = (viewingWindowWidth - cropperSize) / 2;
    
    // Calculate the vertical margin between the circle and the viewport
    const verticalMargin = (viewingWindowHeight - cropperSize) / 2;
    
    // Calculate position to center the image in the cropper and shift it by the margins
    // This aligns the image with the right and bottom sides of the circle
    const x = (cropperSize - scaledWidth) / 2 + horizontalMargin;
    const y = (cropperSize - scaledHeight) / 2 + verticalMargin;
    
    console.log("Centering image with position:", { x, y, scale: scaleValue });
    console.log("Scaled dimensions:", { scaledWidth, scaledHeight, cropperSize });
    console.log("Margins:", { horizontal: horizontalMargin, vertical: verticalMargin });
    
    // Set the position to center the image with the horizontal and vertical shifts
    setCropPosition({ x, y });
  };

  // Process initialImage when component mounts or initialImage changes
  useEffect(() => {
    console.log("ImageCropper - initialImage received:", initialImage);
    if (initialImage) {
      // Reset state for new image
      setImage(null);
      setCroppedImage(null);
      setImageElement(null);
      setIsDragging(false);
      setIsCropped(false);
      
      if (typeof initialImage === 'string') {
        // If initialImage is a URL or data URL
        console.log("Processing string initialImage");
        const img = new Image();
        img.onload = () => {
          setImageElement(img);
          setImage(initialImage);
          
          // Store original dimensions
          setOriginalDimensions({ width: img.width, height: img.height });
          
          // Calculate the minimum scale needed to cover the circle
          setTimeout(() => {
            calculateMinimumScale(img.width, img.height);
          }, 50);
        };
        img.src = initialImage;
      } else if (initialImage instanceof File) {
        // If initialImage is a File object
        console.log("Processing File initialImage");
        processFile(initialImage);
      } else {
        console.log("Unrecognized initialImage type:", typeof initialImage);
      }
    }
  }, [initialImage]);

  // When the image or cropper ref changes, recalculate scale and position
  useEffect(() => {
    if (image && imageRef.current && cropperRef.current) {
      console.log("Image or cropper ref changed, recalculating");
      calculateMinimumScale(imageRef.current.width, imageRef.current.height);
    }
  }, [image, cropperRef.current]);

  // Handle drag start
  const handleDragStart = (e) => {
    if (isCropped) return; // Don't allow dragging after cropping
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropPosition.x,
      y: e.clientY - cropPosition.y
    });
  };


  // Handle drag
  const handleDrag = (e) => {
    if (isCropped || !isDragging || !imageRef.current || !cropperRef.current) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Apply constraints to keep the image covering the circle
    const constrainedPosition = constrainPosition(newX, newY);
    setCropPosition(constrainedPosition);
  };

  // COMPLETELY REWRITTEN: Constrain the position to keep the image covering the circle
  const constrainPosition = (x, y) => {
    if (!imageRef.current || !cropperRef.current || !viewingWindowRef.current) {
      return { x, y };
    }
    
    const cropperSize = cropperRef.current.offsetWidth;
    const viewingWindowWidth = viewingWindowRef.current.offsetWidth;
    const viewingWindowHeight = viewingWindowRef.current.offsetHeight;
    const scaledWidth = imageRef.current.width * scale;
    const scaledHeight = imageRef.current.height * scale;
    
    // Calculate the margins between the circle and the viewport
    const horizontalMargin = (viewingWindowWidth - cropperSize) / 2;
    const verticalMargin = (viewingWindowHeight - cropperSize) / 2;
    
    console.log("Constraining position:", {
      proposedPosition: { x, y },
      scaledWidth,
      scaledHeight,
      cropperSize,
      margins: { horizontal: horizontalMargin, vertical: verticalMargin }
    });
    
    // Calculate the maximum allowed positions to ensure the image covers the circle
    let constrainedX = x;
    let constrainedY = y;
    
    // Right edge constraint - don't allow empty space on the right
    // Add the horizontal margin to account for the shifted position
    if (x + scaledWidth < cropperSize + horizontalMargin) {
      constrainedX = cropperSize + horizontalMargin - scaledWidth;
    }
    
    // Left edge constraint - don't allow empty space on the left
    // Add the horizontal margin to account for the shifted position
    if (x > horizontalMargin) {
      constrainedX = horizontalMargin;
    }
    
    // Bottom edge constraint - don't allow empty space at the bottom
    // Add the vertical margin to account for the shifted position
    if (y + scaledHeight < cropperSize + verticalMargin) {
      constrainedY = cropperSize + verticalMargin - scaledHeight;
    }
    
    // Top edge constraint - don't allow empty space at the top
    // Add the vertical margin to account for the shifted position
    if (y > verticalMargin) {
      constrainedY = verticalMargin;
    }
    
    console.log("Constraint results:", {
      original: { x, y },
      constrained: { x: constrainedX, y: constrainedY },
      changed: (constrainedX !== x || constrainedY !== y)
    });
    
    return { x: constrainedX, y: constrainedY };
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // REWRITTEN: Handle zoom
  const handleZoom = (e) => {
    const newScale = parseFloat(e.target.value);
    console.log("Zoom changed to:", newScale);
    
    // Apply the new scale
    setScale(newScale);
    
    // Recalculate position with the new scale
    if (imageRef.current && cropperRef.current) {
      const cropperSize = cropperRef.current.offsetWidth;
      const imageWidth = imageRef.current.width;
      const imageHeight = imageRef.current.height;
      
      // Calculate the new scaled dimensions
      const scaledWidth = imageWidth * newScale;
      const scaledHeight = imageHeight * newScale;
      
      // Calculate position to keep the image centered in the cropper
      const x = (cropperSize - scaledWidth) / 2;
      const y = (cropperSize - scaledHeight) / 2;
      
      // Apply constraints to ensure the image covers the circle
      const constrainedPosition = constrainPosition(x, y);
      
      console.log("Zoom position adjustment:", {
        oldPosition: cropPosition,
        calculatedNewPosition: { x, y },
        constrainedPosition
      });
      
      setCropPosition(constrainedPosition);
    }
  };

  // Crop the image
  const cropImage = () => {
    console.log("Cropping image");
    if (!image || !imageRef.current || !cropperRef.current || !imageElement) {
      console.log("Missing required refs for cropping");
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cropperSize = cropperRef.current.offsetWidth;
    
    // Set canvas size for the output (200x200 is our target size)
    canvas.width = 200;
    canvas.height = 200;
    
    // Get the display size of the image in the DOM
    const displayWidth = imageRef.current.width;
    const displayHeight = imageRef.current.height;
    
    // Get the original image size
    const originalWidth = imageElement.naturalWidth;
    const originalHeight = imageElement.naturalHeight;
    
    console.log("Image dimensions for cropping:", {
      display: { width: displayWidth, height: displayHeight },
      original: { width: originalWidth, height: originalHeight },
      scale,
      position: cropPosition
    });
    
    // Calculate the ratio between original and displayed sizes
    const widthRatio = originalWidth / displayWidth;
    const heightRatio = originalHeight / displayHeight;
    
    // Calculate the center of the crop circle
    const cropCenterX = cropperSize / 2;
    const cropCenterY = cropperSize / 2;
    
    // Calculate the top-left corner of the displayed image relative to the cropper
    const imageLeft = cropPosition.x;
    const imageTop = cropPosition.y;
    
    // Calculate where the center of the crop circle is on the original image
    const sourceCenterX = (cropCenterX - imageLeft) * widthRatio / scale;
    const sourceCenterY = (cropCenterY - imageTop) * heightRatio / scale;
    
    // Calculate the size of the crop area on the original image
    const sourceRadius = (cropperSize / 2) * widthRatio / scale;
    
    // Calculate the source rectangle (the area to crop from the original image)
    const sourceX = sourceCenterX - sourceRadius;
    const sourceY = sourceCenterY - sourceRadius;
    const sourceSize = sourceRadius * 2;
    
    console.log("Crop calculations:", {
      cropCenterX,
      cropCenterY,
      imageLeft,
      imageTop,
      sourceCenterX,
      sourceCenterY,
      sourceRadius,
      sourceX,
      sourceY,
      sourceSize
    });
    
    // Draw the cropped portion onto the canvas
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip(); // This makes the canvas circular
    
    ctx.drawImage(
      imageElement,
      sourceX, sourceY,
      sourceSize, sourceSize,
      0, 0,
      canvas.width, canvas.height
    );
    
    const croppedDataUrl = canvas.toDataURL('image/png');
    setCroppedImage(croppedDataUrl);
    setIsCropped(true);
    console.log("Image cropped successfully");
    
    // Convert data URL to File object for parent component
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Failed to create blob from canvas");
        return;
      }
      
      const file = new File([blob], 'profile-picture.png', { type: 'image/png' });
      console.log("Created cropped image file:", file);
      
      // Store the file for later use when saving
      setCroppedImageFile(file);
    }, 'image/png', 0.95);
  };

  // State to store the cropped image as a File object
  const [croppedImageFile, setCroppedImageFile] = useState(null);

  const handleSaveProfilePicture = () => {
    console.log("Save as profile picture clicked");
    if (onCropComplete && croppedImage && croppedImageFile) {
      onCropComplete(croppedImage, croppedImageFile);
    }
  };

  const handleCancel = () => {
    console.log("Cancel button clicked");
    if (onCancel) {
      onCancel();
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Log that the component is mounted
    console.log("ImageCropper component mounted");
    
    return () => {
      document.body.style.overflow = 'auto';
      console.log("ImageCropper component unmounted");
    };
  }, []);

  // Modal styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  };

  const modalContentStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : 'white',
    color: isDarkMode ? '#f3f4f6' : '#111827',
    borderRadius: '8px',
    boxShadow: isDarkMode 
      ? '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.4)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    padding: '24px',
    maxWidth: '90%',
    width: '400px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: isDarkMode ? '#f3f4f6' : '#111827',
    textAlign: 'center'
  };

  const fileInputStyle = {
    marginBottom: '16px',
    display: 'block',
    width: '100%'
  };

  const flexContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  };

  // Viewing window that contains the image and cropping circle
  const viewingWindowStyle = {
    position: 'relative',
    width: '300px',
    height: '300px',
    backgroundColor: isDarkMode ? '#111827' : '#f3f4f6',
    borderRadius: '8px',
    overflow: 'hidden',
    margin: '0 auto'
  };

  // Overlay that darkens the area between the circle and window edges
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none'
  };

  // Cropper circle that shows the area to be cropped
  const cropperContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '260px',
    height: '260px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: `2px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    zIndex: 3
  };

  // Style for the cropped image display
  const croppedImageContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: `2px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    zIndex: 3
  };

  const croppedImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const zoomContainerStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '24px'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    justifyContent: 'center'
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '16px',
    transition: 'background-color 0.2s'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#10b981',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6b7280',
    color: 'white'
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: 'white'
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={headingStyle}>
          {isCropped ? 'Your new profile picture' : 'Profile Picture Cropper'}
        </h2>
        
        <div>
          {!initialImage && (
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              style={fileInputStyle}
            />
          )}
          
          {image ? (
            <div style={flexContainerStyle}>
              {/* Viewing window containing the image and cropping circle */}
              <div 
                ref={viewingWindowRef}
                style={viewingWindowStyle}
                onMouseDown={handleDragStart}
                onMouseMove={handleDrag}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                {!isCropped ? (
                  <>
                    {/* The image that can be dragged and zoomed */}
                    <img
                      ref={imageRef}
                      src={image}
                      alt="Upload"
                      className="transform-gpu"
                      style={{
                        position: 'absolute',
                        transform: `scale(${scale})`,
                        left: `${cropPosition.x}px`,
                        top: `${cropPosition.y}px`,
                        transformOrigin: 'top left',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        zIndex: 1
                      }}
                      onDragStart={(e) => e.preventDefault()}
                      onLoad={() => {
                        console.log("Image onLoad triggered");
                        if (imageRef.current) {
                          calculateMinimumScale(imageRef.current.width, imageRef.current.height);
                        }
                      }}
                    />
                    
                    {/* Overlay that darkens the area between the circle and window edges */}
                    <div style={overlayStyle}>
                      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                        <defs>
                          <mask id={maskId}>
                            <rect width="100%" height="100%" fill="white" />
                            <circle cx="50%" cy="50%" r="130" fill="black" />
                          </mask>
                        </defs>
                        <rect 
                          width="100%" 
                          height="100%" 
                          fill={isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)'} 
                          mask={`url(#${maskId})`} 
                        />
                      </svg>
                    </div>
                    
                    {/* Cropper circle that shows the area to be cropped */}
                    <div 
                      ref={cropperRef}
                      style={cropperContainerStyle}
                    >
                      {/* This is just a container for the circle, the image is behind it */}
                    </div>
                    
                    {/* Debug overlay to show image boundaries */}
                    <div style={{
                      position: 'absolute',
                      border: '2px',
                      width: `${imageRef.current ? imageRef.current.width * scale : 0}px`,
                      height: `${imageRef.current ? imageRef.current.height * scale : 0}px`,
                      left: `${cropPosition.x}px`,
                      top: `${cropPosition.y}px`,
                      zIndex: 4,
                      pointerEvents: 'none',
                      opacity: 0.3
                    }}></div>
                  </>
                ) : (
                  // Show the cropped image when cropping is complete
                  <div style={croppedImageContainerStyle}>
                    <img 
                      src={croppedImage} 
                      alt="Cropped" 
                      style={croppedImageStyle}
                    />
                  </div>
                )}
              </div>
              
              {/* Show zoom controls only before cropping */}
              {!isCropped && (
                <div style={zoomContainerStyle}>
                  <span style={{ fontSize: '14px', color: isDarkMode ? '#d1d5db' : '#4b5563' }}>Zoom:</span>
                  <input
                    type="range"
                    min={minScale}
                    max=".5"
                    step="0.005"
                    value={scale}
                    onChange={handleZoom}
                    style={{ 
                      width: '100%',
                      accentColor: isDarkMode ? '#10b981' : '#10b981'
                    }}
                  />
                </div>
              )}
              
              <div style={buttonContainerStyle}>
                {!isCropped ? (
                  // Show Crop Image and Cancel buttons before cropping
                  <>
                    <button
                      onClick={cropImage}
                      style={primaryButtonStyle}
                    >
                      Crop Image
                    </button>
                    
                    <button
                      onClick={handleCancel}
                      style={secondaryButtonStyle}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  // Show Save as Profile Picture and Cancel buttons after cropping
                  <>
                    <button
                      onClick={handleSaveProfilePicture}
                      style={saveButtonStyle}
                    >
                      Save as Profile Picture
                    </button>
                    
                    <button
                      onClick={handleCancel}
                      style={secondaryButtonStyle}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Loading image...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureCropper;