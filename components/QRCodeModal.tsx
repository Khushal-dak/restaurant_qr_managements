import React, { useState } from 'react';
import { X, Wifi, Link as LinkIcon } from 'lucide-react';
import { Table } from '../types';
import Button from './ui/Button';

interface QRCodeModalProps {
  table: Table | null;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ table, onClose }) => {
  const [localIp, setLocalIp] = useState('192.168.1.X');
  
  if (!table) return null;

  const origin = window.location.origin;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  let baseUrl = origin;
  if (isLocalhost) {
    const port = window.location.port;
    baseUrl = `http://${localIp}:${port || '80'}`;
  }
  
  const menuUrl = `${baseUrl}/#/m/${table.qrSlug}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md relative transform transition-all" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" className="absolute top-3 right-3 p-1" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-dark">QR Code for Table {table.number}</h2>
          <p className="text-neutral mt-1">Scan this with your mobile device to view the menu.</p>
        </div>
        
        <div className="my-6 flex justify-center">
            <img src={qrApiUrl} alt={`QR Code for Table ${table.number}`} className="rounded-lg shadow-md" width="300" height="300" />
        </div>

        {isLocalhost && (
             <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md text-sm">
                <h4 className="font-bold flex items-center gap-2"><Wifi size={18}/> Testing on Mobile?</h4>
                <p className="mt-2">Your app is running on localhost. To test on your phone:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Connect your phone to the same Wi-Fi as this computer.</li>
                    <li>Find this computer's Local IP address (e.g., in network settings).</li>
                    <li>Enter the IP address below to update the QR code:</li>
                </ol>
                <input 
                    type="text"
                    value={localIp}
                    onChange={(e) => setLocalIp(e.target.value)}
                    className="mt-2 w-full px-2 py-1 border border-yellow-400 rounded-md bg-white text-yellow-900"
                    placeholder="e.g., 192.168.1.5"
                />
            </div>
        )}

        <div className="mt-4 text-center">
            <p className="text-xs text-neutral flex items-center justify-center gap-2 break-all"><LinkIcon size={14}/> {menuUrl}</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
