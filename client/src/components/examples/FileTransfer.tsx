import FileTransfer from '../FileTransfer';

export default function FileTransferExample() {
  const mockExport = async () => {
    return JSON.stringify({ transactions: [], categories: [] }, null, 2);
  };

  const mockImport = async (data: string) => {
    console.log('Import data:', data);
  };

  return (
    <div className="p-4">
      <FileTransfer onExport={mockExport} onImport={mockImport} />
    </div>
  );
}
