import type { AnalyzeUserReflectionsOutput } from '@/ai/flows/analyze-user-reflections';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Tags, MessageSquareText, Loader2, AlertCircle } from 'lucide-react';

interface ReflectionInsightsDisplayProps {
  insights: AnalyzeUserReflectionsOutput | undefined;
  isLoading: boolean;
  error?: string | null;
}

const InsightItem: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-md text-primary">{title}</h4>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  </div>
);

export function ReflectionInsightsDisplay({ insights, isLoading, error }: ReflectionInsightsDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
        Generating insights...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-destructive">
        <AlertCircle className="mr-2 h-6 w-6" />
        Error generating insights: {error}
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Sparkles className="mx-auto h-8 w-8 mb-2" />
        No insights to display. Save a reflection or select one from history.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      <InsightItem icon={Brain} title="Mood">
        <p>{insights.mood || 'Not available'}</p>
      </InsightItem>
      <InsightItem icon={Tags} title="Topics">
        {insights.topics && insights.topics.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {insights.topics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="text-sm">{topic}</Badge>
            ))}
          </div>
        ) : (
          <p>No specific topics identified.</p>
        )}
      </InsightItem>
      <InsightItem icon={Sparkles} title="Keywords">
        {insights.keywords && insights.keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {insights.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-sm">{keyword}</Badge>
            ))}
          </div>
        ) : (
          <p>No specific keywords identified.</p>
        )}
      </InsightItem>
      <InsightItem icon={MessageSquareText} title="Summary">
        <p className="italic">{insights.summary || 'Not available'}</p>
      </InsightItem>
    </div>
  );
}
