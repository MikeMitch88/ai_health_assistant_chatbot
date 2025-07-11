import React from 'react';
import { Download, FileText, Share2 } from 'lucide-react';
import { PDFExporter } from '../utils/pdfExport';
import { Message, Symptom, ConversationContext } from '../types/medical';

interface ExportSummaryProps {
  messages: Message[];
  symptoms: Symptom[];
  context: ConversationContext;
}

export const ExportSummary: React.FC<ExportSummaryProps> = ({
  messages,
  symptoms,
  context
}) => {
  const handleExportSummary = () => {
    PDFExporter.downloadSummary(messages, symptoms, context);
  };

  const handleShareSummary = async () => {
    const summaryText = PDFExporter.generateSummaryText(messages, symptoms, context);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Health Consultation Summary',
          text: summaryText.substring(0, 500) + '...',
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(summaryText);
        alert('Summary copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(summaryText);
      alert('Summary copied to clipboard!');
    }
  };

  if (messages.length < 3) return null; // Don't show until there's meaningful conversation

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Export Consultation</h3>
        <FileText className="w-5 h-5 text-blue-500" />
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Export your consultation summary to share with your healthcare provider.
      </p>

      <div className="space-y-3">
        <button
          onClick={handleExportSummary}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Summary
        </button>
        
        <button
          onClick={handleShareSummary}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Summary
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Privacy Note:</strong> Your consultation data is processed locally and not stored on our servers. 
          The exported summary contains only the information you've shared during this session.
        </p>
      </div>
    </div>
  );
};