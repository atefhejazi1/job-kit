"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import toast from "react-hot-toast";

interface Interview {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  status: string;
  interviewType: string;
  job: {
    title: string;
  };
  candidate: {
    name: string;
  };
}

export default function InterviewCalendarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/interviews", {
        headers: createApiHeadersWithoutContentType(user),
      });
      if (!response.ok) throw new Error("Failed to fetch interviews");
      const data = await response.json();
      setInterviews(data.interviews || []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // getDay() returns 0 for Sunday, 1 for Monday, etc.
    const startingDayOfWeek = firstDay.getDay(); 

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.scheduledAt);
      return (
        interviewDate.getDate() === date.getDate() &&
        interviewDate.getMonth() === date.getMonth() &&
        interviewDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "CONFIRMED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "RESCHEDULED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Calendar</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your scheduled interviews
        </p>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            ← Previous
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-700 dark:text-gray-300 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="h-24 bg-gray-50 dark:bg-gray-700 rounded-lg"
            />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = new Date(year, month, day);
            const dayInterviews = getInterviewsForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div
                key={day}
                className={`h-24 border rounded-lg p-2 overflow-y-auto ${
                  isToday
                    ? "bg-blue-50 border-blue-500 border-2 dark:bg-blue-950 dark:border-blue-700"
                    : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white mb-1">{day}</div>
                {dayInterviews.map((interview) => (
                  <button
                    key={interview.id}
                    onClick={() =>
                      router.push(
                        `/dashboard/company/interviews/${interview.id}`
                      )
                    }
                    className={`w-full text-left text-xs px-2 py-1 rounded mb-1 truncate ${getStatusColor(
                      interview.status
                    )}`}
                    title={`${interview.title} - ${interview.candidate.name}`}
                  >
                    {new Date(interview.scheduledAt).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}{" "}
                    {interview.candidate.name}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-blue-100 text-blue-800 text-sm dark:bg-blue-900 dark:text-blue-300">
              Scheduled
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-green-100 text-green-800 text-sm dark:bg-green-900 dark:text-green-300">
              Confirmed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 text-sm dark:bg-yellow-900 dark:text-yellow-300">
              Rescheduled
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-gray-100 text-gray-800 text-sm dark:bg-gray-700 dark:text-gray-300">
              Completed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-red-100 text-red-800 text-sm dark:bg-red-900 dark:text-red-300">
              Cancelled
            </span>
          </div>
        </div>
      </div>

      {/* Today's Interviews */}
      {interviews.filter(
        (i) =>
          new Date(i.scheduledAt).toDateString() === new Date().toDateString()
      ).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Today's Interviews
          </h3>
          <div className="space-y-3">
            {interviews
              .filter(
                (i) =>
                  new Date(i.scheduledAt).toDateString() ===
                  new Date().toDateString()
              )
              .sort(
                (a, b) =>
                  new Date(a.scheduledAt).getTime() -
                  new Date(b.scheduledAt).getTime()
              )
              .map((interview) => (
                <button
                  key={interview.id}
                  onClick={() =>
                    router.push(`/dashboard/company/interviews/${interview.id}`)
                  }
                  className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {interview.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {interview.candidate.name} • {interview.job.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(interview.scheduledAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        • {interview.duration} mins
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm ${getStatusColor(
                        interview.status
                      )}`}
                    >
                      {interview.status}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}