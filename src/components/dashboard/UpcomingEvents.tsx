import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export default function UpcomingEvents() {
  const events = [
    {
      title: "Weekly Challenge",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "Competition",
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Grammar Workshop",
      date: "Friday",
      time: "2:00 PM",
      type: "Learning",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Pronunciation Practice",
      date: "Saturday",
      time: "4:00 PM",
      type: "Practice",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="w-5 h-5 text-green-600" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${event.color} flex items-center justify-center flex-shrink-0`}>
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{event.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span>📅 {event.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </span>
                </div>
                <span className="inline-block mt-2 text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                  {event.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}