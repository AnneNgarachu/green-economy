import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Circle, FolderTree, Cloud, Code, Database, LineChart, Puzzle, Server, Calendar, Zap, Award, Building, TrendingUp, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

type StatusType = 'complete' | 'in-progress' | 'pending';

type ModuleItem = {
  name: string;
  status: StatusType;
};

type Module = {
  name: string;
  icon: React.ReactNode;
  completion: number;
  items: ModuleItem[];
};

type Phase = {
  name: string;
  icon: React.ReactNode;
  dates: string;
  completion: number;
  status: StatusType;
  items: ModuleItem[];
};

const StatusDashboard = () => {
  // Week tracker - update this each week
  const [currentWeek, setCurrentWeek] = useState(3);
  const currentDate = `March ${currentWeek * 7 - 5}, 2025`;

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
      completion: 15,
      items: [
        { name: 'Universal Analytics Engine (initial implementation)', status: 'complete' },
        { name: 'Data Normalization Framework (basic structure)', status: 'complete' },
        { name: 'Carbon Calculation Module', status: 'in-progress' },
        { name: 'Cost Calculation Module', status: 'pending' },
        { name: 'Incentive Optimization Engine', status: 'pending' },
        { name: 'Compliance & Reporting System', status: 'pending' },
        { name: 'Anomaly Detection System', status: 'pending' },
        { name: 'Pattern Recognition Engine', status: 'pending' },
        { name: 'Predictive Analytics Module', status: 'pending' },
        { name: 'LLM Integration for Insights', status: 'pending' }
      ]
    },
    {
      name: 'Dashboard & Visualization',
      icon: <LineChart className="h-5 w-5" />,
      completion: 30,
      items: [
        { name: 'Main Layout & Navigation', status: 'complete' },
        { name: 'Time Period Selector (24h/7d/30d)', status: 'complete' },
        { name: 'Consumption Trend Charts (basic implementation)', status: 'complete' },
        { name: 'Building Overview Cards (basic implementation)', status: 'complete' },
        { name: 'Loading States & Error Handling', status: 'in-progress' },
        { name: 'Metric Comparison Views', status: 'pending' },
        { name: 'Facility Benchmarking', status: 'pending' },
        { name: 'Carbon/Cost Visualization', status: 'pending' },
        { name: 'Interactive Drilldowns', status: 'pending' }
      ]
    },
    {
      name: 'Data Input Methods',
      icon: <Database className="h-5 w-5" />,
      completion: 35,
      items: [
        { name: 'Manual Data Entry', status: 'complete' },
        { name: 'Excel File Upload (Basic)', status: 'complete' },
        { name: 'Excel Processor for TH-E-01', status: 'in-progress' },
        { name: 'Data Validation', status: 'in-progress' },
        { name: 'Multi-Utility File Processor', status: 'pending' },
        { name: 'API Integration Framework', status: 'pending' },
        { name: 'BMS Connector', status: 'pending' },
        { name: 'Scheduling System Connector', status: 'pending' },
        { name: 'Bulk Import Tools', status: 'pending' }
      ]
    },
    {
      name: 'Core Infrastructure',
      icon: <Puzzle className="h-5 w-5" />,
      completion: 40,
      items: [
        { name: 'Next.js Framework Setup', status: 'complete' },
        { name: 'TypeScript Configuration', status: 'complete' },
        { name: 'Supabase Database Integration', status: 'complete' },
        { name: 'UI Component Library', status: 'complete' },
        { name: 'Error Boundaries & Error Handling', status: 'complete' },
        { name: 'Authentication System', status: 'pending' },
        { name: 'Role-Based Access Control', status: 'pending' },
        { name: 'Logging & Analytics', status: 'pending' }
      ]
    }
  ];

  const roadmapSchedule: Phase[] = [
    {
      name: 'Phase 1: Foundation (Weeks 1-2)',
      icon: <Calendar className="h-5 w-5" />,
      dates: 'Mar 1 - Mar 14, 2025',
      completion: 95,
      status: 'complete',
      items: [
        { name: 'Project Setup & Infrastructure', status: 'complete' },
        { name: 'Database Schema Design', status: 'complete' },
        { name: 'Core UI Components', status: 'complete' },
        { name: 'Manual Data Entry Form', status: 'complete' },
        { name: 'Basic File Upload Structure', status: 'complete' },
        { name: 'Initial Dashboard Layout', status: 'complete' }
      ]
    },
    {
      name: 'Phase 2: Talbot House Electricity Tracking (Weeks 3-4)',
      icon: <Calendar className="h-5 w-5" />,
      dates: 'Mar 15 - Mar 28, 2025',
      completion: 35,
      status: 'in-progress',
      items: [
        { name: 'Excel Processor for TH-E-01', status: 'in-progress' },
        { name: 'Basic Trend Visualization', status: 'in-progress' },
        { name: 'Time Period Selection', status: 'complete' },
        { name: 'Simple Carbon Calculation', status: 'in-progress' },
        { name: 'Basic Cost Calculation', status: 'pending' },
        { name: 'Consumption Analytics', status: 'pending' }
      ]
    },
    {
      name: 'Phase 3: Multi-Utility Expansion (Weeks 5-6)',
      icon: <Calendar className="h-5 w-5" />,
      dates: 'Mar 29 - Apr 11, 2025',
      completion: 0,
      status: 'pending',
      items: [
        { name: 'Water & Gas Meter Processing', status: 'pending' },
        { name: 'Unit Conversion Utilities', status: 'pending' },
        { name: 'Pulse Ratio Handling', status: 'pending' },
        { name: 'Utility-Specific Analytics', status: 'pending' },
        { name: 'Multi-Metric Dashboard', status: 'pending' },
        { name: 'Cross-Utility Insights', status: 'pending' }
      ]
    },
    {
      name: 'Phase 4: Intelligence Layer (Weeks 7-8)',
      icon: <Calendar className="h-5 w-5" />,
      dates: 'Apr 12 - Apr 25, 2025',
      completion: 0,
      status: 'pending',
      items: [
        { name: 'Universal Analytics Engine', status: 'pending' },
        { name: 'Pattern Recognition', status: 'pending' },
        { name: 'Basic Anomaly Detection', status: 'pending' },
        { name: 'LLM Integration for Insights', status: 'pending' },
        { name: 'Alerts & Notifications', status: 'pending' },
        { name: 'Data Export Capabilities', status: 'pending' }
      ]
    },
    {
      name: 'Phase 5: Polish & Launch (Weeks 9-10)',
      icon: <Calendar className="h-5 w-5" />,
      dates: 'Apr 26 - May 10, 2025',
      completion: 0,
      status: 'pending',
      items: [
        { name: 'User Experience Refinement', status: 'pending' },
        { name: 'Performance Optimization', status: 'pending' },
        { name: 'Documentation & Help', status: 'pending' },
        { name: 'Error Handling Improvements', status: 'pending' },
        { name: 'Comprehensive Testing', status: 'pending' },
        { name: 'Pilot Deployment', status: 'pending' }
      ]
    }
  ];

  // Calculate the overall project completion
  const calculateOverallCompletion = () => {
    const phaseWeight: {[key: string]: number} = {
      'Phase 1: Foundation (Weeks 1-2)': 0.2,
      'Phase 2: Talbot House Electricity Tracking (Weeks 3-4)': 0.3,
      'Phase 3: Multi-Utility Expansion (Weeks 5-6)': 0.2,
      'Phase 4: Intelligence Layer (Weeks 7-8)': 0.2,
      'Phase 5: Polish & Launch (Weeks 9-10)': 0.1
    };
    
    let weightedCompletion = 0;
    roadmapSchedule.forEach(phase => {
      if (phaseWeight[phase.name]) {
        weightedCompletion += phase.completion * phaseWeight[phase.name];
      }
    });
    
    return Math.round(weightedCompletion);
  };
  
  const overallCompletion = calculateOverallCompletion();

  const devOpsModules: Module[] = [
    {
      name: 'Version Control & CI/CD',
      icon: <Code className="h-5 w-5" />,
      completion: 20,
      items: [
        { name: 'GitHub Repository Setup', status: 'complete' },
        { name: 'Branch Protection Rules', status: 'in-progress' },
        { name: 'Automated Testing Setup', status: 'pending' },
        { name: 'Continuous Integration', status: 'pending' },
        { name: 'Continuous Deployment', status: 'pending' },
        { name: 'Environment Management', status: 'pending' }
      ]
    },
    {
      name: 'Deployment & Hosting',
      icon: <Cloud className="h-5 w-5" />,
      completion: 15,
      items: [
        { name: 'Development Environment', status: 'complete' },
        { name: 'Staging Environment', status: 'pending' },
        { name: 'Production Environment', status: 'pending' },
        { name: 'Database Backups', status: 'pending' },
        { name: 'Monitoring & Alerts', status: 'pending' },
        { name: 'Performance Optimization', status: 'pending' }
      ]
    },
    {
      name: 'Testing & Quality',
      icon: <Award className="h-5 w-5" />,
      completion: 10,
      items: [
        { name: 'Manual Testing Protocols', status: 'in-progress' },
        { name: 'Unit Test Framework', status: 'pending' },
        { name: 'Integration Tests', status: 'pending' },
        { name: 'End-to-End Tests', status: 'pending' },
        { name: 'Performance Testing', status: 'pending' },
        { name: 'Security Audit', status: 'pending' }
      ]
    },
    {
      name: 'Business & Documentation',
      icon: <Building className="h-5 w-5" />,
      completion: 20,
      items: [
        { name: 'Market Research', status: 'complete' },
        { name: 'Pricing Strategy', status: 'in-progress' },
        { name: 'User Documentation', status: 'pending' },
        { name: 'API Documentation', status: 'pending' },
        { name: 'Demo Environment', status: 'pending' },
        { name: 'Case Study Framework', status: 'pending' }
      ]
    }
  ];

  // Calculate DevOps completion
  const calculateDevOpsCompletion = () => {
    const totalItems = devOpsModules.reduce((acc, module) => acc + module.items.length, 0);
    const completedItems = devOpsModules.reduce((acc, module) => {
      return acc + module.items.filter(item => item.status === 'complete').length;
    }, 0);
    const inProgressItems = devOpsModules.reduce((acc, module) => {
      return acc + module.items.filter(item => item.status === 'in-progress').length;
    }, 0);
    
    return Math.round((completedItems + (inProgressItems * 0.5)) / totalItems * 100);
  };
  
  const devOpsCompletion = calculateDevOpsCompletion();

  // Add devOps completion to overall
  const overallWithDevOps = Math.round((overallCompletion * 0.7) + (devOpsCompletion * 0.3));

  // Function to increment the week
  const incrementWeek = () => {
    if (currentWeek < 10) {
      setCurrentWeek(prev => prev + 1);
    }
  };

  // Function to update module progress
  const updateModuleProgress = (moduleName: string, newPercentage: number) => {
    console.log(`Updated ${moduleName} to ${newPercentage}%`);
    // In a real app, this would update state or make an API call
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
              <div className="text-2xl font-bold">{overallWithDevOps}%</div>
              <div className="text-sm text-muted-foreground">Overall Completion</div>
            </div>
          </div>
          <CardDescription>
            Updated {currentDate} | Week {currentWeek} of 10 | Phase {currentWeek <= 2 ? 1 : currentWeek <= 4 ? 2 : currentWeek <= 6 ? 3 : currentWeek <= 8 ? 4 : 5}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="modules">
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="modules">Feature Modules</TabsTrigger>
              <TabsTrigger value="devops">DevOps</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="focus">Current Focus</TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Feature Modules</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                  Overall: {overallCompletion}% Complete
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featureModules.map((module) => (
                  <Card key={module.name} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {module.icon}
                          {module.name}
                        </div>
                        <span className="text-sm font-normal">
                          {module.completion}% Complete
                        </span>
                      </CardTitle>
                      <Progress value={module.completion} className="h-2" />
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {module.items.map((item) => (
                          <li key={item.name} className="flex items-center gap-2">
                            <StatusIcon status={item.status} />
                            <span className={
                              item.status === 'pending' 
                                ? 'text-gray-500' 
                                : item.status === 'in-progress' 
                                  ? 'text-blue-700 font-medium' 
                                  : 'font-medium'
                            }>
                              {item.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
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
                {devOpsModules.map((module) => (
                  <Card key={module.name} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {module.icon}
                          {module.name}
                        </div>
                        <span className="text-sm font-normal">
                          {module.completion}% Complete
                        </span>
                      </CardTitle>
                      <Progress value={module.completion} className="h-2" />
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {module.items.map((item) => (
                          <li key={item.name} className="flex items-center gap-2">
                            <StatusIcon status={item.status} />
                            <span className={
                              item.status === 'pending' 
                                ? 'text-gray-500' 
                                : item.status === 'in-progress' 
                                  ? 'text-blue-700 font-medium' 
                                  : 'font-medium'
                            }>
                              {item.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {roadmapSchedule.map((phase) => (
                  <Card key={phase.name} className={`border ${
                    phase.status === 'complete' ? 'border-l-4 border-l-green-500' : 
                    phase.status === 'in-progress' ? 'border-l-4 border-l-blue-500' : ''
                  }`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {phase.icon}
                          {phase.name}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{phase.completion}% Complete</div>
                          <div className="text-xs text-gray-500">{phase.dates}</div>
                        </div>
                      </CardTitle>
                      <Progress value={phase.completion} className="h-2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {phase.items.map((item) => (
                          <div key={item.name} className="flex items-center gap-2">
                            <StatusIcon status={item.status} />
                            <span className={
                              item.status === 'pending' 
                                ? 'text-gray-500' 
                                : item.status === 'in-progress' 
                                  ? 'text-blue-700 font-medium' 
                                  : 'font-medium'
                            }>
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="focus" className="space-y-6">
              <Card className="border">
                <CardHeader>
                  <CardTitle>Current Focus Areas</CardTitle>
                  <CardDescription>
                    Week {currentWeek} of 10 | Last updated: {currentDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between">
                    <h3 className="font-medium mb-2">Progress Controls</h3>
                    <button 
                      onClick={incrementWeek}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Advance to Next Week
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">In Progress</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Circle className="h-4 w-4 text-blue-500 fill-blue-200" />
                        <span className="text-blue-700 font-medium">Resolving component integration issues and TypeScript errors</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Circle className="h-4 w-4 text-blue-500 fill-blue-200" />
                        <span className="text-blue-700 font-medium">Completing the Excel processor for TH-E-01 data</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Circle className="h-4 w-4 text-blue-500 fill-blue-200" />
                        <span className="text-blue-700 font-medium">Enhancing dashboard components with proper loading states</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Circle className="h-4 w-4 text-blue-500 fill-blue-200" />
                        <span className="text-blue-700 font-medium">Implementing basic carbon emission calculations</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Next Steps</h3>
                    <ol className="space-y-2 list-decimal list-inside">
                      <li className="text-gray-700">Complete data validation for file uploads</li>
                      <li className="text-gray-700">Finalize the Excel processor for Talbot House electricity data</li>
                      <li className="text-gray-700">Add carbon footprint visualizations</li>
                      <li className="text-gray-700">Implement cost calculation functionality</li>
                      <li className="text-gray-700">Prepare for water and gas metric integration</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2 text-blue-800">Timeline Status</h3>
                    <p className="text-blue-700">Currently in <strong>Phase {currentWeek <= 2 ? 1 : currentWeek <= 4 ? 2 : currentWeek <= 6 ? 3 : currentWeek <= 8 ? 4 : 5}</strong></p>
                    <p className="text-blue-700">On track to begin Phase {currentWeek <= 2 ? 2 : currentWeek <= 4 ? 3 : currentWeek <= 6 ? 4 : currentWeek <= 8 ? 5 : "Completion"} by {currentWeek <= 2 ? "March 15" : currentWeek <= 4 ? "March 29" : currentWeek <= 6 ? "April 12" : currentWeek <= 8 ? "April 26" : "May 10"}, 2025</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md mt-4">
                    <h3 className="font-medium mb-2 text-green-800">Extended Next Steps (6-Week Plan)</h3>
                    <ol className="list-decimal pl-5 space-y-3">
                      <li className="text-green-800">
                        <span className="font-medium">Week 3 (Current):</span>
                        <ul className="list-disc pl-5 mt-1 text-green-700">
                          <li>Complete data validation for file uploads</li>
                          <li>Finalize the Excel processor for Talbot House electricity data</li>
                          <li>Fix component import issues in the dashboard index</li>
                        </ul>
                      </li>
                      <li className="text-green-800">
                        <span className="font-medium">Week 4:</span>
                        <ul className="list-disc pl-5 mt-1 text-green-700">
                          <li>Add carbon footprint calculation and visualization</li>
                          <li>Implement cost calculation functionality</li>
                          <li>Complete trend charts with date range selection</li>
                          <li>Finalize error handling and loading states</li>
                        </ul>
                      </li>
                      <li className="text-green-800">
                        <span className="font-medium">Week 5:</span>
                        <ul className="list-disc pl-5 mt-1 text-green-700">
                          <li>Begin water meter data integration</li>
                          <li>Create pulse-to-volume conversion utilities</li>
                          <li>Develop multi-metric dashboard views</li>
                          <li>Set up initial BMS connector prototype</li>
                        </ul>
                      </li>
                      <li className="text-green-800">
                        <span className="font-medium">Week 6:</span>
                        <ul className="list-disc pl-5 mt-1 text-green-700">
                          <li>Integrate gas meter processing</li>
                          <li>Implement calorific value conversion for gas data</li>
                          <li>Create utility-specific analytics components</li>
                          <li>Develop cross-utility insights dashboard</li>
                        </ul>
                      </li>
                      <li className="text-green-800">
                        <span className="font-medium">Week 7:</span>
                        <ul className="list-disc pl-5 mt-1 text-green-700">
                          <li>Begin universal analytics engine development</li>
                          <li>Implement basic anomaly detection</li>
                          <li>Create alerts and notifications system</li>
                          <li>Start pattern recognition for consumption trends</li>
                        </ul>
                      </li>
                      <li className="text-green-800">
                        <span className="font-medium">Week 8:</span>
                        <ul className="list-disc pl-5 mt-1 text-green-700">
                          <li>Integrate LLM for automated insights generation</li>
                          <li>Create comprehensive data export capabilities</li>
                          <li>Begin implementing user authentication system</li>
                          <li>Set up scheduled reporting functionality</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusDashboard;