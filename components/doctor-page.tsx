'use client';

import { format } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle,
  Filter,
  Menu,
  Moon,
  Phone,
  Search,
  Sun,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
// Add these imports at the top of the file
import { TooltipContent, TooltipProvider } from '@radix-ui/react-tooltip';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { Tooltip, TooltipTrigger } from './ui/tooltip';

// Sample data for reports
const sampleReports = [
  {
    id: 1,
    type: 'illness',
    fullName: 'John Smith',
    ahvNumber: '756.1234.5678.90',
    urgency: 'high (immediate)',
    summary:
      'Patient reports severe abdominal pain with fever and vomiting for the past 12 hours. No improvement with over-the-counter medication.',
    symptoms: 'abdominal pain, fever, vomiting',
    suggestedMedicaments: 'Antiemetic, pain relief',
    suggestedTreatment:
      'Immediate evaluation for appendicitis or other acute abdominal conditions.',
    painLevel: '8',
    createdAt: '2023-04-24T08:30:00',
  },
  {
    id: 2,
    type: 'illness',
    fullName: 'Emma Johnson',
    ahvNumber: '756.9876.5432.10',
    urgency: 'medium (within 24h)',
    summary:
      'Patient reports sharp chest pain when coughing and a metallic smell since yesterday, with no other symptoms reported.',
    symptoms: 'chest pain, metallic smell',
    suggestedMedicaments: 'null',
    suggestedTreatment:
      'Further examination and potential chest X-ray to rule out respiratory issues.',
    painLevel: '5',
    createdAt: '2023-04-23T14:15:00',
  },
  {
    id: 3,
    type: 'follow-up',
    fullName: 'Michael Brown',
    ahvNumber: '756.2468.1357.90',
    urgency: 'low (routine)',
    summary:
      'Follow-up appointment for diabetes management. Patient reports stable blood sugar levels with current medication regimen.',
    symptoms: 'none reported',
    suggestedMedicaments: 'Continue current diabetes medication',
    suggestedTreatment: 'Regular monitoring and lifestyle counseling.',
    painLevel: '0',
    createdAt: '2023-04-22T10:45:00',
  },
  {
    id: 4,
    type: 'illness',
    fullName: 'Sophia Garcia',
    ahvNumber: '756.1357.2468.90',
    urgency: 'medium (within 24h)',
    summary:
      'Patient reports persistent headache for 3 days with sensitivity to light. No fever or other symptoms noted.',
    symptoms: 'headache, photosensitivity',
    suggestedMedicaments: 'Analgesics',
    suggestedTreatment: 'Evaluation for migraine or tension headache.',
    painLevel: '6',
    createdAt: '2023-04-21T16:20:00',
  },
  {
    id: 5,
    type: 'emergency',
    fullName: 'William Taylor',
    ahvNumber: '756.8642.9753.10',
    urgency: 'high (immediate)',
    summary:
      'Patient experienced syncope episode while exercising. Reports dizziness and palpitations before the event.',
    symptoms: 'syncope, dizziness, palpitations',
    suggestedMedicaments: 'null',
    suggestedTreatment:
      'Immediate cardiac evaluation including ECG and cardiac enzymes.',
    painLevel: '7',
    createdAt: '2023-04-20T09:10:00',
  },
];

// Urgency badge color mapping
const urgencyColors = {
  'high (immediate)': 'destructive',
  'medium (within 24h)': 'yellow',
  'low (routine)': 'green',
};

export default function DoctorDashboard({
  initialReports,
}: {
  initialReports: {
    id: string;
    type: string;
    fullName: string;
    ahvNumber: string;
    urgency: string;
    summary: string;
    symptoms: string;
    suggestedMedicaments: string;
    suggestedTreatment: string;
    painLevel: string;
    userId: string;
    createdAt: Date;
  }[];
}) {
  const allReports = [...sampleReports, ...initialReports].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return dateB.getTime() - dateA.getTime();
  });
  const [reports, _] = useState(allReports);
  const [selectedReport, setSelectedReport] = useState(allReports[0]);
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter reports based on urgency, date, and search query
  const filteredReports = reports.filter((report) => {
    // Filter by urgency
    if (urgencyFilter !== 'all' && report.urgency !== urgencyFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.fullName.toLowerCase().includes(query) ||
        report.summary.toLowerCase().includes(query) ||
        report.symptoms.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="flex h-[100vdh] bg-background">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-20 w-[350px] border-r bg-background flex flex-col h-[100vdh]
          transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}  
          md:static md:translate-x-0                        
        `}
      >
        <div className="w-[350px] border-r flex flex-col h-[100vdh]">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Patient Reports</h2>

              {/* Dark mode toggle button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() =>
                        setTheme(theme === 'dark' ? 'light' : 'dark')
                      }
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      aria-label="Toggle dark mode"
                    >
                      {mounted ? (
                        theme === 'dark' ? (
                          <Sun className="size-4" />
                        ) : (
                          <Moon className="size-4" />
                        )
                      ) : (
                        // Render an empty placeholder during server-side rendering
                        <div className="size-4" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    className="bg-secondary text-secondary-foreground px-3 py-1.5 text-xs rounded-md border shadow-md z-20"
                  >
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters</span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="urgency-filter">Urgency</Label>
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger id="urgency-filter">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All urgencies</SelectItem>
                    <SelectItem value="high (immediate)">
                      High (immediate)
                    </SelectItem>
                    <SelectItem value="medium (within 24h)">
                      Medium (within 24h)
                    </SelectItem>
                    <SelectItem value="low (routine)">Low (routine)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Report list */}
          <div className="flex-1 overflow-auto">
            {filteredReports.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No reports match your filters
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={cn(
                    'p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors',
                    selectedReport.id === report.id ? 'bg-muted' : '',
                  )}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{report.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(report.createdAt), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <Badge
                    variant={
                      (urgencyColors[
                        report.urgency as keyof typeof urgencyColors
                      ] as any) || 'default'
                    }
                    className="mb-1"
                  >
                    {report.urgency}
                  </Badge>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {report.summary}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* backdrop when open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            {/* Hamburger (mobile only) */}
            <button
              type="button"
              className="p-2 rounded-md hover:bg-muted transition-colors md:hidden"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <Menu className="size-6" />
            </button>

            <h1 className="text-2xl font-bold">Patient Report</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant={
                      (urgencyColors[
                        selectedReport.urgency as keyof typeof urgencyColors
                      ] as any) || 'default'
                    }
                    className="text-sm"
                  >
                    {selectedReport.urgency}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  className="bg-secondary text-secondary-foreground px-3 py-1.5 text-xs rounded-md border shadow-md"
                >
                  AI-estimated urgency level
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Patient Name
              </h3>
              <p className="font-medium">{selectedReport.fullName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                AHV Number
              </h3>
              <p className="font-medium">{selectedReport.ahvNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Pain Level (1-10)
              </h3>
              <p className="font-medium capitalize">
                {selectedReport.painLevel}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Created At
              </h3>
              <p className="font-medium">
                {format(new Date(selectedReport.createdAt), "PPP 'at' HH:mm")}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-muted-foreground">{selectedReport.summary}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {selectedReport.symptoms.split(',').map((symptom) => {
                  const trimmedSymptom = symptom.trim();
                  return (
                    <Badge
                      key={trimmedSymptom}
                      variant="outline"
                      className="bg-muted"
                    >
                      {trimmedSymptom}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Regulatory notice with enhanced styling */}
            <div className="border-2 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-4 my-6 flex items-start gap-3">
              <AlertTriangle className="size-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-yellow-800 dark:text-yellow-400 mb-0.5">
                  Regulatory Notice
                </p>
                <p>
                  This tool is intended to be used only by licensed healthcare
                  professionals to assist in the first contact with the
                  patience, doing an anamnesis and summarising symptoms. This
                  tool do not provide any kind of diagnosis and do not suggest
                  or prescribe medicaments and treatments. The diagnosis will
                  always has to be made by the healthcare professionals.
                </p>
              </div>
            </div>

            {/* Uncomment this section if you want to show suggested medicaments and treatment */}

            {/* <div>
              <h3 className="text-lg font-semibold mb-2">
                Suggested Medicaments
                <InfoIcon />
              </h3>
              <p className="text-muted-foreground">
                {selectedReport.suggestedMedicaments === 'null'
                  ? 'None suggested'
                  : selectedReport.suggestedMedicaments}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Suggested Treatment
              </h3>
              <p className="text-muted-foreground">
                {selectedReport.suggestedTreatment}
              </p>
            </div> */}
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => {
                toast.success('Appointment scheduled', {
                  description: `Appointment for ${selectedReport.fullName} has been scheduled.`,
                  icon: <CheckCircle className="size-4 text-green-500" />,
                  duration: 3000,
                });
              }}
            >
              Schedule Appointment
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.info('Contacting patient...', {
                  duration: 3000,
                  icon: '👮',
                });

                window.location.href = 'tel:117';
              }}
            >
              <Phone className="size-4 mr-2" />
              Contact Patient
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
