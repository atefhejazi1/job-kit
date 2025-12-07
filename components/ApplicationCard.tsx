'use client';

import { MapPin, Calendar, Briefcase } from 'lucide-react';
import Image from 'next/image';

interface ApplicationCardProps {
  title: string;
  company?: string;
  location: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  appliedAt: string;
  logo?: string;
}

export function ApplicationCard({ title, company = 'Unknown', location, status, appliedAt, logo }: ApplicationCardProps) {
  const statusConfig = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    REVIEWED: { color: 'bg-blue-100 text-blue-800', label: 'In Review' },
    SHORTLISTED: { color: 'bg-indigo-100 text-indigo-800', label: 'Shortlisted' },
    INTERVIEWING: { color: 'bg-purple-100 text-purple-800', label: 'Interviewing' },
    ACCEPTED: { color: 'bg-green-100 text-green-800', label: 'Accepted' },
    REJECTED: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
    WITHDRAWN: { color: 'bg-gray-100 text-gray-600', label: 'Withdrawn' },
  };

  const config = statusConfig[status];

  return (
    <div className="bg-white hover:shadow-md p-6 border border-gray-200 rounded-xl transition">
      <div className="flex gap-4">
       {logo ? (
  <Image
    src={logo} 
    alt={company ?? 'Company'} 
    width={64}
    height={64}
    className="shadow-sm rounded-lg object-cover"
  />
) : (
 <div className="flex justify-center items-center bg-orange-50 shadow-sm rounded-lg w-16 h-16">
            <Briefcase className="w-6 h-6 text-orange-600" />
          </div>
          
)}

        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="mb-1 font-bold text-gray-900 text-xl">{title}</h3>
              <p className="font-medium text-gray-700">{company}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
              {config.label}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>Applied {new Date(appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}