import React, { useState, useRef, useEffect } from 'react';
import { User as FirebaseUser, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Camera, Mail, User, Shield, CheckCircle2, Phone, Home, MapPin, 
  GraduationCap, Building, BookOpen, CreditCard, Calendar, 
  AlertCircle, Edit2, Key, Info, ShieldCheck, Save, X
} from 'lucide-react';
import CustomCalendar from '@/components/CustomCalendar';
import CustomSelect from '@/components/CustomSelect';

interface PersonalInfoViewProps {
  user: FirebaseUser | null;
  showToast: (msg: string, desc?: string, type?: 'success' | 'error') => void;
}

const DEFAULT_PROFILE_DATA = {
  preferredName: '', dob: '', gender: '', bloodGroup: '', nationality: '', religion: '',
  phone: '', altPhone: '', currentAddress: '', permanentAddress: '',
  emergencyName: '', emergencyPhone: '',
  studentId: '', university: '', course: '', branch: '', yearSem: '', section: '', admissionYear: '', graduationYear: '',
  aadhaar: '', pan: '', passport: '', drivingLicence: '',
  admissionDate: '', idExpiry: '', passportExpiry: '', drivingLicenceExpiry: ''
};

const FieldInfo = ({ label, field, icon: Icon, isEditing, value, onChange, isDate = false, options }: { label: string, field: string, icon?: any, isEditing: boolean, value: string, onChange: (val: string) => void, isDate?: boolean, options?: string[] }) => (
  <div className="flex flex-col group">
    <span className="text-[12px] font-medium text-slate-500/90 mb-1">{label}</span>
    {isEditing ? (
      isDate ? (
        <CustomCalendar value={value} onChange={onChange} placeholder={label} />
      ) : options ? (
        <CustomSelect value={value} onChange={onChange} options={options} placeholder={label} />
      ) : (
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-slate-900 outline-none transition-all w-full"
          placeholder={label}
        />
      )
    ) : (
      <div className="flex items-center gap-2.5 text-slate-900 font-medium text-[15px]">
        {Icon && <Icon size={16} className="text-slate-400" />}
        {value || <span className="text-slate-400 font-normal italic">Not set</span>}
      </div>
    )}
  </div>
);

const MaskedId = ({ label, field, verified, isEditing, value, onChange }: { label: string, field: string, verified?: boolean, isEditing: boolean, value: string, onChange: (val: string) => void }) => {
  const displayVal = value ? (value.length > 4 ? `XXXX XXXX ${value.slice(-4)}` : value) : '';
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl gap-3">
      <div className="flex items-center gap-3 flex-1 w-full">
        <div className="w-10 h-10 shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
          <CreditCard size={18} />
        </div>
        <div className="flex-1 w-full">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          {isEditing ? (
            <input 
              type="text" 
              value={value} 
              onChange={(e) => onChange(e.target.value)}
              className="bg-white border border-blue-200 focus:border-blue-500 rounded-md px-2 py-1 text-xs font-mono text-slate-900 outline-none mt-1 w-full max-w-[200px]"
              placeholder="Enter ID number"
            />
          ) : (
            <p className="text-xs font-mono text-slate-500">{displayVal || <span className="text-slate-300 italic font-sans">Not set</span>}</p>
          )}
        </div>
      </div>
      {!isEditing && value && (
        verified ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 shrink-0">
            <CheckCircle2 size={12} /> Verified
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 shrink-0">
            <AlertCircle size={12} /> Pending
          </span>
        )
      )}
    </div>
  );
};

export default function PersonalInfoView({ user, showToast }: PersonalInfoViewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(DEFAULT_PROFILE_DATA);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData({ ...DEFAULT_PROFILE_DATA, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
      showToast("Profile Saved", "Your personal information has been updated.", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      showToast("Save Failed", "Could not save your profile. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));
    setIsUploading(true);

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const response = await fetch("/api/upload-profile-photo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success && user) {
        await updateProfile(user, { photoURL: data.url });
        showToast("Profile Photo Updated", "Your new profile picture has been saved.", "success");
      } else {
        showToast("Upload failed", data.error || "Failed to update profile photo", "error");
        setPhotoPreview(null);
      }
    } catch (error) {
      console.error("Error uploading:", error);
      showToast("Upload error", "An unexpected error occurred while uploading", "error");
      setPhotoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (field: keyof typeof DEFAULT_PROFILE_DATA, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to render FieldInfo with connected props
  const renderField = (label: string, field: keyof typeof DEFAULT_PROFILE_DATA, icon?: any, isDate?: boolean, options?: string[]) => (
    <FieldInfo 
      label={label} 
      field={field} 
      icon={icon} 
      isEditing={isEditing} 
      value={profileData[field]} 
      onChange={(val) => handleChange(field, val)} 
      isDate={isDate}
      options={options}
    />
  );

  // Helper to render MaskedId with connected props
  const renderMasked = (label: string, field: keyof typeof DEFAULT_PROFILE_DATA, verified?: boolean) => (
    <MaskedId 
      label={label} 
      field={field} 
      verified={verified} 
      isEditing={isEditing} 
      value={profileData[field]} 
      onChange={(val) => handleChange(field, val)} 
    />
  );

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full h-full flex flex-col animate-in fade-in duration-300">
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm mb-6 relative">
          <div className="h-32 bg-slate-200 animate-pulse relative rounded-t-[23px]">
            <div className="absolute top-4 right-4 w-28 h-8 bg-slate-300/50 rounded-full"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 animate-pulse shadow-md"></div>
            </div>
          </div>
          <div className="pt-20 px-8 pb-8">
            <div className="w-48 h-8 bg-slate-200 animate-pulse rounded-lg mb-2"></div>
            <div className="w-64 h-4 bg-slate-100 animate-pulse rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="w-20 h-3 bg-slate-100 animate-pulse rounded-full"></div>
                  <div className="w-32 h-5 bg-slate-200 animate-pulse rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6">
              <div className="w-40 h-6 bg-slate-200 animate-pulse rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="flex flex-col gap-1.5">
                    <div className="w-24 h-3 bg-slate-100 animate-pulse rounded-full"></div>
                    <div className="w-full h-5 bg-slate-200 animate-pulse rounded-lg max-w-[80%]"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full h-full flex flex-col animate-in fade-in duration-300">
      
      {/* 1. PROFILE & HEADER AREA */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm mb-6 relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative rounded-t-[23px]">
          <div className="absolute top-4 right-4 flex gap-3">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="bg-white/10 hover:bg-white/20 border border-white/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                  <X size={16} /> Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving} className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-70 hover:shadow-lg hover:-translate-y-0.5">
                  {isSaving ? <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />} 
                  Save Changes
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5">
                <Edit2 size={16} /> Edit Profile
              </button>
            )}
          </div>
          
          <div className="absolute -bottom-16 left-8 flex items-end">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-md flex items-center justify-center text-slate-400 text-4xl">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} />
                )}
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-md border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group-hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Change photo"
              >
                <Camera size={18} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{user?.displayName || "Student Name"}</h2>
            {user?.emailVerified && <CheckCircle2 size={20} className="text-blue-500" />}
          </div>
          <p className="text-slate-500 flex items-center gap-2 text-sm mb-8">
            <Mail size={14} /> {user?.email || "No email linked"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {renderField("Preferred Name", "preferredName")}
            {renderField("Date of Birth", "dob", Calendar, true)}
            {renderField("Gender", "gender", undefined, false, ["Male", "Female", "Other", "Prefer not to say"])}
            {renderField("Blood Group", "bloodGroup", undefined, false, ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])}
            {renderField("Nationality", "nationality", undefined, false, ["Indian", "American", "British", "Canadian", "Australian", "Chinese", "Japanese", "German", "French", "Italian", "Spanish", "Brazilian", "Mexican", "South African", "Other"])}
            {renderField("Religion", "religion", undefined, false, ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi", "Jewish", "Other", "Prefer not to say"])}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 2. CONTACT INFORMATION */}
        <div className={`bg-white rounded-[24px] p-6 border ${isEditing ? 'border-blue-300 shadow-blue-100 shadow-lg' : 'border-slate-200 shadow-sm'} transition-all flex flex-col gap-6`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Phone size={20} className="text-blue-500" /> Contact Information
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {renderField("Phone Number", "phone")}
            {renderField("Alternate Phone", "altPhone")}
          </div>
          <div className="space-y-4">
            {renderField("Current Address", "currentAddress", MapPin)}
            {renderField("Permanent Address", "permanentAddress", Home)}
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-2">
            <p className="text-xs font-semibold text-orange-800 uppercase tracking-wide mb-3 flex items-center gap-2"><AlertCircle size={14}/> Emergency Contact</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("Name / Relation", "emergencyName")}
              {renderField("Phone Number", "emergencyPhone")}
            </div>
          </div>
        </div>

        {/* 3. STUDENT / EDUCATION INFORMATION */}
        <div className={`bg-white rounded-[24px] p-6 border ${isEditing ? 'border-blue-300 shadow-blue-100 shadow-lg' : 'border-slate-200 shadow-sm'} transition-all flex flex-col gap-6`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <GraduationCap size={20} className="text-blue-500" /> Education Details
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {renderField("Student ID / Roll No", "studentId", Info)}
            {renderField("University", "university", Building)}
            {renderField("Course / Degree", "course")}
            {renderField("Branch", "branch")}
            {renderField("Year & Semester", "yearSem")}
            {renderField("Section", "section")}
            {renderField("Admission Year", "admissionYear")}
            {renderField("Graduation Year", "graduationYear")}
          </div>
        </div>

        {/* 4. GOVERNMENT / IDENTITY INFORMATION */}
        <div className={`bg-white rounded-[24px] p-6 border ${isEditing ? 'border-blue-300 shadow-blue-100 shadow-lg' : 'border-slate-200 shadow-sm'} transition-all flex flex-col gap-6`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-500" /> Identity Documents
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderMasked("Aadhaar / National ID", "aadhaar", true)}
            {renderMasked("PAN / Tax ID", "pan", true)}
            {renderMasked("Passport", "passport", false)}
            {renderMasked("Driving Licence", "drivingLicence", true)}
          </div>
        </div>

        {/* 5. IMPORTANT DATES */}
        <div className={`bg-white rounded-[24px] p-6 border ${isEditing ? 'border-blue-300 shadow-blue-100 shadow-lg' : 'border-slate-200 shadow-sm'} transition-all flex flex-col gap-6`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" /> Important Dates
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {renderField("Date of Birth", "dob", undefined, true)}
            {renderField("Admission Date", "admissionDate", undefined, true)}
            
            <div className="col-span-1 sm:col-span-2 pt-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 border-b border-slate-100 pb-2">Expiry Dates / Reminders</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("ID Card Expiry", "idExpiry", CreditCard, true)}
                {renderField("Passport Expiry", "passportExpiry", BookOpen, true)}
                {renderField("Licence Expiry", "drivingLicenceExpiry", Key, true)}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
