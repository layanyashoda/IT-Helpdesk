import { Ticket, User, Agent, KnowledgeArticle, DashboardStats } from '@/types';

// Mock Users
export const mockUsers: User[] = [
    {
        id: 'user-1',
        name: 'John Smith',
        email: 'john.smith@company.com',
        department: 'Marketing',
        avatar: undefined,
    },
    {
        id: 'user-2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        department: 'Sales',
        avatar: undefined,
    },
    {
        id: 'user-3',
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        department: 'Engineering',
        avatar: undefined,
    },
    {
        id: 'user-4',
        name: 'Emily Davis',
        email: 'emily.davis@company.com',
        department: 'HR',
        avatar: undefined,
    },
    {
        id: 'user-5',
        name: 'Robert Wilson',
        email: 'robert.wilson@company.com',
        department: 'Finance',
        avatar: undefined,
    },
];

// Mock Agents
export const mockAgents: Agent[] = [
    {
        id: 'agent-1',
        name: 'Alex Turner',
        email: 'alex.turner@it.company.com',
        specialization: ['hardware', 'network'],
        avatar: undefined,
    },
    {
        id: 'agent-2',
        name: 'Jessica Lee',
        email: 'jessica.lee@it.company.com',
        specialization: ['software', 'email'],
        avatar: undefined,
    },
    {
        id: 'agent-3',
        name: 'David Kim',
        email: 'david.kim@it.company.com',
        specialization: ['security', 'access'],
        avatar: undefined,
    },
];

// Mock Tickets
export const mockTickets: Ticket[] = [
    {
        id: 'TKT-001',
        subject: 'Unable to connect to VPN',
        description: 'I have been trying to connect to the company VPN from home but keep getting a "Connection timed out" error. I have tried restarting my computer and router but the issue persists.',
        status: 'open',
        priority: 'high',
        category: 'network',
        createdAt: '2026-01-27T08:30:00Z',
        updatedAt: '2026-01-27T08:30:00Z',
        createdBy: mockUsers[0],
        assignedTo: mockAgents[0],
        comments: [
            {
                id: 'comment-1',
                ticketId: 'TKT-001',
                author: mockAgents[0],
                content: 'Hi John, I will look into this issue. Can you please confirm which VPN client version you are using?',
                createdAt: '2026-01-27T09:00:00Z',
                isInternal: false,
            },
        ],
    },
    {
        id: 'TKT-002',
        subject: 'Laptop screen flickering',
        description: 'My laptop screen has been flickering intermittently for the past two days. It happens randomly and sometimes the screen goes black for a second.',
        status: 'in_progress',
        priority: 'medium',
        category: 'hardware',
        createdAt: '2026-01-26T14:20:00Z',
        updatedAt: '2026-01-27T10:15:00Z',
        createdBy: mockUsers[1],
        assignedTo: mockAgents[0],
        comments: [
            {
                id: 'comment-2',
                ticketId: 'TKT-002',
                author: mockAgents[0],
                content: 'This could be a graphics driver issue. I have scheduled a remote session for 2 PM today to diagnose.',
                createdAt: '2026-01-27T10:15:00Z',
                isInternal: false,
            },
        ],
    },
    {
        id: 'TKT-003',
        subject: 'Cannot access shared drive',
        description: 'I am unable to access the Marketing shared drive (M: drive). Getting an "Access Denied" error message.',
        status: 'resolved',
        priority: 'medium',
        category: 'access',
        createdAt: '2026-01-25T11:00:00Z',
        updatedAt: '2026-01-26T09:30:00Z',
        createdBy: mockUsers[2],
        assignedTo: mockAgents[2],
        comments: [
            {
                id: 'comment-3',
                ticketId: 'TKT-003',
                author: mockAgents[2],
                content: 'Your access permissions have been updated. Please log out and log back in to see the changes.',
                createdAt: '2026-01-26T09:30:00Z',
                isInternal: false,
            },
        ],
    },
    {
        id: 'TKT-004',
        subject: 'Email not syncing on mobile',
        description: 'My work email stopped syncing on my iPhone yesterday. I can still access it through the web portal but the Outlook app shows "Cannot connect to server".',
        status: 'open',
        priority: 'low',
        category: 'email',
        createdAt: '2026-01-27T07:45:00Z',
        updatedAt: '2026-01-27T07:45:00Z',
        createdBy: mockUsers[3],
        assignedTo: mockAgents[1],
        comments: [],
    },
    {
        id: 'TKT-005',
        subject: 'Suspicious email received',
        description: 'I received an email claiming to be from IT support asking for my password. The email address looks suspicious. I have not clicked any links.',
        status: 'in_progress',
        priority: 'critical',
        category: 'security',
        createdAt: '2026-01-27T09:15:00Z',
        updatedAt: '2026-01-27T09:45:00Z',
        createdBy: mockUsers[4],
        assignedTo: mockAgents[2],
        comments: [
            {
                id: 'comment-4',
                ticketId: 'TKT-005',
                author: mockAgents[2],
                content: 'Thank you for reporting this. This is indeed a phishing attempt. I am investigating and will send a company-wide alert.',
                createdAt: '2026-01-27T09:45:00Z',
                isInternal: false,
            },
            {
                id: 'comment-5',
                ticketId: 'TKT-005',
                author: mockAgents[2],
                content: 'Internal note: Need to check if any other employees received this email and block the sender domain.',
                createdAt: '2026-01-27T09:50:00Z',
                isInternal: true,
            },
        ],
    },
    {
        id: 'TKT-006',
        subject: 'Request for new software installation',
        description: 'I need Adobe Creative Suite installed on my workstation for upcoming design projects. I have manager approval attached.',
        status: 'open',
        priority: 'low',
        category: 'software',
        createdAt: '2026-01-27T10:00:00Z',
        updatedAt: '2026-01-27T10:00:00Z',
        createdBy: mockUsers[0],
        assignedTo: undefined,
        comments: [],
    },
    {
        id: 'TKT-007',
        subject: 'Printer not printing color',
        description: 'The HP printer on the 3rd floor is only printing in black and white. Color printing was working yesterday.',
        status: 'closed',
        priority: 'low',
        category: 'hardware',
        createdAt: '2026-01-24T15:30:00Z',
        updatedAt: '2026-01-25T11:00:00Z',
        createdBy: mockUsers[1],
        assignedTo: mockAgents[0],
        comments: [
            {
                id: 'comment-6',
                ticketId: 'TKT-007',
                author: mockAgents[0],
                content: 'The color cartridges were empty. I have replaced them and color printing is now working.',
                createdAt: '2026-01-25T11:00:00Z',
                isInternal: false,
            },
        ],
    },
    {
        id: 'TKT-008',
        subject: 'Two-factor authentication not working',
        description: 'My authenticator app is not generating the correct codes. I cannot log into any company systems that require 2FA.',
        status: 'in_progress',
        priority: 'high',
        category: 'security',
        createdAt: '2026-01-27T08:00:00Z',
        updatedAt: '2026-01-27T08:30:00Z',
        createdBy: mockUsers[2],
        assignedTo: mockAgents[2],
        comments: [
            {
                id: 'comment-7',
                ticketId: 'TKT-008',
                author: mockAgents[2],
                content: 'This usually happens when the time on your phone is not synced correctly. Please check your phone time settings. If that does not work, we can reset your 2FA.',
                createdAt: '2026-01-27T08:30:00Z',
                isInternal: false,
            },
        ],
    },
];

// Mock Knowledge Base Articles
export const mockKnowledgeArticles: KnowledgeArticle[] = [
    {
        id: 'kb-001',
        title: 'How to Connect to VPN',
        content: `# How to Connect to VPN

## Prerequisites
- VPN client installed on your computer
- Valid company credentials

## Steps
1. Open the VPN client application
2. Enter your username and password
3. Click "Connect"
4. Wait for the connection to establish
5. You should see a "Connected" status

## Troubleshooting
- If connection fails, check your internet connection
- Ensure your password has not expired
- Contact IT if issues persist`,
        category: 'network',
        tags: ['vpn', 'remote-work', 'connection'],
        views: 1250,
        helpful: 892,
        createdAt: '2025-06-15T10:00:00Z',
    },
    {
        id: 'kb-002',
        title: 'Resetting Your Password',
        content: `# Resetting Your Password

## Self-Service Reset
1. Go to the password reset portal
2. Enter your email address
3. Answer your security questions
4. Create a new password following the policy
5. Confirm your new password

## Password Policy
- Minimum 12 characters
- At least one uppercase letter
- At least one number
- At least one special character
- Cannot reuse last 5 passwords`,
        category: 'access',
        tags: ['password', 'security', 'login'],
        views: 2340,
        helpful: 1890,
        createdAt: '2025-05-20T14:30:00Z',
    },
    {
        id: 'kb-003',
        title: 'Setting Up Email on Mobile Devices',
        content: `# Setting Up Email on Mobile Devices

## For iPhone
1. Go to Settings > Mail
2. Tap "Add Account"
3. Select "Microsoft Exchange"
4. Enter your email and password
5. Accept any prompts for server configuration

## For Android
1. Open the Outlook app
2. Tap "Add Account"
3. Enter your email address
4. Follow the prompts to complete setup

## Troubleshooting
- Ensure you have a stable internet connection
- Check that your password is correct
- Enable "Allow less secure apps" if prompted`,
        category: 'email',
        tags: ['email', 'mobile', 'outlook', 'setup'],
        views: 1876,
        helpful: 1432,
        createdAt: '2025-07-10T09:00:00Z',
    },
    {
        id: 'kb-004',
        title: 'Identifying Phishing Emails',
        content: `# How to Identify Phishing Emails

## Warning Signs
- Urgent language demanding immediate action
- Generic greetings like "Dear Customer"
- Suspicious sender email addresses
- Requests for personal information or passwords
- Unexpected attachments or links

## What to Do
1. Do NOT click any links
2. Do NOT download attachments
3. Report the email to IT Security
4. Delete the email from your inbox

## Remember
IT will NEVER ask for your password via email!`,
        category: 'security',
        tags: ['phishing', 'security', 'email', 'scam'],
        views: 3421,
        helpful: 2987,
        createdAt: '2025-04-05T11:00:00Z',
    },
    {
        id: 'kb-005',
        title: 'Requesting Software Installation',
        content: `# Requesting Software Installation

## Process
1. Submit a ticket through the IT Help Desk
2. Include the software name and version needed
3. Provide business justification
4. Attach manager approval (if required)

## Standard Software
The following software can be installed immediately:
- Microsoft Office Suite
- Adobe Acrobat Reader
- Zoom
- Slack

## Non-Standard Software
Requires additional approval and may take 3-5 business days.`,
        category: 'software',
        tags: ['software', 'installation', 'request'],
        views: 987,
        helpful: 765,
        createdAt: '2025-08-01T16:00:00Z',
    },
    {
        id: 'kb-006',
        title: 'Connecting to Wireless Printers',
        content: `# Connecting to Wireless Printers

## Finding Available Printers
1. Open Settings > Devices > Printers & Scanners
2. Click "Add a printer or scanner"
3. Wait for the list to populate
4. Select the printer you want to add

## Printer Naming Convention
- Format: FLOOR-LOCATION-TYPE
- Example: 3F-KITCHEN-HP

## Common Issues
- Ensure you are on the company network
- Check that the printer is powered on
- Restart the print spooler service if needed`,
        category: 'hardware',
        tags: ['printer', 'wireless', 'setup'],
        views: 654,
        helpful: 521,
        createdAt: '2025-09-12T13:30:00Z',
    },
];

// Dashboard Statistics
export const mockDashboardStats: DashboardStats = {
    openTickets: 3,
    inProgressTickets: 3,
    resolvedToday: 1,
    avgResponseTime: '2.5 hours',
    criticalTickets: 1,
    totalTickets: 8,
};

// Category labels for display
export const categoryLabels: Record<string, string> = {
    hardware: 'Hardware',
    software: 'Software',
    network: 'Network',
    email: 'Email',
    security: 'Security',
    access: 'Access',
    other: 'Other',
};

// Status labels for display
export const statusLabels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
};

// Priority labels for display
export const priorityLabels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
};
