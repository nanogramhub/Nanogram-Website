import React from "react";
import { Cpu, Bot, SatelliteDish, CodeXml } from "lucide-react";

const KeyIn = () => {
  return (
    <section className="flex-grow bg-slate-50 dark:bg-slate-800  text-slate-900 dark:text-slate-50 p-8 border-none outline-none">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-medium mb-4">Our Key Initiatives</h1>
        <p className="text-lg font-normal text-slate-600 dark:text-slate-300">
          Explore the main activities and projects our club is engaged in.
        </p>
      </div>

      {/* Update: Using grid with 4 columns on larger screens and 2 on smaller */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-16 pt-16 justify-items-center">
        <div className="flex flex-col items-center p-2">
          <div className="rounded-full bg-blue-100 dark:bg-blue-950  w-16 h-16 p-4 flex justify-center items-center">
            <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
          <p className="text-lg font-normaltext-slate-600 dark:text-slate-300 mt-4 text-center">
            Innovative Workshops
          </p>
        </div>

        <div className="flex flex-col items-center p-2">
          <div className="rounded-full bg-blue-100 dark:bg-blue-950 w-16 h-16 p-4 flex justify-center items-center">
            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
          <p className="text-lg font-normal text-slate-600 dark:text-slate-300  00 mt-4 text-center">
            Robotics Competitions
          </p>
        </div>

        <div className="flex flex-col items-center p-2">
          <div className="rounded-full bg-blue-100 dark:bg-blue-950 w-16 h-16 p-4 flex justify-center items-center">
            <SatelliteDish className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
          <p className="text-lg font-normal text-slate-600 dark:text-slate-300 mt-4 text-center">
            Tech Talks and Seminars
          </p>
        </div>

        <div className="flex flex-col items-center p-2">
          <div className="rounded-full bg-blue-100 dark:bg-blue-950 w-16 h-16 p-4 flex justify-center items-center">
            <CodeXml className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
          <p className="text-lg font-normal text-slate-600 dark:text-slate-300 mt-4 text-center">
            Coding Bootcamps
          </p>
        </div>
      </div>
    </section>
  );
};

export default KeyIn;