# Component Documentation

## Overview

This document provides detailed documentation for all reusable components in the Autonomous B2B Sales Intelligence Agent platform.

## Table of Contents

1. [Button Components](#button-components)
2. [Input Components](#input-components)
3. [Card Components](#card-components)
4. [Navigation Components](#navigation-components)
5. [Modal Components](#modal-components)
6. [Feedback Components](#feedback-components)
7. [Data Display Components](#data-display-components)
8. [Layout Components](#layout-components)
9. [Collaboration Components](#collaboration-components)
10. [Microinteraction Components](#microinteraction-components)

## Button Components

### AccessibleButton
A fully accessible button component with loading states, icons, and multiple variants.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isLoading | boolean | false | Shows loading state |
| loadingText | string | "Loading..." | Text to show when loading |
| icon | React.ReactNode | null | Icon to display |
| iconPosition | 'left' \| 'right' | 'left' | Position of icon |
| focusRing | boolean | true | Whether to show focus ring |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' | 'primary' | Button variant |
| block | boolean | false | Full width button |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<AccessibleButton 
  variant="primary"
  size="lg"
  icon={<Send className="h-4 w-4" /> }
  iconPosition="left"
>
  Send Message
</AccessibleButton>
```

### AccessibleIconButton
A button that contains only an icon with accessible label.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| icon | React.ReactNode | required | Icon to display |
| label | string | required | Accessible label |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' | 'secondary' | Button variant |
| isLoading | boolean | false | Loading state |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<AccessibleIconButton
  icon={<Search className="h-4 w-4" />}
  label="Search"
  variant="outline"
  size="md"
/>
```

## Input Components

### AccessibleInput
A fully accessible input component with label, helper text, error states, and more.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | undefined | Input label |
| placeholder | string | '' | Placeholder text |
| helperText | string | '' | Helper text below input |
| error | string | '' | Error message |
| success | string | '' | Success message |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Input size |
| variant | 'default' \| 'underlined' \| 'filled' | 'default' | Input variant |
| required | boolean | false | Whether input is required |
| clearable | boolean | false | Show clear button |
| readOnly | boolean | false | Read-only state |
| prefix | React.ReactNode | null | Content before input |
| suffix | React.ReactNode | null | Content after input |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<AccessibleInput
  label="Email Address"
  placeholder="Enter your email"
  variant="filled"
  size="md"
  required
/>
```

### AccessibleTextarea
A fully accessible textarea component.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | undefined | Textarea label |
| placeholder | string | '' | Placeholder text |
| helperText | string | '' | Helper text |
| error | string | '' | Error message |
| success | string | '' | Success message |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Textarea size |
| required | boolean | false | Whether required |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<AccessibleTextarea
  label="Description"
  placeholder="Enter description..."
  helperText="Provide detailed information"
  required
/>
```

## Card Components

### CompanyCard
A card component for displaying company information in research sections.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | required | Company name |
| industry | string | required | Industry |
| confidence | string | required | Confidence percentage |
| opportunityScore | string | required | Opportunity score |
| insights | string[] | required | Array of insights |
| techStack | string[] | required | Technology stack |
| funding | string | required | Funding information |
| employees | string | required | Employee count |

#### Usage
```tsx
<CompanyCard
  name="TechCorp Solutions"
  industry="Enterprise Software"
  confidence="92%"
  opportunityScore="8.5/10"
  insights={[
    "Recently funded Series C ($50M)",
    "Expanding into APAC market",
    "Looking for CRM integration partners",
  ]}
  techStack={["Salesforce", "AWS", "React", "Node.js"]}
  funding="$50M Series C"
  employees="250-500"
/>
```

### MetricCard
A card for displaying key metrics.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Metric title |
| value | string | required | Metric value |
| trend | string | required | Trend indicator |
| trendType | 'positive' \| 'negative' \| 'neutral' | 'neutral' | Trend type |
| icon | React.ComponentType | required | Icon component |
| description | string | required | Metric description |

#### Usage
```tsx
<MetricCard
  title="Pipeline Value"
  value="$2.4M"
  trend="+12% this month"
  trendType="positive"
  icon={Banknote}
  description="Total value of open opportunities"
/>
```

## Navigation Components

### NavigationShell
The main navigation shell containing sidebar and top bar.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | required | Page content |

#### Usage
```tsx
<NavigationShell>
  <PageContent />
</NavigationShell>
```

### TopBar
The top navigation bar with search, notifications, and user menu.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (none) | - | - | Self-contained component |

#### Usage
```tsx
<TopBar />
```

## Modal Components

### AccessibleModal
A fully accessible modal dialog with focus trapping.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | required | Whether modal is open |
| onClose | () => void | required | Callback when closed |
| title | string | required | Modal title |
| size | 'sm' \| 'md' \| 'lg' \| 'full' | 'md' | Modal size |
| closeButton | boolean | true | Show close button |
| preventScroll | boolean | true | Prevent body scroll |
| className | string | '' | Additional CSS classes |
| children | React.ReactNode | required | Modal content |

#### Usage
```tsx
<AccessibleModal
  isOpen={isOpen}
  onClose={setIsOpen(false)}
  title="Edit Profile"
  size="md"
>
  <FormContent />
</AccessibleModal>
```

### AccessibleAlertDialog
A simple alert dialog for messages.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | required | Whether dialog is open |
| onClose | () => void | required | Callback when closed |
| title | string | required | Dialog title |
| message | string | required | Dialog message |
| confirmLabel | string | "OK" | Confirm button text |
| cancelLabel | string | "Cancel" | Cancel button text |
| showCancel | boolean | false | Show cancel button |
| className | string | '' | Additional CSS classes |
| onConfirm | () => void | undefined | Confirm callback |
| onCancel | () => void | undefined | Cancel callback |

#### Usage
```tsx
<AccessibleAlertDialog
  isOpen={isOpen}
  onClose={setIsOpen(false)}
  title="Confirm Action"
  message="Are you sure you want to delete this item?"
  confirmLabel="Delete"
  cancelLabel="Cancel"
  showCancel={true}
  onConfirm={handleDelete}
  onCancel={() => setIsOpen(false)}
/>
```

## Feedback Components

### Toast
A temporary notification that appears and disappears automatically.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| message | string | required | Message to display |
| type | 'success' \| 'error' \| 'warning' \| 'info' | 'info' | Toast type |
| duration | number | 3000 | Display duration in ms |
| position | 'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' | 'top-right' | Position on screen |

#### Usage
```tsx
<Toast
  message="Changes saved successfully!"
  type="success"
  duration={3000}
  position="top-right"
/>
```

### ProgressIndicator
A linear progress indicator.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | 0 | Progress value (0-100) |
| label | string | undefined | Label to display |
| showValue | boolean | true | Whether to show value |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Progress bar size |
| className | string | '' | Additional CSS classes |
| status | 'success' \| 'error' \| 'warning' \| 'info' | undefined | Status-based coloring |

#### Usage
```tsx
<ProgressIndicator
  value={75}
  label="Upload Progress"
  showValue
  size="md"
/>
```

### CircularProgress
A circular progress indicator.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | 0 | Progress value (0-100) |
| label | string | undefined | Label to display |
| size | number | 80 | Diameter in pixels |
| className | string | '' | Additional CSS classes |
| status | 'success' \| 'error' \| 'warning' \| 'info' | undefined | Status-based coloring |

#### Usage
```tsx
<CircularProgress
  value={60}
  label="Task Completion"
  size={80}
/>
```

### SkeletonLoader
A placeholder skeleton loader for loading states.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | string \| number | '100%' | Width of loader |
| height | string \| number | '1rem' | Height of loader |
| radius | string \| number | '0.25rem' | Border radius |
| count | number | 1 | Number of loader elements |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<SkeletonLoader
  width="100%"
  height="2rem"
  radius="0.5rem"
  count={3}
/>
```

## Data Display Components

### MetricCard
See [Button Components](#button-components)

### DataTable
A table component for displaying tabular data.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | Array<{key: string; label: string; render?: Function}> | required | Column definitions |
| data | any[] | required | Row data |
| sortable | boolean | false | Enable column sorting |
| selectable | boolean | false | Enable row selection |
| paginate | boolean | false | Enable pagination |
| pageSize | number | 10 | Rows per page |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'value', label: 'Value', render: (val) => `$${val}` },
    { key: 'status', label: 'Status' }
  ]}
  data={[
    { name: 'Item 1', value: 100, status: 'Active' },
    { name: 'Item 2', value: 200, status: 'Inactive' }
  ]}
  paginate
  pageSize={5}
/>
```

### ChartContainer
A container for displaying charts with loading and error states.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| chartType | 'line' \| 'bar' \| 'pie' \| 'area' | required | Type of chart |
| data | any[] | required | Chart data |
| options | object | undefined | Chart configuration options |
| loading | boolean | false | Loading state |
| error | string | undefined | Error message |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<ChartContainer
  chartType="line"
  data={[
    { date: 'Jan', value: 10 },
    { date: 'Feb', value: 20 },
    { date: 'Mar', value: 15 }
  ]}
  options={{ title: 'Monthly Sales' }}
/>
```

## Layout Components

### NavigationShell
See [Navigation Components](#navigation-components)

### PageLayout
A standard page layout with container and spacing.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | required | Page content |
| className | string | '' | Additional CSS classes |
| padding | 'sm' \| 'md' \| 'lg' | 'md' | Page padding |

#### Usage
```tsx
<PageLayout padding="lg">
  <PageContent />
</PageLayout>
```

### GridLayout
A responsive grid layout component.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | required | Grid items |
| cols | string | 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' | Grid columns |
| gap | string | 'gap-4' | Gap between items |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<GridLayout cols="grid-cols-2 lg:grid-cols-4" gap="gap-6">
  <Item1 />
  <Item2 />
  <Item3 />
  <Item4 />
</GridLayout>
```

## Collaboration Components

### Comments
A comment thread component for discussions.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| comments | Comment[] | required | Array of comments |
| onCommentAdd | (comment: Comment) => void | undefined | Callback for new comment |
| onCommentEdit | (comment: Comment) => void | undefined | Callback for comment edit |
| onCommentDelete | (commentId: number) => void | undefined | Callback for comment deletion |

#### Usage
```tsx
<Comments
  comments={[
    {
      id: 1,
      author: "John Doe",
      authorAvatar: "/avatars/john.jpg",
      timestamp: "2 hours ago",
      content": "This looks great!",
      likes: 5,
      replies: 2
    }
  ]}
/>
```

### Mentions
A component for displaying mentions and notifications.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| mentions | Mention[] | required | Array of mentions |
| onMarkAsRead | (mentionId: number) => void | undefined | Callback for marking as read |
| onFilter | (filter: string) => void | undefined | Callback for filtering |

#### Usage
```tsx
<Mentions
  mentions={[
    {
      id: 1,
      type: "mention",
      author: "Sarah Chen",
      authorAvatar: "/avatars/sarah.jpg",
      timestamp": "15 minutes ago",
      content": "@John Doe Please review this",
      link": "/documents/proposal-123",
      unread: true
    }
  ]}
/>
```

### ActivityFeed
A component for displaying recent activities.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| activities | ActivityItem[] | required | Array of activities |
| onFilter | (filter: string) => void | undefined | Callback for filtering activities |
| onViewAll | () => void | undefined | Callback for viewing all activities |

#### Usage
```tsx
<ActivityFeed
  activities={[
    {
      id: 1,
      type: "project-update",
      author: "Sarah Chen",
      authorAvatar: "/avatars/sarah.jpg",
      timestamp": "Just now",
      description": "Updated market analysis",
      metadata: {
        project: "TechCorp Analysis",
        status: "In Progress"
      }
    }
  ]}
/>
```

### SharedWorkspaces
A component for displaying shared workspaces.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| workspaces | Workspace[] | required | Array of workspaces |
| onWorkspaceSelect | (workspace: Workspace) => void | undefined | Callback for workspace selection |
| onSearch | (query: string) => void | undefined | Callback for search |
| onNewWorkspace | () => void | undefined | Callback for creating new workspace |

#### Usage
```tsx
<SharedWorkspaces
  workspaces={[
    {
      id: 1,
      name: "TechCorp Engagement",
      description": "TechCorp Solutions project",
      members: 8,
      files: 42,
      lastActivity": "Just now",
      status: "active",
      type: "client"
    }
  ]}
/>
```

## Microinteraction Components

### SkeletonLoader
See [Feedback Components](#feedback-components)

### ProgressIndicator
See [Feedback Components](#feedback-components)

### CircularProgress
See [Feedback Components](#feedback-components)

### SuccessIndicator
A component for displaying success states.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| message | string | "Success!" | Success message |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<SuccessIndicator message="Changes saved successfully!" />
```

### ErrorIndicator
A component for displaying error states.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| message | string | "Error occurred" | Error message |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<ErrorIndicator message="Failed to save changes" />
```

### WarningIndicator
A component for displaying warning states.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| message | string | "Warning" | Warning message |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<WarningIndicator message="Please review the highlighted fields" />
```

### InfoIndicator
A component for displaying info states.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| message | string | "Information" | Info message |
| className | string | '' | Additional CSS classes |

#### Usage
```tsx
<InfoIndicator message="This is for informational purposes only" />
```

## Usage Examples

### Complete Form Example
```tsx
import { AccessibleButton, AccessibleInput, AccessibleTextarea, SuccessIndicator } from '@/components/accessibility';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <AccessibleInput
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChange={setName}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <AccessibleInput
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <AccessibleTextarea
          label="Message"
          placeholder="Enter your message"
          value={message}
          onChange={setMessage}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="flex items-center gap-3">
        <AccessibleButton
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          onClick={handleSubmit}
        >
          Send Message
        </AccessibleButton>
        {showSuccess && (
          <SuccessIndicator message="Message sent successfully!" />
        )}
      </div>
    </form>
  );
}
```

### Dashboard Example
```tsx
import { MetricCard, ChartContainer, AccessibleButton } from '@/components';

export function DashboardOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <MetricCard
          title="Active Users"
          value="1,240"
          trend="+12% today"
          trendType="positive"
          icon={Users}
          description="Currently active users"
        />
        <MetricCard
          title="Revenue"
          value="$2.4M"
          trend="+8% this month"
          trendType="positive"
          icon={DollarSign}
          description="Monthly recurring revenue"
        />
      </div>
      <div className="space-y-4">
        <ChartContainer
          chartType="line"
          data={[
            { month: 'Jan', value: 100 },
            { month: 'Feb', value: 120 },
            { month: 'Mar', value: 95 },
            { month: 'Apr', value: 130 }
          ]}
          options={{ title: 'User Growth Trend' }}
        />
        <AccessibleButton
          variant="outline"
          size="sm"
          icon={RefreshCw}
          iconPosition="left"
        >
          Refresh Data
        </AccessibleButton>
      </div>
    </div>
  );
}
```

## Best Practices

### Component Composition
- Compose small, focused components
- Use props for customization
- Keep components pure when possible
- Provide sensible defaults
- Make components reusable across contexts

### Accessibility
- Always include accessible labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast
- Provide focus indicators

### Performance
- Use memoization for expensive computations
- Implement lazy loading for off-screen content
- Use virtualization for large lists
- Debounce user inputs when appropriate
- Optimize images and assets

### Styling
- Use utility-first approach with Tailwind
- Follow the design token system
- Avoid arbitrary values
- Maintain consistent spacing
- Use semantic HTML elements

## Contributing

When adding new components:

1. Follow the existing patterns
2. Ensure accessibility compliance
3. Test across breakpoints
4. Add proper TypeScript types
5. Update this documentation
6. Provide usage examples
7. Consider performance implications
8. Follow naming conventions

## Versioning

This documentation corresponds to Component Documentation v1.0.0
Last updated: June 23, 2026