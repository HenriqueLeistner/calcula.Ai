import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

interface FileTransferProps {
  onExport: () => Promise<string>;
  onImport: (data: string) => Promise<void>;
}

export default function FileTransfer({ onExport, onImport }: FileTransferProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const data = await onExport();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seu-financas-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar dados');
    }
  };

  const handleImport = async () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await onImport(text);
      alert('Dados importados com sucesso!');
    } catch (error) {
      console.error('Erro ao importar:', error);
      alert('Erro ao importar dados. Verifique o arquivo.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button onClick={handleExport} variant="outline" size="sm" data-testid="button-export">
        <Download className="w-4 h-4 mr-2" />
        Exportar
      </Button>
      <Button onClick={handleImport} variant="outline" size="sm" data-testid="button-import">
        <Upload className="w-4 h-4 mr-2" />
        Importar
      </Button>
    </div>
  );
}
