import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { MOOD_OPTIONS } from "@/types";

interface DiaryEntryProps {
  date: string | Date;
  content: string;
  mood?: string | null;
}

export function DiaryEntry({ date, content, mood }: DiaryEntryProps) {
  const moodOption = MOOD_OPTIONS.find((m) => m.value === mood);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-brown-500">{formatDate(date)}</span>
          {moodOption && (
            <span className="text-sm">
              {moodOption.emoji} {moodOption.label}
            </span>
          )}
        </div>
        <p className="whitespace-pre-line text-brown-600">{content}</p>
      </CardContent>
    </Card>
  );
}
