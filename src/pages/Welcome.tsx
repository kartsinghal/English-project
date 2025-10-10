import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LogIn } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    age: "",
    target_preparation: "",
  });
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await User.me();
      setIsLoggedIn(true);

      // If already has profile, redirect
      if (user.placement_test_completed) {
        navigate(createPageUrl("Dashboard"));
      } else if (user.username && user.phone && user.age) {
        navigate(createPageUrl("PlacementTest"));
      }
    } catch {
      // Error intentionally ignored — user is not logged in
      setIsLoggedIn(false);
    }
    setCheckingAuth(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await User.loginWithRedirect(
        window.location.origin + createPageUrl("Loading")
      );
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await User.updateMyUserData({
        username: formData.username,
        phone: formData.phone,
        age: parseInt(formData.age, 10),
        target_preparation: formData.target_preparation,
      });

      navigate(createPageUrl("PlacementTest"));
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Please make sure you're logged in first!");
    }

    setLoading(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200')] bg-cover bg-center opacity-10" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to EnglishMaster
          </CardTitle>
          <p className="text-gray-600">
            Start your English learning journey today!
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isLoggedIn ? (
            <>
              <Button
                onClick={handleGoogleLogin}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm h-12"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign in with Google
              </Button>

              <div className="text-center text-sm text-gray-500">
                Sign in to save your progress and compete with others!
              </div>
            </>
          ) : (
            <>
              <div className="text-center text-sm text-green-600 font-medium">
                ✓ Logged in successfully! Complete your profile to continue.
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    required
                    min="5"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">What are you preparing for?</Label>
                  <Input
                    id="target"
                    placeholder="e.g., IELTS, Job Interview, College"
                    value={formData.target_preparation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        target_preparation: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-12 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? "Setting up..." : "Continue to Placement Test"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
