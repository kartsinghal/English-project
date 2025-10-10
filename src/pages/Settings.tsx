import React, { useState, useEffect } from "react";
import { User, IUser } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings as SettingsIcon,
  Bell,
  Volume2,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  // ✅ Updated version
  const loadSettings = async () => {
    try {
      const userData: IUser = await User.me(); // explicit typing
      setUser(userData);
      // ✅ Safe defaults using nullish coalescing
      setSoundEnabled(userData.sound_enabled ?? true);
      setRemindersEnabled(userData.reminders_enabled ?? true);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSoundToggle = async (checked: boolean) => {
    setSoundEnabled(checked);
    await User.updateMyUserData({ sound_enabled: checked });
  };

  const handleRemindersToggle = async (checked: boolean) => {
    setRemindersEnabled(checked);
    await User.updateMyUserData({ reminders_enabled: checked });
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;

    setLoading(true);
    // In a real app, this would send to backend
    alert("Thank you for your feedback!");
    setFeedback("");
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      navigate(createPageUrl("Welcome"));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Customize your learning experience
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-purple-600" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <div>
                  <Label htmlFor="sound" className="font-medium">
                    Sound Effects
                  </Label>
                  <p className="text-sm text-gray-600">
                    Play sounds during lessons
                  </p>
                </div>
              </div>
              <Switch
                id="sound"
                checked={soundEnabled}
                onCheckedChange={handleSoundToggle}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-purple-600" />
                <div>
                  <Label htmlFor="reminders" className="font-medium">
                    Daily Reminders
                  </Label>
                  <p className="text-sm text-gray-600">
                    Get notified about practice
                  </p>
                </div>
              </div>
              <Switch
                id="reminders"
                checked={remindersEnabled}
                onCheckedChange={handleRemindersToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Send Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your thoughts, suggestions, or report issues..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
            <Button
              onClick={handleFeedbackSubmit}
              disabled={loading || !feedback.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {loading ? "Sending..." : "Submit Feedback"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-600">Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
