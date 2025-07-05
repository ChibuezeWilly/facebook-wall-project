"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  name: string;
  message: string;
  photo?: string; // data URL
  created_at: string;
}

const DEFAULT_NAME = "Chibueze Williams";

// Helper to format relative time
function getRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now.getTime() - date.getTime()) / 1000; // seconds
  if (diff < 60) return "now";
  if (diff < 3600)
    return `${Math.floor(diff / 60)} min${
      Math.floor(diff / 60) === 1 ? "" : "s"
    }`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return date.toLocaleDateString();
}

// Helper to get initials from name
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function Wall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxChars = 280;
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Load posts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("wall-posts");
    if (stored) setPosts(JSON.parse(stored));
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wall-posts", JSON.stringify(posts));
  }, [posts]);

  // Load profile photo from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem("wall-profile-photo");
    if (storedProfile) setProfilePhoto(storedProfile);
  }, []);

  // Save profile photo to localStorage whenever it changes
  useEffect(() => {
    if (profilePhoto) localStorage.setItem("wall-profile-photo", profilePhoto);
  }, [profilePhoto]);

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle profile photo upload
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle post submit
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    const newPost: Post = {
      id: Date.now().toString(),
      name: DEFAULT_NAME,
      message: message.trim(),
      photo,
      created_at: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    setMessage("");
    setPhoto(undefined);
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full h-auto min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full h-full flex flex-col items-start justify-start">
        <div className="w-full mt-1 h-[35px] bg-blue-400 text-white flex items-center text-base rounded-t-md">
          <p className="ml-5">Wall</p>
        </div>
        <div className="flex flex-1 w-full min-h-screen md:flex-row bg-white overflow-hidden px-3 md:px-8 mt-3">
          {/* Sidebar */}
          <aside className="w-56 h-full flex-shrink-0 flex flex-col items-start justify-start pt-4">
            {profilePhoto ? (
              <>
                <img
                  src={profilePhoto}
                  alt="Profile"
                 
                  className="rounded-md h-60 w-48 object-cover border-2 border-white shadow-lg mb-4"
                  
                />
                <div className="font-bold text-base leading-tight text-start w-full">{DEFAULT_NAME}</div>
                <div className="text-base text-gray-600 text-start w-full mb-2">wall</div>
              </>
            ) : (
              <div className="flex flex-row items-center w-full mb-2">
                <div className="flex flex-col items-center mr-3">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                    {getInitials(DEFAULT_NAME)}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="font-bold text-lg leading-tight">{DEFAULT_NAME}</div>
                  <div className="text-base text-gray-600">wall</div>
                  <label htmlFor="profile-photo-upload" className="mt-1 cursor-pointer text-xs text-blue-600 hover:underline striped-input mt-1 w-[80%] h-10">
                    <input
                      id="profile-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoChange}
                      className="hidden striped-input h-8"
                    />
                  </label>
                </div>
              </div>
            )}
            
            <div
              className="bg-gray-100 h-10 px-2 flex justify-center items-center rounded-md border-gray-200 text-black text-sm mb-2 mt-2"
              style={{ borderWidth: "2px" }}
            >
              Information
            </div>
            <div className="text-sm mt-3">
              <div className="mb-1">
                <p className="font-semibold text-base">Networks </p>
                <p>Stanford Alum</p>
              </div>
              <div className="mt-3">
                <p className="font-semibold text-base">Current City</p>
                <p>Palo Alto, CA</p>
              </div>
            </div>
          </aside>
          {/* Main Wall */}
          <main
            className="border-l-gray-300 flex flex-col min-h-screen h-auto px-4 w-full"
            style={{ borderLeftWidth: "2px" }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
              <input
                ref={inputRef}
                maxLength={maxChars}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-16 striped-input"
                disabled={loading}
              />
               <div className="text-xs text-neutral-500 mt-1 ml-1">
                {maxChars - message.length} characters remaining
              </div>
              <div className="w-full flex justify-center items-center">
                <label htmlFor="photo-upload" className="w-full cursor-pointer flex flex-col justify-center items-center input">
                  <span className="text-lg" role="img" aria-label="image">🖼️</span>
                  <p className="text-gray-400 text-sm mb-1">Click to add photo (Upload)</p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
             
              <Button
                type="submit"
                className={`${
                  loading ? "bg-gray-300" : "bg-blue-700"
                } mt-1 h-9 w-28 self-end`}
                disabled={loading || !message.trim()}
              >
                Share
              </Button>
            </form>
            <div
              className="w-full flex flex-col gap-0 overflow-y-auto mt-4 min-h-screen h-auto"
              
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-dashed border-gray-400 py-2"
                >
                  <div className="font-bold text-base mb-1">{post.name}</div>
                  {post.photo && (
                    <img
                      src={post.photo}
                      alt="Wall post"
                      className="w-60 h-60 max-w-xs rounded-md mb-2"
                    />
                  )}
                  <div className="whitespace-pre-line mb-1 text-base">
                    {post.message}
                  </div>
                  <div className="text-neutral-500 text-xs text-end">
                    {getRelativeTime(post.created_at)}
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="text-center text-neutral-400 py-8">
                  No posts yet. Be the first to share!
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
