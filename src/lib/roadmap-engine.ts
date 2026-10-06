import { Opportunity, OpportunityRoadmap, RoadmapStep, StudentProfile } from '@/types';

export function generateOpportunityRoadmap(opportunity: Opportunity, student: StudentProfile, currentMatch: number): OpportunityRoadmap {
  const missing = opportunity.requiredSkills.filter(
    (req) => !student.skills.some((s) => s.name.toLowerCase() === req.toLowerCase())
  );
  const preferredMissing = opportunity.preferredSkills.filter(
    (pref) => !student.skills.some((s) => s.name.toLowerCase() === pref.toLowerCase())
  );

  const primaryGap = missing[0] || preferredMissing[0] || 'Containerization';
  const secondaryGap = missing[1] || preferredMissing[1] || 'Cloud Deployment';

  const steps: RoadmapStep[] = [
    {
      dayRange: 'Day 1 – 3',
      title: `${primaryGap} Core Foundations & Mental Models`,
      learningGoal: `Master essential architecture, CLI syntax, and core configuration constructs of ${primaryGap}.`,
      practicalTask: `Build a standalone "Hello World" sandbox verifying CLI flags, environment variables, and local execution.`,
      estimatedEffortHours: 6,
      evidenceToProduce: `Public GitHub repository with documentation README and annotated commit history.`,
      resources: [`Official ${primaryGap} Getting Started Documentation`, 'Interactive Sandbox Tutorials'],
    },
    {
      dayRange: 'Day 4 – 6',
      title: `Containerize & Integrate With Existing Projects`,
      learningGoal: `Bridge ${primaryGap} directly into your existing backend code to simulate production workflows.`,
      practicalTask: `Integrate ${primaryGap} into your student portfolio project (e.g., your distributed stream analyzer or API service).`,
      estimatedEffortHours: 8,
      evidenceToProduce: `Multi-stage configuration files, compose manifests, or reproducible execution scripts committed to GitHub.`,
      resources: ['Best Practices for Production Containerization', 'Local Port Forwarding & Networking Guide'],
    },
    {
      dayRange: 'Day 7 – 9',
      title: `${secondaryGap} Integration & Cloud Deployment`,
      learningGoal: `Expose your containerized service over a live HTTPS endpoint using cloud compute or serverless instances.`,
      practicalTask: `Deploy service to an AWS free-tier EC2 / ECS or cloud runtime, configure environment secrets and health check endpoints.`,
      estimatedEffortHours: 9,
      evidenceToProduce: `Live URL linkable on resume + automated deployment workflow badge.`,
      resources: ['Cloud Deployment Fundamentals', 'Securing Environment Secrets in Production'],
    },
    {
      dayRange: 'Day 10 – 12',
      title: 'Automated CI/CD Pipeline & Stress Benchmarks',
      learningGoal: `Demonstrate engineering maturity through automated linting, test suites, and load test scripts.`,
      practicalTask: `Add GitHub Actions workflow running tests on each pull request; benchmark throughput with locust or k6.`,
      estimatedEffortHours: 7,
      evidenceToProduce: `GitHub Actions workflow status badge + latency histogram chart in README.`,
      resources: ['GitHub Actions CI/CD Cheat Sheet', 'API Load Testing Best Practices'],
    },
    {
      dayRange: 'Day 13 – 14',
      title: 'Resume & Application Readiness Optimization',
      learningGoal: `Translate new tangible evidence into targeted resume bullet points using STAR format.`,
      practicalTask: `Update resume with: "Architected containerized ${primaryGap} deployment on ${secondaryGap}, handling 2,000 req/sec with automated CI/CD."`,
      estimatedEffortHours: 4,
      evidenceToProduce: `Updated one-page PDF resume + targeted application cover note referencing ABC Technologies stack.`,
      resources: ['STAR Resume Bullet Formula for Engineers', 'Technical Portfolio Audit Checklist'],
    },
  ];

  return {
    opportunityId: opportunity.id,
    opportunityTitle: opportunity.title,
    currentMatch,
    targetMatch: Math.min(96, currentMatch + 19),
    totalDays: 14,
    steps,
  };
}
