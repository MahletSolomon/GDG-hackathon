import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Star } from "lucide-react";

const user = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  avatar: "https://ui-avatars.com/api/?name=Jane+Doe",
  points: 420,
  skills: [
    { id: "html", name: "HTML Fundamentals" },
    { id: "css", name: "CSS Basics" },
    { id: "js", name: "JavaScript Essentials" },
  ],
};

const ProfilePage = () => (
  <div
    className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center"
    style={{
      background: "#0a0a0a",
      color: "#f3e8ff",
    }}
  >
    {/* Purple gradient patches */}
    <div
      className="absolute top-0 left-0 w-60 h-60 rounded-full"
      style={{
        background: "radial-gradient(circle at 30% 30%, #a259f7 0%, transparent 70%)",
        opacity: 0.6,
        zIndex: 0,
      }}
    />
    <div
      className="absolute bottom-0 right-0 w-72 h-72 rounded-full"
      style={{
        background: "radial-gradient(circle at 70% 70%, #7c3aed 0%, transparent 70%)",
        opacity: 0.5,
        zIndex: 0,
      }}
    />
    <div
      className="absolute top-0 right-0 w-40 h-40 rounded-full"
      style={{
        background: "radial-gradient(circle at 80% 20%, #c084fc 0%, transparent 70%)",
        opacity: 0.4,
        zIndex: 0,
      }}
    />

    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 z-10 py-16">
      {/* Profile Info */}
      <div className="flex flex-col items-center bg-black/70 rounded-xl p-8 shadow-2xl md:col-span-1">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full border-4 border-purple-700 mb-2"
        />
        <div className="text-2xl font-bold text-purple-200">{user.name}</div>
        <div className="text-purple-300 text-sm mb-4">{user.email}</div>
        <Button variant="ghost" className="text-red-400 hover:bg-red-900 mt-4" size="sm">
          <LogOut className="w-5 h-5 mr-1" />
          Logout
        </Button>
      </div>

      {/* Points */}
      <div className="flex flex-col justify-center items-center bg-black/70 rounded-xl p-8 shadow-2xl md:col-span-1">
        <Star className="w-10 h-10 text-yellow-400 mb-2" />
        <div className="text-xl font-bold text-purple-200 mb-2">Points</div>
        <div className="text-4xl font-extrabold text-purple-300 text-center">{user.points}</div>
      </div>

      {/* Skills */}
      <div className="flex flex-col bg-black/70 rounded-xl p-8 shadow-2xl md:col-span-1">
        <div className="text-xl font-bold text-purple-200 mb-2">Skills Learning List</div>
        <ScrollArea className="h-40 w-full rounded-md border border-purple-900 bg-zinc-900/60">
          <div className="p-2 flex flex-col gap-2">
            {user.skills.map((skill) => (
              <div
                key={skill.id}
                className="px-3 py-2 rounded bg-purple-950/60 text-purple-100 border border-purple-800"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  </div>
);

export default ProfilePage;