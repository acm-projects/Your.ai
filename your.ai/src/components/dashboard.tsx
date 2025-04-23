"use client";

import React, { useEffect, useState } from "react";
import { CalendarClock, Clock, ListTodo, Calendar } from "lucide-react";
import WeeklyCalendar from "./weeklyCalendar";
import UpcomingEvents from "../components/upcomingEvents";
import WeeklySummary from "../components/weeklySummary";
import TaskBoard from "./taskBoard";
import Sidebar from "./Sidebar";
import Newsletter from "../components/newsletter";
import { useAuth } from "../Context/authContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Event {
  id: string;
  title: string;
  time: string;
  date: string;
}

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle: string;
};

function StatsCard({ title, value, icon, subtitle }: StatsCardProps) {
  return (
    <div className="rounded-2xl border bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between p-5">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>
      <div className="px-5 pb-5 pt-0">
        <div className="text-3xl font-bold text-blue-600">{value}</div>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

type SectionCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
};

function SectionCard({
  title,
  subtitle,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`rounded-2xl border bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="p-6 border-b">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const { token } = useAuth();
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [todaysEvents, setTodaysEvents] = useState<Event[]>([]);

  const openNewsletter = () => setIsNewsletterOpen(true);
  const closeNewsletter = () => setIsNewsletterOpen(false);

  useEffect(() => {
    const fetchTodaysEvents = async () => {
      try {
        const response = await fetch("http://localhost:5001/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        const today = dayjs().format("YYYY-MM-DD");

        const filtered = data
          .filter((event: any) => event.start.startsWith(today))
          .map((item: any, idx: number) => {
            const timeStr = item.start?.split("T")[1]?.substring(0, 5) || "00:00";
            return {
              id: String(idx),
              title: item.summary || "No Title",
              time: timeStr,
              date: item.start,
            };
          });

        setTodaysEvents(filtered);
      } catch (err) {
        console.error("Failed to load today's events:", err);
      }
    };

    fetchTodaysEvents();
  }, [token]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      <Sidebar />

      <div className="flex-1 space-y-6 p-4 md:p-8 bg-gray-50 overflow-y-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2 py-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">
              Dashboard
            </h1>
            <p className="text-gray-500">
              Welcome back! Here's an overview of your week.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openNewsletter}
              className="inline-flex items-center gap-2 rounded-md text-sm font-medium bg-indigo-600 text-white h-10 px-4 py-2 hover:bg-indigo-700 transition-colors"
            >
              Weekly Digest
            </button>
            <button className="inline-flex items-center gap-2 rounded-md text-sm font-medium bg-blue-600 text-white h-10 px-4 py-2 hover:bg-blue-700 transition-colors">
              <CalendarClock className="h-4 w-4" />
              Add Event
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Today's Events"
            value={todaysEvents.length}
            subtitle={
              todaysEvents.length > 0
                ? `Next: ${todaysEvents[0].title} at ${dayjs(todaysEvents[0].date)
                    .tz("America/Chicago") // change as needed
                    .format("h:mm A")}`
                : "No events today"
            }
            icon={<Calendar className="h-5 w-5 text-blue-500" />}
          />
          <StatsCard
            title="Free Time"
            value="4.5h"
            subtitle="Today between 1:00 PM - 5:30 PM"
            icon={<Clock className="h-5 w-5 text-green-500" />}
          />
          <StatsCard
            title="Pending Tasks"
            value={8}
            subtitle="3 due today"
            icon={<ListTodo className="h-5 w-5 text-red-500" />}
          />
          <StatsCard
            title="Week Progress"
            value="40%"
            subtitle="2 of 5 days completed"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-5 w-5 text-purple-500"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            }
          />
        </div>

        {/* Weekly Calendar and Upcoming Events */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <SectionCard
            title="Week at a Glance"
            subtitle="Your schedule for this week"
            className="col-span-4"
          >
            <WeeklyCalendar />
          </SectionCard>

          <SectionCard
            title="Upcoming Events"
            subtitle="Your next appointments and deadlines"
            className="col-span-3"
          >
            <UpcomingEvents />
          </SectionCard>
        </div>

        {/* Weekly Summary and Task Board */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <SectionCard
            title="Weekly Summary"
            subtitle="Time management suggestions"
            className="col-span-3"
          >
            <WeeklySummary />
          </SectionCard>

          <SectionCard
            title="Task Board"
            subtitle="Manage your to-do list"
            className="col-span-4"
          >
            <TaskBoard />
          </SectionCard>
        </div>
      </div>

      {/* Newsletter Modal */}
      <Newsletter isOpen={isNewsletterOpen} onClose={closeNewsletter} />
    </div>
  );
}
