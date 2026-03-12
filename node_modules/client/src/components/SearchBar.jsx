import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SearchBar() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
  const jobInputRef = useRef(null);
  const locationInputRef = useRef(null);

  // Predefined location suggestions
  const locations = [
    'Bangalore',
    'Mumbai',
    'Hyderabad',
    'Pune',
    'Delhi',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
    'Noida',
    'Gurgaon'
  ];

  const popularJobs = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'Business Analyst',
    'UX Designer',
    'DevOps Engineer',
    'Full Stack Developer',
    'Marketing Manager'
  ];

  // Fetch job title suggestions from API
  useEffect(() => {
    const fetchJobSuggestions = async () => {
      try {
        if (jobTitle.length >= 2) {
          const response = await axios.get(`/api/salaries/search?q=${jobTitle}`);
          setJobSuggestions(response.data);
        } else if (jobTitle.length === 1) {
          const filtered = popularJobs.filter(job => job.toLowerCase().includes(jobTitle.toLowerCase()));
          setJobSuggestions(filtered);
        } else {
          // Show all unique job titles when input is empty
          const response = await axios.get('/api/salaries/all-jobs');
          setJobSuggestions(response.data);
        }
      } catch (error) {
        console.error('Error fetching job suggestions:', error);
        // Fallback to popular jobs if API fails
        setJobSuggestions(popularJobs);
      }
    };
    
    if (jobTitle.length >= 2) {
      const debounce = setTimeout(fetchJobSuggestions, 300);
      return () => clearTimeout(debounce);
    } else {
      fetchJobSuggestions();
    }
  }, [jobTitle]);

  // Filter location suggestions
  useEffect(() => {
    if (location.length >= 1) {
      const filtered = locations.filter(loc =>
        loc.toLowerCase().includes(location.toLowerCase())
      );
      setLocationSuggestions(filtered);
    } else {
      setLocationSuggestions(locations);
    }
  }, [location]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (jobInputRef.current && !jobInputRef.current.contains(event.target)) {
        setShowJobSuggestions(false);
      }
      if (locationInputRef.current && !locationInputRef.current.contains(event.target)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobTitle) params.set('jobTitle', jobTitle);
    if (location) params.set('location', location);
    navigate(`/search?${params.toString()}`);
    setShowJobSuggestions(false);
    setShowLocationSuggestions(false);
  };

  const selectJobSuggestion = (suggestion) => {
    setJobTitle(suggestion);
    setShowJobSuggestions(false);
  };

  const selectLocationSuggestion = (suggestion) => {
    setLocation(suggestion);
    setShowLocationSuggestions(false);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="glass rounded-xl p-2 flex gap-2 max-w-3xl mx-auto relative shadow-medium z-50"
    >
      {/* Job Title Input with Autocomplete */}
      <div className="flex-1 relative" ref={jobInputRef}>
        <input
          type="text"
          placeholder="Job Title (e.g. Software Engineer)"
          value={jobTitle}
          onChange={(e) => {
            setJobTitle(e.target.value);
            setShowJobSuggestions(true);
          }}
          onFocus={() => setShowJobSuggestions(true)}
          onClick={() => setShowJobSuggestions(true)}
          className="w-full bg-transparent px-4 py-3 outline-none text-slate-100 placeholder-slate-400 focus:text-white"
        />
        
        {showJobSuggestions && jobSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-large z-50 max-h-60 overflow-y-auto">
            {jobSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => selectJobSuggestion(suggestion)}
                className="px-4 py-3 hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-700 last:border-b-0 text-slate-300 hover:text-primary-400"
              >
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-px bg-slate-700" />

      {/* Location Input with Autocomplete */}
      <div className="flex-1 relative" ref={locationInputRef}>
        <input
          type="text"
          placeholder="Location (e.g. Bangalore)"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setShowLocationSuggestions(true);
          }}
          onFocus={() => setShowLocationSuggestions(true)}
          onClick={() => setShowLocationSuggestions(true)}
          className="w-full bg-transparent px-4 py-3 outline-none text-slate-100 placeholder-slate-400 focus:text-white"
        />
        
        {showLocationSuggestions && locationSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-large z-50 max-h-60 overflow-y-auto">
            {locationSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => selectLocationSuggestion(suggestion)}
                className="px-4 py-3 hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-700 last:border-b-0 text-slate-300 hover:text-primary-400"
              >
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="px-8 py-3 gradient-primary hover:from-primary-600 hover:to-primary-700 rounded-lg font-semibold text-white transition-all duration-200 shadow-soft hover:shadow-medium"
      >
        Search
      </button>
    </form>
  );
}
