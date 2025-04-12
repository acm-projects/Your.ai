import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WeatherWidget from "./WeatherWidget";

const upcomingTasks = [
  { task: "ACM Meeting", color: "bg-blue-700" },
  { task: "Research Paper", color: "bg-blue-600" },
  { task: "Job Application", color: "bg-blue-500" },
];

const accomplishments = ["5K Marathon", "Daily Gym", "CS Homework"];

const taskStatus = {
  completed: ["Math Homework", "Client Project"],
  inProgress: ["Website Redesign"],
  toStart: ["New Research Paper"],
};

const ProgressRings = () => {
  const categories = [
    { label: "School", progress: 70, color: "#4F46E5" },
    { label: "Work", progress: 50, color: "#10B981" },
    { label: "Health", progress: 80, color: "#F59E0B" },
  ];
  const [visibleRing, setVisibleRing] = useState<number>(-1);

  useEffect(() => {
    categories.forEach((_, index) => {
      setTimeout(() => setVisibleRing(index), index * 500);
    });
  }, []);

  return (
    <div className="flex justify-center items-center my-10 relative">
      <svg width="500" height="500" viewBox="0 0 500 500">
        {categories.map((category, index) => {
          const radius = 120 + index * 50;
          const strokeWidth = 25;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset =
            circumference - (category.progress / 100) * circumference;

          return (
            <g key={category.label}>
              <circle
                cx="250"
                cy="250"
                r={radius}
                stroke={category.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={
                  visibleRing >= index ? strokeDashoffset : circumference
                }
                strokeLinecap="round"
                className="transition-all duration-700 ease-in-out"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function Dashboard() {
  const [visibleSection, setVisibleSection] = useState<number>(0);
  const navigate = useNavigate(); // ✅ added navigate

  useEffect(() => {
    const handleScroll = (e: any) => {
      const scrollY = e.target.scrollTop;
      const sectionHeight = window.innerHeight;
      const newSection = Math.floor(scrollY / sectionHeight);
      setVisibleSection(newSection);
    };

    document
      .getElementById("popup-content")
      ?.addEventListener("scroll", handleScroll);
    return () => {
      document
        .getElementById("popup-content")
        ?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded-lg w-3/4 h-4/5 overflow-hidden relative shadow-lg">
        <button
          className="absolute top-4 right-4 text-black text-2xl"
          onClick={() => navigate("/dashboard")}
        >
          ✖
        </button>

        <div
          id="popup-content"
          className="w-full h-full overflow-y-auto snap-mandatory snap-y scrollbar-hidden"
        >
          <section className="w-full h-[80vh] flex flex-col justify-center items-center snap-start transition-all duration-700 mt-40">
            <h2 className="text-5xl font-bold text-black mb-10">
              Progress Overview
            </h2>
            <ProgressRings />
          </section>

          <section className="w-full h-[80vh] flex flex-col justify-center items-center snap-start transition-all duration-700">
            <h2 className="text-4xl font-bold text-black mb-10">
              Upcoming This Week
            </h2>
            <div className="space-y-8">
              {upcomingTasks.map((task, index) => (
                <div
                  key={index}
                  className={`px-10 py-6 rounded-full shadow-xl text-3xl font-semibold ${task.color} text-white`}
                >
                  {task.task}
                </div>
              ))}
            </div>
          </section>

          {/* Section: Weather Forecast */}
          <section className="w-full h-[80vh] flex flex-col justify-center items-center snap-start transition-all duration-700">
            <h2 className="text-4xl font-bold text-black mb-10">
              Live Weather Forecast
            </h2>
            <div className="w-full max-w-3xl px-4">
              <WeatherWidget />
            </div>
          </section>

          {/* Section: Accomplishments */}
          <section className="w-full h-[80vh] flex flex-col justify-center items-center snap-start transition-all duration-700">
            <h2 className="text-4xl font-bold text-black mb-10">
              Last Week You Accomplished
            </h2>
            <ul className="flex flex-col items-center gap-6">
              {accomplishments.map((item, index) => (
                <li
                  key={index}
                  className="px-10 py-6 bg-blue-700 rounded-full shadow-xl text-3xl font-semibold text-white"
                >
                  ⭐ {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section: Task Status */}
          <section className="w-full h-[80vh] flex flex-col justify-center items-center snap-start transition-all duration-700">
            <h2 className="text-4xl font-bold text-black mb-10">Task Status</h2>
            <div className="w-full max-w-4xl grid grid-cols-3 gap-8">
              <div className="p-6 bg-gray-100 rounded-lg border border-gray-300 shadow-md">
                <div className="text-2xl font-semibold text-gray-700">
                  ✅ Completed
                </div>
                <ul className="text-lg mt-2 text-gray-600">
                  {taskStatus.completed.map((task, index) => (
                    <li key={index} className="py-2">
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-gray-100 rounded-lg border border-gray-300 shadow-md">
                <div className="text-2xl font-semibold text-gray-700">
                  🕒 In Progress
                </div>
                <ul className="text-lg mt-2 text-gray-600">
                  {taskStatus.inProgress.map((task, index) => (
                    <li key={index} className="py-2">
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-gray-100 rounded-lg border border-gray-300 shadow-md">
                <div className="text-2xl font-semibold text-gray-700">
                  🚀 To Start
                </div>
                <ul className="text-lg mt-2 text-gray-600">
                  {taskStatus.toStart.map((task, index) => (
                    <li key={index} className="py-2">
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
