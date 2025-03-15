import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, FolderTree, Cloud, Code, Database, LineChart, Puzzle, Server, Calendar, Zap, Award, Building, TrendingUp, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

type StatusType = 'complete' | 'in-progress' | 'pending';

type ModuleItem = {
  name: string;
  status: StatusType;
  weekPlanned?: number; // Week when this task is planned
  weekCompleted?: number; // Week when this task was completed
};

type Module = {
  name: string;
  icon: React.ReactNode;
  items: ModuleItem[];
};

type Phase = {
  name: string;
  icon: React.ReactNode;
  startWeek: number;
  endWeek: number;
  dates: string;
  items: ModuleItem[];
};

type WeeklyTask = {
  name: string;
  module: string;
  status: StatusType;
};

const StatusDashboard = () => {
  // Week tracking state
  const [currentWeek, setCurrentWeek] = useState(3); // Start at week 3
  const projectStartDate = new Date('2025-03-01');
  
  // Calculate current date based on week
  const getCurrentDate = () => {
    const date = new Date(projectStartDate);
    date.setDate(date.getDate() + (currentWeek - 1) * 7);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const StatusIcon = ({ status }: { status: StatusType }) => {
    switch(status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Circle className="h-4 w-4 text-blue-500 fill-blue-200" />;
      default:
        return <Circle className="h-4 w-4 text-gray-300" />;
    }
  };

  const featureModules: Module[] = [
    {
      name: 'Core Intelligence Layer',
      icon: <Zap className="h-5 w-5" />,
      items: [
        { name: 'Universal Analytics Engine (initial implementation)', status: 'complete', weekPlanned: 1, weekCompleted: 2 },
        { name: 'Data Normalization Framework (basic structure)', status: 'complete', weekPlanned: 1, weekCompleted: 2 },
        { name: 'Carbon Calculation Module', status: 'in-progress', weekPlanned: 3, weekCompleted: undefined },
        { name: 'Cost Calculation Module', status: 'pending', weekPlanned: 4, weekCompleted: undefined },
        { name: 'Incentive Optimization Engine', status: 'pending', weekPlanned: 7, weekCompleted: undefined },
        { name: 'Compliance & Reporting System', status: 'pending', weekPlanned: 8, weekCompleted: undefined },
        { name: 'Anomaly Detection System', status: 'pending', weekPlanned: 7, weekCompleted: undefined },
        { name: 'Pattern Recognition Engine', status: 'pending', weekPlanned: 8, weekCompleted: undefined },
        { name: 'Predictive Analytics Module', status: 'pending', weekPlanned: 9, weekCompleted: undefined },
        { name: 'LLM Integration for Insights', status: 'pending', weekPlanned: 8, weekCompleted: undefined }
      ]
    },
    {
      name: 'Dashboard & Visualization',
      icon: <LineChart className="h-5 w-5" />,
      items: [
        { name: 'Main Layout & Navigation', status: 'complete', weekPlanned: 1, weekCompleted: 1 },
        { name: 'Time Period Selector (24h/7d/30d)', status: 'complete', weekPlanned: 2, weekCompleted: 2 },
        { name: 'Consumption Trend Charts (basic implementation)', status: 'complete', weekPlanned: 2, weekCompleted: 2 },
        { name: 'Building Overview Cards (basic implementation)', status: 'complete', weekPlanned: 2, weekCompleted: 2 },
        { name: 'Loading States & Error Handling', status: 'in-progress', weekPlanned: 3, weekCompleted: undefined },
        { name: 'Metric Comparison Views', status: 'pending', weekPlanned: 4, weekCompleted: undefined },
        { name: 'Facility Benchmarking', status: 'pending', weekPlanned: 6, weekCompleted: undefined },
        { name: 'Carbon/Cost Visualization', status: 'pending', weekPlanned: 4, weekCompleted: undefined },
        { name: 'Interactive Drilldowns', status: 'pending', weekPlanned: 5, weekCompleted: undefined }
      ]
    },
    {
      name: 'Data Input Methods',
      icon: <Database className="h-5 w-5" />,
      items: [
        { name: 'Manual Data Entry', status: 'complete', weekPlanned: 1, weekCompleted: 2 },
        { name: 'Excel File Upload (Basic)', status: 'complete', weekPlanned: 2, weekCompleted: 2 },
        { name: 'Excel Processor for TH-E-01', status: 'in-progress', weekPlanned: 3, weekCompleted: undefined },
        { name: 'Data Validation', status: 'in-progress', weekPlanned: 3, weekCompleted: undefined },
        { name: 'Multi-Utility File Processor', status: 'pending', weekPlanned: 5, weekCompleted: undefined },
        { name: 'API Integration Framework', status: 'pending', weekPlanned: 6, weekCompleted: undefined },
        { name: 'BMS Connector', status: 'pending', weekPlanned: 5, weekCompleted: undefined },
        { name: 'Scheduling System Connector', status: 'pending', weekPlanned: 7, weekCompleted: undefined },
        { name: 'Bulk Import Tools', status: 'pending', weekPlanned: 7, weekCompleted: undefined }
      ]
    },
    {
      name: 'Core Infrastructure',
      icon: <Puzzle className="h-5 w-5" />,
      items: [
        { name: 'Next.js Framework Setup', status: 'complete', weekPlanned: 1, weekCompleted: 1 },
        { name: 'TypeScript Configuration', status: 'complete', weekPlanned: 1, weekCompleted: 1 },
        { name: 'Supabase Database Integration', status: 'complete', weekPlanned: 1, weekCompleted: 2 },
        { name: 'UI Component Library', status: 'complete', weekPlanned: 1, weekCompleted: 1 },
        { name: 'Error Boundaries & Error Handling', status: 'complete', weekPlanned: 2, weekCompleted: 2 },
        { name: 'Authentication System', status: 'pending', weekPlanned: 8, weekCompleted: undefined },
        { name: 'Role-Based Access Control', status: 'pending', weekPlanned: 9, weekCompleted: undefined },
        { name: 'Logging & Analytics', status: 'pending', weekPlanned: 8, weekCompleted: undefined }
      ]
    }
  ];

  const roadmapSchedule: Phase[] = [
    {
      name: 'Phase 1: Foundation',
      icon: <Calendar className="h-5 w-5" />,
      startWeek: 1,
      endWeek: 2,
      dates: 'Mar 1 - Mar 14, 2025',
      items: [
        { name: 'Project Setup & Infrastructure', status: 'complete', weekPlanned: 1, weekCompleted: 1 },
        { name: 'Database Schema Design', status: 'complete', weekPlanned: 1, weekCompleted: 1 },
        { name: 'Core UI Components', status: 'complete', weekPlanned: 1, weekCompleted: 2 },
        { name: 'Manual Data Entry Form', status: 'complete', weekPlanned: 2, weekCompleted: 2 },
        { name: 'Basic File Upload Structure', status: 'complete', weekPlanned: 2, weekCompleted: 2 },
        { name: 'Initial Dashboard Layout', status: 'complete', weekPlanned: 2, weekCompleted: 2 }
      ]
    },
    {
      name: 'Phase 2: Talbot House Electricity Tracking',
      icon: <Calendar className="h-5 w-5" />,
      startWeek: 3,
      endWeek: 4,
      dates: 'Mar 15 - Mar 28, 2025',
      items: [
        { name: 'Excel Processor for TH-E-01', status: 'in-progress', weekPlanned: 3, weekCompleted: undefined },
        { name: 'Basic Trend Visualization', status: 'in-progress', weekPlanned: 3, weekCompleted: undefined },
        { name: 'Time Period Selection', status: 'complete', weekPlanned: 3, weekCompleted: 2 },
        { name: 'Simple Carbon Calculation', status: 'in-progress', weekPlanned: 3, weekCompleted: undefined },
        { name: 'Basic Cost Calculation', status: 'pending', weekPlanned: 4, weekCompleted: undefined },
        { name: 'Consumption Analytics', status: 'pending', weekPlanned: 4, weekCompleted: undefined }
      ]
    },
    {
      name: 'Phase 3: Multi-Utility Expansion',
      icon: <Calendar className="h-5 w-5" />,
      startWeek: 5,
      endWeek: 6,
      dates: 'Mar 29 - Apr 11, 2025',
      items: [
        { name: 'Water & Gas Meter Processing', status: 'pending', weekPlanned: 5, weekCompleted: undefined },
        { name: 'Unit Conversion Utilities', status: 'pending', weekPlanned: 5, weekCompleted: undefined },
        { name: 'Pulse Ratio Handling', status: 'pending', weekPlanned: 5, weekCompleted: undefined },
        { name: 'Utility-Specific Analytics', status: 'pending', weekPlanned: 6, weekCompleted: undefined },
        { name: 'Multi-Metric Dashboard', status: 'pending', weekPlanned: 6, weekCompleted: undefined },
        { name: 'Cross-Utility Insights', status: 'pending', weekPlanned: 6, weekCompleted: undefined }
      ]
    },
    {
      name: 'Phase 4: Intelligence Layer',
      icon: <Calendar className="h-5 w-5" />,
      startWeek: 7,
      endWeek: 8,
      dates: 'Apr 12 - Apr 25, 2025',
      items: [
        { name: 'Universal Analytics Engine', status: 'pending', weekPlanned: 7, weekCompleted: undefined },
        { name: 'Pattern Recognition', status: 'pending', weekPlanned: 7, weekCompleted: undefined },
        { name: 'Basic Anomaly Detection', status: 'pending', weekPlanned: 7, weekCompleted: undefined },
        { name: 'LLM Integration for Insights', status: 'pending', weekPlanned: 8, weekCompleted: undefined },
        { name: 'Alerts & Notifications', status: 'pending', weekPlanned: 8, weekCompleted: undefined },
        { name: 'Data Export Capabilities', status: 'pending', weekPlanned: 8, weekCompleted: undefined }
      ]
    },
    {
      name: 'Phase 5: Polish & Launch',
      icon: <Calendar className="h-5 w-5" />,
      startWeek: 9,
      endWeek: 10,
      dates: 'Apr 26 - May 10, 2025',
      items: [
        { name: 'User Experience Refinement', status: 'pending', weekPlanned: 9, weekCompleted: undefined },
        { name: 'Performance Optimization', status: 'pending', weekPlanned: 9, weekCompleted: undefined },
        { name: 'Documentation & Help', status: 'pending', weekPlanned: 9, weekCompleted: undefined },
        { name: 'Error Handling Improvements', status: 'pending', weekPlanned: 10, weekCompleted: undefined },
        { name: 'Comprehensive Testing', status: 'pending', weekPlanned: 10, weekCompleted: undefined },
        { name: 'Pilot Deployment', status: 'pending', weekPlanned: 10, weekCompleted: undefined }
      ]
    }
  ];

  const devOpsModules: Module[] = [
    {
      name: 'Version Control & CI/CD',
      icon: <Code className="h-5 w-5" />,
      items: [
        { name: 'GitHub Repository Setup', status: 'complete', weekPlanned: 1, weekCompleted: 1 },
        { name: 'Branch Protection Rules', status: 'in-progress', weekPlanned: 3, weekCompleted: undefined },
        { name: 'Automated Testing Setup', status: 'pending', weekPlanned: 5, weekCompleted: undefined },
        { name: 'Continuous Integration', status: 'pending', weekPlanned: 6, weekCompleted: undefined },
        { name: 'Continuous Deployment', status: 'pending', weekPlanned: 7, weekCompleted: undefined },
        { name: 'Environment Management', status: 'pending', weekPlanned: 8, weekCompleted: undefined }
      ]
    },
    {
      name: 'Deployment & Hosting',
      icon: <Cloud className="h-5 w-5" />,
      items: [
        { name: 'Development Environment', status: 'complete', weekPlanned: 1, weekCompleted: 1 },
        { name: 'Staging Environment', status: 'pending', weekPlanned: 6, weekCompleted: undefined },
        { name: 'Production Environment', status: 'pending', weekPlanned: 9, weekCompleted: undefined },
        { name: 'Database Backups', status: 'pending', weekPlanned: 7, weekCompleted: undefined },
        { name: 'Monitoring & Alerts', status: 'pending', weekPlanned: 8, weekCompleted: undefined },
        { name: 'Performance Optimization', status: 'pending', weekPlanned: 9, weekCompleted: undefined }
      ]
    },
    {
      name: 'Testing & Quality',
      icon: <Award className="h-5 w-5" />,
      items: [
        { name: 'Manual Testing Protocols', status: 'in-progress', weekPlanned: 3, weekCompleted: undefined },
        { name: 'Unit Test Framework', status: 'pending', weekPlanned: 5, weekCompleted: undefined },
        { name: 'Integration Tests', status: 'pending', weekPlanned: 6, weekCompleted: undefined },
        { name: 'End-to-End Tests', status: 'pending', weekPlanned: 8, weekCompleted: undefined },
        { name: 'Performance Testing', status: 'pending', weekPlanned: 9, weekCompleted: undefined },
        { name: 'Security Audit', status: 'pending', weekPlanned: 10, weekCompleted: undefined }
      ]
    },
    {
      name: 'Business & Documentation',
      icon: <Building className="h-5 w-5" />,
      items: [
        { name: 'Market Research', status: 'complete', weekPlanned: 1, weekCompleted: 2 },
        { name: 'Pricing Strategy', status: 'in-progress', weekPlanned: 3, weekCompleted: undefined },
        { name: 'User Documentation', status: 'pending', weekPlanned: 8, weekCompleted: undefined },
        { name: 'API Documentation', status: 'pending', weekPlanned: 9, weekCompleted: undefined },
        { name: 'Demo Environment', status: 'pending', weekPlanned: 9, weekCompleted: undefined },
        { name: 'Case Study Framework', status: 'pending', weekPlanned: 10, weekCompleted: undefined }
      ]
    }
  ];

  // Calculate module completion percentages dynamically based on item status
  const calculateModuleCompletion = (items: ModuleItem[]) => {
    const total = items.length;
    const completed = items.filter(item => item.status === 'complete').length;
    const inProgress = items.filter(item => item.status === 'in-progress').length;
    
    return Math.round((completed + (inProgress * 0.5)) / total * 100);
  };

  // Calculate phase completion percentages dynamically
  const calculatePhaseCompletion = (phase: Phase) => {
    return calculateModuleCompletion(phase.items);
  };
  
  // Get current phase based on week number
  const getCurrentPhase = () => {
    return roadmapSchedule.find(phase => 
      currentWeek >= phase.startWeek && currentWeek <= phase.endWeek
    ) || roadmapSchedule[roadmapSchedule.length - 1];
  };

  // Calculate overall project completion
  const calculateOverallCompletion = () => {
    const allItems = roadmapSchedule.flatMap(phase => phase.items);
    return calculateModuleCompletion(allItems);
  };
  
  const overallCompletion = calculateOverallCompletion();
  const currentPhase = getCurrentPhase();

  // Calculate DevOps completion
  const calculateDevOpsCompletion = () => {
    const allItems = devOpsModules.flatMap(module => module.items);
    return calculateModuleCompletion(allItems);
  };
  
  const devOpsCompletion = calculateDevOpsCompletion();

  // Function to increment the week (for demo/testing)
  const incrementWeek = () => {
    if (currentWeek < 10) {
      setCurrentWeek(prev => prev + 1);
      // In a real implementation, this would also update task statuses
      // based on the new week
    }
  };

  // Function to decrement the week (for demo/testing)
  const decrementWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(prev => prev - 1);
    }
  };
  
  // Get weekly tasks
  const getWeeklyTasks = (week: number): WeeklyTask[] => {
    const tasks: WeeklyTask[] = [];
    
    // Collect tasks from feature modules
    featureModules.forEach(module => {
      module.items.forEach(item => {
        if (item.weekPlanned === week) {
          tasks.push({
            name: item.name,
            module: module.name,
            status: item.status
          });
        }
      });
    });
    
    // Collect tasks from DevOps modules
    devOpsModules.forEach(module => {
      module.items.forEach(item => {
        if (item.weekPlanned === week) {
          tasks.push({
            name: item.name,
            module: module.name,
            status: item.status
          });
        }
      });
    });
    
    return tasks;
  };

  // Modify item status based on whether its planned week matches or precedes current week
  const getAdjustedItemStatus = (item: ModuleItem): StatusType => {
    if (item.status === 'complete') return 'complete';
    if (!item.weekPlanned) return item.status;
    
    if (item.weekPlanned < currentWeek) {
      // If task was planned for earlier week and not completed, mark as in-progress
      return 'in-progress';
    } else if (item.weekPlanned === currentWeek) {
      // If task is planned for current week, it should be in-progress
      return item.status === 'pending' ? 'in-progress' : item.status;
    } else {
      // If task is planned for future week, keep as pending
      return 'pending';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-6 w-6" />
              BU Energy Systems - Project Status
            </CardTitle>
            <div className="text-right">
              <div className="text-2xl font-bold">{overallCompletion}%</div>
              <div className="text-sm text-muted-foreground">Overall Completion</div>
            </div>
          </div>
          <CardDescription className="flex items-center justify-between">
            <span>Updated {getCurrentDate()} | Week {currentWeek} of 10</span>
            <Badge variant={currentPhase ? "outline" : "secondary"} className="ml-2">
              {currentPhase ? currentPhase.name : "Project Complete"}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="week-view">
            <TabsList className="grid grid-cols-5 w-full mb-6">
              <TabsTrigger value="week-view">Weekly View</TabsTrigger>
              <TabsTrigger value="modules">Feature Modules</TabsTrigger>
              <TabsTrigger value="phases">Project Phases</TabsTrigger>
              <TabsTrigger value="devops">DevOps</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="week-view" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Week {currentWeek} Progress</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={decrementWeek}
                    disabled={currentWeek <= 1}
                    className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous Week
                  </button>
                  <button 
                    onClick={incrementWeek}
                    disabled={currentWeek >= 10}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Next Week
                  </button>
                </div>
              </div>
              
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between">
                    <div>Week {currentWeek}: {getCurrentDate()}</div>
                    <Badge variant="outline" className="ml-2">
                      {currentPhase ? currentPhase.name : "Project Complete"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Tasks for This Week</h3>
                      {getWeeklyTasks(currentWeek).length > 0 ? (
                        <ul className="space-y-2">
                          {getWeeklyTasks(currentWeek).map((task, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <StatusIcon status={task.status} />
                              <span className={
                                task.status === 'pending' 
                                  ? 'text-gray-500' 
                                  : task.status === 'in-progress' 
                                    ? 'text-blue-700 font-medium' 
                                    : 'font-medium'
                              }>
                                {task.name}
                              </span>
                              <span className="text-xs text-gray-500">({task.module})</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No tasks scheduled for this week.</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Carried Over Tasks</h3>
                      {(() => {
                        const carriedTasks = [];
                        for (let w = 1; w < currentWeek; w++) {
                          const tasks = getWeeklyTasks(w).filter(t => t.status !== 'complete');
                          carriedTasks.push(...tasks);
                        }
                        
                        return carriedTasks.length > 0 ? (
                          <ul className="space-y-2">
                            {carriedTasks.map((task, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <StatusIcon status={task.status} />
                                <span className="text-amber-700 font-medium">
                                  {task.name}
                                </span>
                                <span className="text-xs text-gray-500">({task.module})</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No carried over tasks.</p>
                        );
                      })()}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Looking Ahead (Week {currentWeek + 1})</h3>
                      {currentWeek < 10 ? (
                        <ul className="space-y-2">
                          {getWeeklyTasks(currentWeek + 1).map((task, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Circle className="h-4 w-4 text-gray-300" />
                              <span className="text-gray-500">{task.name}</span>
                              <span className="text-xs text-gray-400">({task.module})</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Project completion planned for week 10.</p>
                      )}
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md mt-4">
                      <h3 className="font-medium mb-2 text-blue-800">Week {currentWeek} Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-blue-700">Tasks Planned</h4>
                          <div className="text-xl font-bold text-blue-900">{getWeeklyTasks(currentWeek).length}</div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-700">Tasks Completed</h4>
                          <div className="text-xl font-bold text-blue-900">
                            {getWeeklyTasks(currentWeek).filter(t => t.status === 'complete').length}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-700">Overall Progress</h4>
                          <div className="text-xl font-bold text-blue-900">{overallCompletion}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Weekly Progress Tracker */}
                <Card className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Weekly Progress Tracker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({length: 10}, (_, i) => i + 1).map(week => (
                        <div key={week} className="flex items-center gap-2">
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center 
                              ${week === currentWeek 
                                ? 'bg-blue-500 text-white' 
                                : week < currentWeek 
                                  ? 'bg-green-100 text-green-800 border border-green-500' 
                                  : 'bg-gray-100 text-gray-500 border border-gray-300'}`}
                          >
                            {week}
                          </div>
                          <div className="flex-1">
                            <Progress 
                              value={week < currentWeek ? 100 : week === currentWeek ? 50 : 0} 
                              className={`h-2 ${week === currentWeek ? 'bg-blue-100' : ''}`} 
                            />
                          </div>
                          <div className="text-sm">
                            {week < currentWeek ? 'Complete' : week === currentWeek ? 'In Progress' : 'Upcoming'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Phase Overview */}
                <Card className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Project Phase Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {roadmapSchedule.map((phase, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              {phase.icon}
                              <span className={
                                currentWeek >= phase.startWeek && currentWeek <= phase.endWeek
                                  ? 'font-medium text-blue-700'
                                  : currentWeek > phase.endWeek
                                    ? 'font-medium text-green-700'
                                    : ''
                              }>
                                {phase.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">Weeks {phase.startWeek}-{phase.endWeek}</span>
                          </div>
                          <Progress 
                            value={currentWeek > phase.endWeek 
                              ? 100 
                              : currentWeek >= phase.startWeek 
                                ? ((currentWeek - phase.startWeek + 1) / (phase.endWeek - phase.startWeek + 1)) * 100 
                                : 0} 
                            className={`h-2 ${currentWeek >= phase.startWeek && currentWeek <= phase.endWeek ? 'bg-blue-100' : ''}`}
                          />
                          <div className="text-xs text-right">{phase.dates}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="modules" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Feature Modules</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                  Week {currentWeek} of 10
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featureModules.map((module) => {
                  const completion = calculateModuleCompletion(module.items);
                  return (
                    <Card key={module.name} className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {module.icon}
                            {module.name}
                          </div>
                          <span className="text-sm font-normal">
                            {completion}% Complete
                          </span>
                        </CardTitle>
                        <Progress value={completion} className="h-2" />
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {module.items.map((item) => {
                            const adjustedStatus = getAdjustedItemStatus(item);
                            return (
                              <li key={item.name} className="flex items-center gap-2">
                                <StatusIcon status={adjustedStatus} />
                                <span className={
                                  adjustedStatus === 'pending' 
                                    ? 'text-gray-500' 
                                    : adjustedStatus === 'in-progress' 
                                      ? 'text-blue-700 font-medium' 
                                      : 'font-medium'
                                }>
                                  {item.name}
                                </span>
                                {item.weekPlanned && (
                                  <span className={`text-xs ${
                                    item.weekPlanned === currentWeek 
                                      ? 'bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full' 
                                      : 'text-gray-500'
                                  }`}>
                                    Week {item.weekPlanned}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="phases" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Phases</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                  Currently in {currentPhase?.name || "Project Completion"}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {roadmapSchedule.map((phase) => {
                  const completion = calculatePhaseCompletion(phase);
                  const isCurrentPhase = currentWeek >= phase.startWeek && currentWeek <= phase.endWeek;
                  const isCompletedPhase = currentWeek > phase.endWeek;
                  
                  return (
                    <Card 
                      key={phase.name} 
                      className={`border ${
                        isCurrentPhase ? 'border-l-4 border-l-blue-500' : 
                        isCompletedPhase ? 'border-l-4 border-l-green-500' : ''
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {phase.icon}
                            {phase.name}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{completion}% Complete</div>
                            <div className="text-xs text-gray-500">{phase.dates}</div>
                          </div>
                        </CardTitle>
                        <Progress 
                          value={completion} 
                          className={`h-2 mt-2 ${isCurrentPhase ? 'bg-blue-100' : ''}`} 
                        />
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {phase.items.map((item) => {
                            const adjustedStatus = getAdjustedItemStatus(item);
                            return (
                              <div key={item.name} className="flex items-center gap-2">
                                <StatusIcon status={adjustedStatus} />
                                <span className={
                                  adjustedStatus === 'pending' 
                                    ? 'text-gray-500' 
                                    : adjustedStatus === 'in-progress' 
                                      ? 'text-blue-700 font-medium' 
                                      : 'font-medium'
                                }>
                                  {item.name}
                                </span>
                                {item.weekPlanned === currentWeek && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="devops" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">DevOps & Business</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                  {devOpsCompletion}% Complete
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {devOpsModules.map((module) => {
                  const completion = calculateModuleCompletion(module.items);
                  return (
                    <Card key={module.name} className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {module.icon}
                            {module.name}
                          </div>
                          <span className="text-sm font-normal">
                            {completion}% Complete
                          </span>
                        </CardTitle>
                        <Progress value={completion} className="h-2" />
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {module.items.map((item) => {
                            const adjustedStatus = getAdjustedItemStatus(item);
                            return (
                              <li key={item.name} className="flex items-center gap-2">
                                <StatusIcon status={adjustedStatus} />
                                <span className={
                                  adjustedStatus === 'pending' 
                                    ? 'text-gray-500' 
                                    : adjustedStatus === 'in-progress' 
                                      ? 'text-blue-700 font-medium' 
                                      : 'font-medium'
                                }>
                                  {item.name}
                                </span>
                                {item.weekPlanned && (
                                  <span className={`text-xs ${
                                    item.weekPlanned === currentWeek 
                                      ? 'bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full' 
                                      : 'text-gray-500'
                                  }`}>
                                    Week {item.weekPlanned}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Timeline</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">Completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs">Current</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-xs">Upcoming</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                
                {/* Timeline Content */}
                <div className="space-y-8 relative z-10">
                  {Array.from({length: 10}, (_, i) => i + 1).map(week => {
                    const weekTasks = getWeeklyTasks(week);
                    const isCurrentWeek = week === currentWeek;
                    const isPastWeek = week < currentWeek;
                    
                    return (
                      <div key={week} className="flex gap-4">
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                            isCurrentWeek 
                              ? 'bg-blue-500 text-white' 
                              : isPastWeek 
                                ? 'bg-green-100 text-green-800 border-2 border-green-500' 
                                : 'bg-gray-100 text-gray-500 border border-gray-300'
                          }`}>
                            <div className="text-center">
                              <div className="text-lg font-bold">W{week}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`border rounded-lg p-4 flex-1 ${
                          isCurrentWeek ? 'border-blue-200 bg-blue-50' : ''
                        }`}>
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">
                              Week {week}
                              {roadmapSchedule.find(phase => 
                                week >= phase.startWeek && week <= phase.endWeek
                              ) && (
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                  {roadmapSchedule.find(phase => 
                                    week >= phase.startWeek && week <= phase.endWeek
                                  )?.name}
                                </span>
                              )}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {(() => {
                                const date = new Date(projectStartDate);
                                date.setDate(date.getDate() + (week - 1) * 7);
                                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                              })()}
                            </span>
                          </div>
                          
                          {weekTasks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {weekTasks.map((task, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <StatusIcon status={
                                    isPastWeek ? 'complete' : 
                                    isCurrentWeek ? 'in-progress' : 'pending'
                                  } />
                                  <span className={
                                    isPastWeek ? 'font-medium' : 
                                    isCurrentWeek ? 'text-blue-700 font-medium' : 'text-gray-500'
                                  }>
                                    {task.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No tasks scheduled for this week.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusDashboard;