"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { UserPreferencesForm } from "@/components/dashboard/user-preferences-form"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleSaveProfile = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    changeNameAction(formData)
      .then((response) => {
        if (response.error) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast({
          title: "Error",
          description:
            "An unexpected error occurred while updating your profile.",
          variant: "destructive",
        });
      });
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsLoading(false);
  };

  const handleSavePassword = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-full p-1 bg-muted">
          <TabsTrigger
            value="profile"
            className="rounded-full data-[state=active]:bg-background"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="rounded-full data-[state=active]:bg-background"
          >
            Content Preferences
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="rounded-full data-[state=active]:bg-background"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="rounded-full data-[state=active]:bg-background"
          >
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    defaultValue={firstName}
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    defaultValue={lastName}
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={handleSaveProfile}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <UserPreferencesForm />
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Theme</Label>
                <RadioGroup
                  defaultValue={theme}
                  onValueChange={(value) => {
                    setTheme(value);
                    toast({
                      title: "Theme updated",
                      description: `Theme has been set to ${value}.`,
                    });
                  }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="light"
                      id="theme-light"
                      className="peer sr-only"
                      aria-label="Light theme"
                    />
                    <Label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-primary/20 bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Sun className="mb-3 h-6 w-6" />
                      <div className="font-semibold">Light</div>
                      <span className="text-xs text-muted-foreground">
                        Light mode appearance
                      </span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="dark"
                      id="theme-dark"
                      className="peer sr-only"
                      aria-label="Dark theme"
                    />
                    <Label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-primary/20 bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Moon className="mb-3 h-6 w-6" />
                      <div className="font-semibold">Dark</div>
                      <span className="text-xs text-muted-foreground">
                        Dark mode appearance
                      </span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="system"
                      id="theme-system"
                      className="peer sr-only"
                      aria-label="System theme"
                    />
                    <Label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-primary/20 bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Monitor className="mb-3 h-6 w-6" />
                      <div className="font-semibold">System</div>
                      <span className="text-xs text-muted-foreground">
                        Follow system preference
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={handleSavePassword}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
