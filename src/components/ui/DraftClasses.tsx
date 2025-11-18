"use client";

import Link from "next/link";
import { useState } from "react";

const draftYears = [
  "2025","2024","2023","2022","2021","2020",
  "2019","2018","2017","2016","2015","2014","2013","2012","2011","2010",
  "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000",
  "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990","1989",
  // drafts before 2-round format
  "1988","1987","1986","1985","1984","1983","1982","1981","1980","1979","1978","1977","1976"
];

export default function DraftClasses() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredYears = draftYears.filter((year) =>
    year.includes(searchTerm.trim())
  );

  return (
    <div>
      <div className="flex justify-center mb-5">
        <input
          type="text"
          placeholder="Find a draft class..."
          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <main className="p-5 rounded-xl shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl text-center mb-4">Draft Classes</h2>
        <div className="flex flex-col gap-3">
          {filteredYears.length > 0 ? (
            filteredYears.map((year) => (
              <div
                key={year}
                className="flex flex-wrap justify-between items-center gap-2"
              >
                <span className="text-lg font-bold">{year}</span>
                <div className="flex flex-wrap gap-2.5 justify-end">
                  <Link href={`/drafts/${year}`}>
                    <button className="btn btn-soft">View Class</button>
                  </Link>

                  <Link href={`/redrafts/year/${year}`}>
                    <button className="btn btn-soft">View Re-drafts</button>
                  </Link>

                  <Link href={`/drafts/${year}/redraft`}>
                    <button className="btn btn-soft">Create Re-draft</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center italic">No draft classes found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
