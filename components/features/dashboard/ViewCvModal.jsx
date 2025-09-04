'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ViewCvModal({ cvPath, open, onOpenChange }) {
  if (!cvPath) return null;

  const isPdf = cvPath.toLowerCase().endsWith('.pdf');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = cvPath.substring(cvPath.lastIndexOf('/') + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>View CV</DialogTitle>
          <DialogDescription>Viewing document: {cvPath.substring(cvPath.lastIndexOf('/') + 1)}</DialogDescription>
        </DialogHeader>
        <div className="h-full w-full py-4">
          {isPdf ? (
            <iframe src={cvPath} className="h-full w-full border rounded-md" title="CV Viewer" />
          ) : (
            <img src={cvPath} alt="CV" className="max-h-full max-w-full object-contain mx-auto" />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
