import { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { Camera, QrCode, RefreshCw } from 'lucide-react';

interface QRScannerProps {
  onResult: (result: string) => void;
  onError: (error: string) => void;
  isActive: boolean;
}

export const QRScanner = ({ onResult, onError, isActive }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const initializeScanner = async () => {
      if (!videoRef.current || !isActive) return;

      try {
        // Check if camera is available
        const hasCamera = await QrScanner.hasCamera();
        setHasCamera(hasCamera);

        if (!hasCamera) {
          setCameraError('No camera found on this device');
          onError('No camera found on this device');
          return;
        }

        // Create QR scanner instance
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            console.log('QR Code detected:', result.data);
            onResult(result.data);
          },
          {
            onDecodeError: (error) => {
              // Don't show decode errors as they're normal during scanning
              console.log('Decode attempt:', error);
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // Use back camera on mobile
          }
        );

        // Start scanning
        await qrScannerRef.current.start();
        setCameraError(null);

      } catch (error) {
        console.error('Failed to initialize QR scanner:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to access camera';
        setCameraError(errorMessage);
        onError(errorMessage);
      }
    };

    initializeScanner();

    // Cleanup function
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, [isActive, onResult, onError]);

  const handleRetryCamera = async () => {
    setCameraError(null);
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.start();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to restart camera';
        setCameraError(errorMessage);
        onError(errorMessage);
      }
    }
  };

  if (!isActive) {
    return (
      <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 border-4 border-dashed border-primary rounded-lg flex items-center justify-center mx-auto">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Ready to scan QR code
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-square bg-black rounded-lg overflow-hidden relative">
      {cameraError ? (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center space-y-4 p-4">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">{cameraError}</p>
            <Button
              onClick={handleRetryCamera}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          
          {/* Scanning overlay */}
          <div className="absolute inset-4 border-2 border-primary rounded-lg">
            <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-primary rounded-br-lg"></div>
          </div>

          {/* Scanning line animation */}
          <div className="absolute inset-4 pointer-events-none">
            <div className="w-full h-0.5 bg-primary animate-pulse opacity-75 absolute top-1/2 transform -translate-y-1/2"></div>
          </div>

          {/* Instructions overlay */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Position QR code within the frame
            </div>
          </div>
        </>
      )}
    </div>
  );
};