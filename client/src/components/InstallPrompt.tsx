import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-card border rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Instalar Aplicativo</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Adicione à tela inicial para acesso rápido e uso offline
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm" data-testid="button-install-app">
                <Download className="w-4 h-4 mr-2" />
                Instalar
              </Button>
              <Button onClick={() => setShowPrompt(false)} variant="outline" size="sm" data-testid="button-dismiss">
                Agora não
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPrompt(false)}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
