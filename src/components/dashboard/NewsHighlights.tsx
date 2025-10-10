import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";

export default function NewsHighlights() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const result = await InvokeLLM({
        prompt: "Get 3 latest news headlines from today. Focus on international news, technology, or education topics that would be interesting for English learners.",
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  source: { type: "string" },
                  url: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setNews(result.articles || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    }
    setLoading(false);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Newspaper className="w-5 h-5 text-blue-600" />
          Today's News Highlights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-4">
            {news.map((article, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{article.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                    <p className="text-xs text-gray-500">{article.source}</p>
                  </div>
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No news available at the moment</p>
        )}
      </CardContent>
    </Card>
  );
}