import Link from "next/link";
import { MessageSquare, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/feature-card";
import HeroAnimation from "@/components/hero-animation";
import ChatbotDemo from "@/components/chatbot-demo";
import HeroText from "@/components/hero-text";
import LoginButton from "@/components/LoginButton";
import { createClientForServer } from "@/lib/supabase/server";
import DashboardButton from "@/components/dashboard-button";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10">
              <Image
                src={"/logo.jpeg"}
                alt="Note Keeper Logo"
                width={48}
                height={48}
                className="w-full h-full"
              />
            </div>
            <span className="text-xl font-bold">Note Keeper</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="font-medium hover:underline">
              Features
            </Link>
            <Link href="#demo" className="font-medium hover:underline">
              Demo
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="get-started" className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <HeroText />
            <p className="text-xl text-gray-600">
              Take notes like never before. Ask questions about your notes and
              get instant answers with our AI-powered chatbot.
            </p>
            <div className="pt-4">
              {user ? <DashboardButton /> : <LoginButton />}
            </div>
          </div>
          <div className="flex-1 w-full">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to capture your thoughts and retrieve them
              intelligently
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Pencil />}
              title="Smart Note Taking"
              description="Take notes with full markdown support, rich text formatting and images."
              color="bg-pink-400"
            />
            <FeatureCard
              icon={<MessageSquare />}
              title="AI Chatbot Assistant"
              description="Ask questions about your notes in natural language. Our AI understands context and can find information across all your notes instantly."
              color="bg-blue-400"
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">See it in action</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how our AI chatbot helps you find information in your notes
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ChatbotDemo />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to transform your note-taking?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already upgraded their productivity
            with Note Keeper
          </p>
          <Link href="/#get-started">
            <Button className="bg-white text-black text-lg px-8 py-6 rounded-xl font-bold hover:bg-gray-100 shadow-[6px_6px_0px_0px_rgba(59,130,246,1)]">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="size-10">
                <Image
                  src={"/logo.jpeg"}
                  alt="Note Keeper Logo"
                  width={48}
                  height={48}
                  className="w-full h-full"
                />
              </div>
              <span className="text-lg font-bold">Note Keeper</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mb-4 md:mb-0">
              <Link href="#" className="text-gray-600 hover:text-black">
                Features
              </Link>

              <Link href="#" className="text-gray-600 hover:text-black">
                Blog
              </Link>
              <Link href="#" className="text-gray-600 hover:text-black">
                Support
              </Link>
            </div>
            <div className="text-gray-600">
              © {new Date().getFullYear()} Note Keeper. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
