import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

interface CustomCalendarProps {
  value: string; // YYYY-MM-DD or formatted string
  onChange: (dateStr: string) => void;
  placeholder?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const YEARS = Array.from({length: 100}, (_, i) => new Date().getFullYear() - 80 + i);

export default function CustomCalendar({ value, onChange, placeholder = "Select date" }: CustomCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  
  // Try to parse initial value, otherwise use current date
  const initialDate = value ? new Date(value) : new Date();
  const validInitialDate = isNaN(initialDate.getTime()) ? new Date() : initialDate;

  const [currentMonth, setCurrentMonth] = useState(validInitialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(validInitialDate.getFullYear());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll year dropdown to current selected year
  useEffect(() => {
    if (showYearDropdown && yearDropdownRef.current) {
      const selectedEl = yearDropdownRef.current.querySelector('.selected-year');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'center' });
      }
    }
  }, [showYearDropdown]);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const formatted = `${day.toString().padStart(2, '0')} ${MONTHS[currentMonth]} ${currentYear}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const formattedDay = `${i.toString().padStart(2, '0')} ${MONTHS[currentMonth]} ${currentYear}`;
      const isSelected = value === formattedDay;
      const isToday = new Date().getDate() === i && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;

      days.push(
        <button
          key={`day-${i}`}
          onClick={() => handleDateSelect(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
            ${isSelected ? 'bg-blue-600 text-white shadow-md' : 
              isToday ? 'bg-blue-50 text-blue-600' : 
              'text-slate-700 hover:bg-slate-100'}`}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => { setIsOpen(!isOpen); setShowMonthDropdown(false); setShowYearDropdown(false); }}
        className="bg-white border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-900 outline-none transition-all w-full flex items-center justify-between cursor-pointer"
      >
        <span className={value ? "text-slate-900" : "text-slate-400"}>{value || placeholder}</span>
        <CalendarIcon size={16} className="text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 w-[280px] animate-in fade-in zoom-in-95 duration-200 select-none">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
              <ChevronLeft size={18} />
            </button>
            
            <div className="font-semibold text-slate-900 flex items-center gap-2">
              {/* Custom Month Dropdown */}
              <div className="relative">
                <div 
                  onClick={() => { setShowMonthDropdown(!showMonthDropdown); setShowYearDropdown(false); }}
                  className="flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-md cursor-pointer transition-colors"
                >
                  {MONTHS[currentMonth]}
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                {showMonthDropdown && (
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-32 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 grid grid-cols-2 gap-1 animate-in fade-in zoom-in-95 duration-100">
                    {MONTHS.map((m, i) => (
                      <div 
                        key={m} 
                        onClick={() => { setCurrentMonth(i); setShowMonthDropdown(false); }}
                        className={`text-center py-1.5 text-sm rounded-lg cursor-pointer transition-colors ${currentMonth === i ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Year Dropdown */}
              <div className="relative">
                <div 
                  onClick={() => { setShowYearDropdown(!showYearDropdown); setShowMonthDropdown(false); }}
                  className="flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-md cursor-pointer transition-colors"
                >
                  {currentYear}
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                {showYearDropdown && (
                  <div ref={yearDropdownRef} className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-24 max-h-[250px] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                    {YEARS.map(y => (
                      <div 
                        key={y} 
                        onClick={() => { setCurrentYear(y); setShowYearDropdown(false); }}
                        className={`text-center py-1.5 text-sm rounded-lg cursor-pointer transition-colors ${currentYear === y ? 'bg-blue-600 text-white font-semibold selected-year' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        {y}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-slate-400">
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
          
        </div>
      )}
    </div>
  );
}
