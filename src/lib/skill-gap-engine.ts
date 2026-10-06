import { Opportunity, StudentProfile, SkillGapItem } from '@/types';

// Canonical target expectations per career goal
const CAREER_GOAL_PROFILES: Record<
  string,
  {
    essential: { skill: string; targetLevel: string; rationale: string; action: string }[];
    recommended: { skill: string; targetLevel: string; rationale: string; action: string }[];
    advanced: { skill: string; targetLevel: string; rationale: string; action: string }[];
  }
> = {
  'machine learning engineer': {
    essential: [
      { skill: 'Python', targetLevel: 'Advanced', rationale: 'Primary programming language for model training and scientific computation.', action: 'Build clean object-oriented Python pipelines with unit tests.' },
      { skill: 'Machine Learning', targetLevel: 'Intermediate', rationale: 'Core algorithmic foundation (classification, regression, clustering, ensemble models).', action: 'Implement Scikit-Learn pipelines evaluating precision, recall, and ROC-AUC.' },
      { skill: 'PyTorch', targetLevel: 'Intermediate', rationale: 'Frequently required across production deep learning and neural network engineering roles.', action: 'Build a deep learning vision or transformer classification project with PyTorch.' },
      { skill: 'Deep Learning', targetLevel: 'Intermediate', rationale: 'Prerequisite for convolutional, recurrent, and transformer network architectures.', action: 'Train a multi-layer neural network and visualize training loss curves.' },
    ],
    recommended: [
      { skill: 'MLOps', targetLevel: 'Beginner', rationale: 'Essential for model serving, experiment tracking, and automated deployment pipelines.', action: 'Set up MLflow or Weights & Biases for experiment tracking.' },
      { skill: 'Docker', targetLevel: 'Beginner', rationale: 'Required for containerizing model inference endpoints for cloud clusters.', action: 'Containerize a FastAPI model endpoint using a lightweight Dockerfile.' },
      { skill: 'SQL', targetLevel: 'Intermediate', rationale: 'Extracting and preparing training feature datasets from relational warehouses.', action: 'Write analytical SQL queries with CTEs and window functions.' },
    ],
    advanced: [
      { skill: 'Distributed GPU Training', targetLevel: 'Beginner', rationale: 'Valuable for scaling LLM pre-training and multi-node batch inference.', action: 'Explore PyTorch FSDP (Fully Sharded Data Parallel) tutorials.' },
      { skill: 'CUDA', targetLevel: 'Beginner', rationale: 'Low-level GPU acceleration for performance-critical tensor operations.', action: 'Experiment with basic PyTorch custom C++/CUDA kernel bindings.' },
    ],
  },
  'cloud engineer': {
    essential: [
      { skill: 'Linux', targetLevel: 'Intermediate', rationale: 'Operating system standard for cloud virtual machines, containers, and server instances.', action: 'Practice Bash scripting, systemd service management, and Linux permission administration.' },
      { skill: 'Cloud', targetLevel: 'Intermediate', rationale: 'Foundational architectural knowledge of VPCs, IAM security, compute, and object storage.', action: 'Deploy a high-availability multi-tier architecture on AWS or Azure free tier.' },
      { skill: 'AWS', targetLevel: 'Intermediate', rationale: 'The most widely deployed public cloud provider across enterprise infrastructure roles.', action: 'Configure an AWS VPC with public/private subnets and an Application Load Balancer.' },
      { skill: 'Docker', targetLevel: 'Intermediate', rationale: 'Standard runtime packaging for microservices and reproducible cloud deployments.', action: 'Write multi-stage Dockerfiles and deploy using Docker Compose.' },
    ],
    recommended: [
      { skill: 'Kubernetes', targetLevel: 'Beginner', rationale: 'Production orchestrator for container clusters across enterprise cloud architectures.', action: 'Spin up a local Minikube cluster and manage Deployments and Services via YAML manifests.' },
      { skill: 'CI/CD', targetLevel: 'Intermediate', rationale: 'Automates cloud deployment gates, unit test validation, and infrastructure updates.', action: 'Build a GitHub Actions workflow that automatically tests and deploys container images.' },
      { skill: 'Terraform', targetLevel: 'Beginner', rationale: 'Infrastructure-as-Code standard for reproducible cloud provisioning.', action: 'Write Terraform modules to provision an S3 bucket and EC2 security group.' },
    ],
    advanced: [
      { skill: 'Computer Networks', targetLevel: 'Intermediate', rationale: 'Critical for diagnosing DNS, CIDR routing, TLS certificates, and latency.', action: 'Analyze TCP handshakes, packet flows, and routing tables.' },
      { skill: 'Prometheus & Grafana', targetLevel: 'Beginner', rationale: 'Modern observability and alerting stack for cloud clusters.', action: 'Set up Prometheus node-exporter to track server CPU and memory telemetry.' },
    ],
  },
  'software engineer': {
    essential: [
      { skill: 'Data Structures & Algorithms', targetLevel: 'Intermediate', rationale: 'Benchmark evaluation criteria for tech engineering interviews and high-performance code.', action: 'Practice standard LeetCode problems on trees, graphs, dynamic programming, and binary search.' },
      { skill: 'Python', targetLevel: 'Intermediate', rationale: 'Versatile language for backend services, automation scripts, and rapid prototyping.', action: 'Build an asynchronous API service with automated pytest suites.' },
      { skill: 'Git', targetLevel: 'Intermediate', rationale: 'Essential for collaborative code review, branch management, and CI/CD integration.', action: 'Practice interactive rebase, squashing commits, and writing conventional commit logs.' },
      { skill: 'REST APIs', targetLevel: 'Intermediate', rationale: 'Standard client-server communication protocol for web and microservice architectures.', action: 'Build a documented RESTful CRUD service with OpenAPI / Swagger specs.' },
    ],
    recommended: [
      { skill: 'SQL', targetLevel: 'Intermediate', rationale: 'Required for querying, transactions, indexing, and persistent database modeling.', action: 'Design normalized database schemas and optimize query execution plans with EXPLAIN ANALYZE.' },
      { skill: 'Docker', targetLevel: 'Beginner', rationale: 'Standard practice for creating local reproducible development environments.', action: 'Containerize backend and database dependencies with Docker Compose.' },
      { skill: 'System Design', targetLevel: 'Beginner', rationale: 'Essential for understanding horizontal scalability, caching, and rate limiting.', action: 'Study design patterns for URL shorteners, news feeds, and notification services.' },
    ],
    advanced: [
      { skill: 'Distributed Systems', targetLevel: 'Beginner', rationale: 'Required for scaling services to millions of concurrent users.', action: 'Read about the CAP theorem, Raft consensus, and message queues like Kafka.' },
    ],
  },
  'data scientist': {
    essential: [
      { skill: 'Python', targetLevel: 'Advanced', rationale: 'Standard programming language for data manipulation, modeling, and statistical analysis.', action: 'Build modular data analysis scripts utilizing vectorization and type hinting.' },
      { skill: 'SQL', targetLevel: 'Advanced', rationale: 'Primary tool for querying structured data, aggregating metrics, and window analysis.', action: 'Write complex analytical queries with self-joins, CTEs, and window functions.' },
      { skill: 'Data Analysis', targetLevel: 'Intermediate', rationale: 'Core capability for exploring distributions, handling outliers, and hypothesis testing.', action: 'Perform exploratory data analysis on a real Kaggle dataset and summarize findings.' },
      { skill: 'Machine Learning', targetLevel: 'Intermediate', rationale: 'Fundamental predictive modeling toolkit across industrial data science problems.', action: 'Train regression and classification models with cross-validation and hyperparameter tuning.' },
    ],
    recommended: [
      { skill: 'Pandas', targetLevel: 'Advanced', rationale: 'Primary dataframe library for data wrangling and transformation.', action: 'Optimize dataframe operations using groupby, apply, and vectorization.' },
      { skill: 'Tableau', targetLevel: 'Beginner', rationale: 'Widely used in business environments for executive reporting and interactive dashboards.', action: 'Build an interactive multi-chart dashboard communicating business metrics.' },
    ],
    advanced: [
      { skill: 'Apache Spark', targetLevel: 'Beginner', rationale: 'Standard distributed computation engine for big data and massive table joins.', action: 'Run PySpark scripts on Google Colab or Databricks Community Edition.' },
    ],
  },
};

export function analyzeSkillGaps(student: StudentProfile, opportunities: Opportunity[]): SkillGapItem[] {
  const studentSkillMap = new Map<string, StudentProfile['skills'][0]>();
  student.skills.forEach((s) => {
    studentSkillMap.set(s.name.trim().toLowerCase(), s);
  });

  // Calculate frequency of required & preferred skills across active opportunities
  const reqFrequency = new Map<string, number>();
  const prefFrequency = new Map<string, number>();

  opportunities.forEach((opp) => {
    opp.requiredSkills.forEach((skill) => {
      const norm = skill.trim().toLowerCase();
      reqFrequency.set(norm, (reqFrequency.get(norm) || 0) + 1);
    });
    opp.preferredSkills.forEach((skill) => {
      const norm = skill.trim().toLowerCase();
      prefFrequency.set(norm, (prefFrequency.get(norm) || 0) + 1);
    });
  });

  const goalKey = (student.careerGoal || 'Software Engineer').trim().toLowerCase();
  const goalProfile = CAREER_GOAL_PROFILES[goalKey] || CAREER_GOAL_PROFILES['software engineer'];

  const gapItems: SkillGapItem[] = [];
  const processedSkills = new Set<string>();

  // Helper to test if student already has a skill
  const getStudentProficiency = (skillName: string) => {
    const norm = skillName.trim().toLowerCase();
    if (studentSkillMap.has(norm)) return studentSkillMap.get(norm);
    for (const [name, s] of studentSkillMap.entries()) {
      if (name.includes(norm) || norm.includes(name)) return s;
    }
    return undefined;
  };

  // 1. Process Essential Role Skills (Critical Priority)
  goalProfile.essential.forEach((item) => {
    const norm = item.skill.toLowerCase();
    processedSkills.add(norm);
    const existing = getStudentProficiency(item.skill);

    if (!existing) {
      const freq = reqFrequency.get(norm) || 5;
      gapItems.push({
        skill: item.skill,
        category: 'Critical Gap',
        priority: 'Critical',
        whyNeeded: `${item.skill} is a fundamental prerequisite for ${student.careerGoal || 'your target role'} and requested across ${freq} active opportunities in our verified database.`,
        currentLevel: 'No demonstrated experience',
        targetLevel: item.targetLevel,
        recommendedAction: item.action,
        description: item.rationale,
        relevanceCount: freq,
        unlockPotentialCount: Math.round(freq * 2.8 + 6),
        estimatedLearningDays: 14,
      });
    } else if (existing.level === 'Beginner' && item.targetLevel !== 'Beginner') {
      const freq = reqFrequency.get(norm) || 4;
      gapItems.push({
        skill: item.skill,
        category: 'Critical Gap',
        priority: 'High Priority',
        whyNeeded: `You have Beginner familiarity in ${item.skill}, but target ${student.careerGoal || 'engineering'} roles expect ${item.targetLevel} competency backed by project evidence.`,
        currentLevel: 'Beginner (Self-declared)',
        targetLevel: item.targetLevel,
        recommendedAction: item.action,
        description: item.rationale,
        relevanceCount: freq,
        unlockPotentialCount: Math.round(freq * 2.0 + 4),
        estimatedLearningDays: 10,
      });
    }
  });

  // 2. Process Recommended Skills (High Priority / Moderate)
  goalProfile.recommended.forEach((item) => {
    const norm = item.skill.toLowerCase();
    processedSkills.add(norm);
    const existing = getStudentProficiency(item.skill);

    if (!existing) {
      const freq = (reqFrequency.get(norm) || 0) + (prefFrequency.get(norm) || 3);
      gapItems.push({
        skill: item.skill,
        category: 'Competitive Gap',
        priority: 'High Priority',
        whyNeeded: `${item.skill} is frequently requested by hiring teams to differentiate candidates for ${student.careerGoal || 'target roles'}.`,
        currentLevel: 'No demonstrated experience',
        targetLevel: item.targetLevel,
        recommendedAction: item.action,
        description: item.rationale,
        relevanceCount: freq,
        unlockPotentialCount: Math.round(freq * 2.2 + 3),
        estimatedLearningDays: 12,
      });
    }
  });

  // 3. Process Advanced Skills (Future)
  goalProfile.advanced.forEach((item) => {
    const norm = item.skill.toLowerCase();
    processedSkills.add(norm);
    const existing = getStudentProficiency(item.skill);

    if (!existing) {
      gapItems.push({
        skill: item.skill,
        category: 'Future Gap',
        priority: 'Future',
        whyNeeded: `${item.skill} is an advanced capability that positions you for higher-tier specialization and long-term career growth.`,
        currentLevel: 'No demonstrated experience',
        targetLevel: item.targetLevel,
        recommendedAction: item.action,
        description: item.rationale,
        relevanceCount: 2,
        unlockPotentialCount: 8,
        estimatedLearningDays: 18,
      });
    }
  });

  // 4. Also scan opportunities for other missing skills frequently requested
  reqFrequency.forEach((count, normSkill) => {
    if (!processedSkills.has(normSkill) && count >= 3) {
      const existing = getStudentProficiency(normSkill);
      if (!existing) {
        // Capitalize for presentation
        const skillName = normSkill.charAt(0).toUpperCase() + normSkill.slice(1);
        gapItems.push({
          skill: skillName,
          category: 'Competitive Gap',
          priority: 'Moderate',
          whyNeeded: `Appears across ${count} active opportunities in your opportunity universe.`,
          currentLevel: 'No demonstrated experience',
          targetLevel: 'Intermediate',
          recommendedAction: `Review prerequisites and complete a verified GitHub project incorporating ${skillName}.`,
          description: `Direct requirement in multiple open postings.`,
          relevanceCount: count,
          unlockPotentialCount: Math.round(count * 2.0 + 2),
          estimatedLearningDays: 10,
        });
      }
    }
  });

  // Sort: Critical first, then High Priority, then Moderate, then Future
  const priorityWeight: Record<string, number> = {
    'Critical': 1,
    'High Priority': 2,
    'Moderate': 3,
    'Future': 4,
  };

  return gapItems.sort((a, b) => {
    const wA = priorityWeight[a.priority || 'Moderate'] || 3;
    const wB = priorityWeight[b.priority || 'Moderate'] || 3;
    if (wA !== wB) return wA - wB;
    return b.unlockPotentialCount - a.unlockPotentialCount;
  });
}
