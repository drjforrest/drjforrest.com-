export enum ArticleType {
  CONTEMPORARY_VIEWPOINT = 'Contemporary Viewpoint',
  HISTORY_IN_CONTEXT = 'History in Context', 
  FIELD_NOTES = 'Field Notes',
  PARTNERSHIP_PERSPECTIVES = 'Partnership Perspectives',
  DIGITAL_HEALTH_FUTURES = 'Digital Health Futures'
}

export interface ArticleTypeMetadata {
  type: ArticleType;
  description: string;
  color: string;
  icon: string;
}

export const ARTICLE_TYPE_METADATA: Record<ArticleType, ArticleTypeMetadata> = {
  [ArticleType.CONTEMPORARY_VIEWPOINT]: {
    type: ArticleType.CONTEMPORARY_VIEWPOINT,
    description: 'Analysis of current events and trends related to digital health & equity',
    color: 'hsl(var(--chart-1))',
    icon: '📰'
  },
  [ArticleType.HISTORY_IN_CONTEXT]: {
    type: ArticleType.HISTORY_IN_CONTEXT,
    description: 'Narrative pieces exploring historical events, moments or people who shaped digital health & equity',
    color: 'hsl(var(--chart-2))',
    icon: '📚'
  },
  [ArticleType.FIELD_NOTES]: {
    type: ArticleType.FIELD_NOTES,
    description: 'Pieces based on direct research experience and field work',
    color: 'hsl(var(--chart-3))',
    icon: '🔬'
  },
  [ArticleType.PARTNERSHIP_PERSPECTIVES]: {
    type: ArticleType.PARTNERSHIP_PERSPECTIVES,
    description: 'Analysis of North-South collaboration dynamics in digital health',
    color: 'hsl(var(--chart-4))',
    icon: '🤝'
  },
  [ArticleType.DIGITAL_HEALTH_FUTURES]: {
    type: ArticleType.DIGITAL_HEALTH_FUTURES,
    description: 'Forward-looking pieces about emerging technologies and their equity implications',
    color: 'hsl(var(--chart-5))',
    icon: '🚀'
  }
};

export function getArticleTypeMetadata(articleType: ArticleType): ArticleTypeMetadata {
  return ARTICLE_TYPE_METADATA[articleType];
}

export function getAllArticleTypes(): ArticleType[] {
  return Object.values(ArticleType);
}