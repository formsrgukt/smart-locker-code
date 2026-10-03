"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, Home, FileText, User, Folder, Heart, Clock, Trash2, 
  Settings, Shield, Search, Bell, Plus, Upload, Scan, FileBadge, 
  GraduationCap, Briefcase, File, MoreVertical, Star, Download,
  CheckCircle2, Sparkles, Activity, ShieldCheck, ChevronRight, ChevronLeft,
  Share2, Copy, Eye, Minus, LayoutList, ChevronDown, Check, Circle, LayoutGrid
} from 'lucide-react';

import dynamic from 'next/dynamic';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import HeartButton from '@/components/HeartButton';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import SecureLoader from '@/components/SecureLoader';
import EmptyState from '@/components/EmptyState';
import Logo from '@/components/Logo';
import UploadCard from '@/components/UploadCard';
import ScanCard from '@/components/ScanCard';
import AddInfoCard from '@/components/AddInfoCard';
import CreateCollectionCard from '@/components/CreateCollectionCard';
import PersonalInfoView from './PersonalInfoView';

import PdfOpeningLoader from './PdfOpeningLoader';
const PdfViewer = dynamic(() => import('./PdfViewer'), { ssr: false, loading: () => <PdfOpeningLoader /> });

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [shareFile, setShareFile] = useState<any | null>(null);
  const [viewFile, setViewFile] = useState<any | null>(null);
  const [toast, setToast] = useState<{message: string, description?: string, type?: 'success' | 'error', isHiding?: boolean} | null>(null);
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<any | null>(null);
  const [deleteConfirmCollection, setDeleteConfirmCollection] = useState<any | null>(null);
  const [deleteCollectionInput, setDeleteCollectionInput] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);
  const [deleteCollectionSuccess, setDeleteCollectionSuccess] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState(false);
  const [deleteFileSuccess, setDeleteFileSuccess] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [collections, setCollections] = useState<{id?: string, name: string, count: number}[]>([]);
  const [twoStepEnabled, setTwoStepEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [defaultFolderView, setDefaultFolderView] = useState<'list' | 'grid'>('list');
  const [profileData, setProfileData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (userDoc) => {
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfileData(data);
        if (data.twoStepVerification === false) setTwoStepEnabled(false);
        else setTwoStepEnabled(true);
        if (data.emailNotifications === false) setEmailNotificationsEnabled(false);
        else setEmailNotificationsEnabled(true);
        if (data.defaultFolderView) setDefaultFolderView(data.defaultFolderView);
      }
    }, (error) => {
      console.error("Error listening to profile data:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleTwoStep = async () => {
    if (!user) return;
    const newVal = !twoStepEnabled;
    setTwoStepEnabled(newVal);
    try {
      await setDoc(doc(db, 'users', user.uid), { twoStepVerification: newVal }, { merge: true });
      showToast(newVal ? '2-Step Verification Enabled' : '2-Step Verification Disabled', 'Your security preferences have been saved.', 'success');
    } catch (e) {
      console.error(e);
      setTwoStepEnabled(!newVal);
      showToast('Error', 'Failed to update security settings', 'error');
    }
  };

  const toggleEmailNotifications = async () => {
    if (!user) return;
    const newVal = !emailNotificationsEnabled;
    setEmailNotificationsEnabled(newVal);
    try {
      await setDoc(doc(db, 'users', user.uid), { emailNotifications: newVal }, { merge: true });
      showToast(newVal ? 'Notifications Enabled' : 'Notifications Disabled', 'Your preference has been saved.', 'success');
    } catch (e) {
      console.error(e);
      setEmailNotificationsEnabled(!newVal);
      showToast('Error', 'Failed to update preferences', 'error');
    }
  };

  const changeDefaultView = async (view: 'list' | 'grid') => {
    if (!user) return;
    setDefaultFolderView(view);
    try {
      await setDoc(doc(db, 'users', user.uid), { defaultFolderView: view }, { merge: true });
      showToast('View Updated', `Default view set to ${view}`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Error', 'Failed to update preferences', 'error');
    }
  };

  const showToast = (message: string, description?: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, description, type, isHiding: false });
    setTimeout(() => {
      closeToast();
    }, 3700);
  };

  const closeToast = () => {
    setToast(prev => prev ? { ...prev, isHiding: true } : null);
    setTimeout(() => {
      setToast(prev => prev?.isHiding ? null : prev);
    }, 300);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        setAuthResolved(true);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchFiles = async (uid: string) => {
    try {
      const q = query(collection(db, "files"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const filesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      filesData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentFiles(filesData);
    } catch (error) {
      console.error("Error fetching files from Firebase:", error);
    }
  };

  const fetchCollections = async (uid: string) => {
    try {
      const q = query(collection(db, "collections"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const rawCols = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        createdAt: doc.data().createdAt
      }));
      
      rawCols.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      const uniqueCols: any[] = [];
      const seen = new Set();
      for (const col of rawCols) {
        if (!col.name) continue;
        const normalized = col.name.toLowerCase().trim();
        if (!seen.has(normalized)) {
          seen.add(normalized);
          uniqueCols.push(col);
        }
      }
      setCollections(uniqueCols);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  useEffect(() => {
    if (!authResolved || !user) return;
    // Run the data fetch and a strict 5000ms timer concurrently
    Promise.all([
      fetchFiles(user.uid),
      fetchCollections(user.uid),
      new Promise(resolve => setTimeout(resolve, 5000))
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [authResolved, user]);

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getFilteredAndSortedFiles = (files: any[]) => {
    let result = [...files];
    if (searchQuery.trim() !== '') {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filterType !== 'all') {
      if (filterType === 'image') result = result.filter(f => f.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|svg)$/));
      else if (filterType === 'pdf') result = result.filter(f => f.name.toLowerCase().endsWith('.pdf'));
      else if (filterType === 'video') result = result.filter(f => f.name.toLowerCase().match(/\.(mp4|webm|mkv|mov)$/));
    }
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    else if (sortBy === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'name-desc') result.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === 'size-desc') result.sort((a, b) => b.size - a.size);
    else if (sortBy === 'size-asc') result.sort((a, b) => a.size - b.size);
    return result;
  };

  const CustomDropdown = ({ value, options, onChange }: { value: string, options: {label: string, value: string}[], onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium cursor-pointer shadow-sm hover:bg-slate-50 transition-colors w-full md:w-[160px]"
        >
          <span className="truncate">{selectedOption.label}</span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full mt-2 left-0 right-0 md:right-auto md:w-max min-w-[160px] bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-1 max-h-60 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${
                    value === opt.value 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                  {value === opt.value && <Check size={14} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const FilterControls = () => {
    const filterOptions = [
      { value: 'all', label: 'All Types' },
      { value: 'image', label: 'Images' },
      { value: 'pdf', label: 'PDFs' },
      { value: 'video', label: 'Videos' }
    ];
    
    const sortOptions = [
      { value: 'newest', label: 'Newest' },
      { value: 'oldest', label: 'Oldest' },
      { value: 'name-asc', label: 'Name (A-Z)' },
      { value: 'name-desc', label: 'Name (Z-A)' },
      { value: 'size-desc', label: 'Size (Large-Small)' },
      { value: 'size-asc', label: 'Size (Small-Large)' }
    ];

    return (
      <div className="flex flex-col md:flex-row gap-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search files..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm shadow-sm" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <CustomDropdown value={filterType} options={filterOptions} onChange={setFilterType} />
          <CustomDropdown value={sortBy} options={sortOptions} onChange={setSortBy} />
        </div>
      </div>
    );
  };

  const handleToggleFavorite = async (e: React.MouseEvent, file: any) => {
    e.stopPropagation();
    try {
      const newFavoriteStatus = !file.isFavorite;
      await updateDoc(doc(db, "files", file.id), { isFavorite: newFavoriteStatus });
      setRecentFiles(prev => prev.map(f => f.id === file.id ? { ...f, isFavorite: newFavoriteStatus } : f));
      showToast(newFavoriteStatus ? "Added to favorites" : "Removed from favorites", "", "success");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      showToast("Error", "Could not update favorite status.", "error");
    }
  };

  const handleDeleteFile = (e: React.MouseEvent, file: any) => {
    e.stopPropagation();
    setDeleteConfirmFile(file);
  };

  const confirmDeleteFile = async () => {
    if (!deleteConfirmFile) return;
    const file = deleteConfirmFile;
    setIsDeletingFile(true);
    try {
      // Fire and forget GitHub deletion to prevent UI blocking
      fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: file.url })
      }).catch(err => console.error('Background GitHub delete error:', err));

      // Only await the fast Firebase database deletion
      await deleteDoc(doc(db, "files", file.id));
      setRecentFiles(prev => prev.filter(f => f.id !== file.id));
      
      setIsDeletingFile(false);
      setDeleteFileSuccess(true);
      setTimeout(() => {
        setDeleteFileSuccess(false);
        setDeleteConfirmFile(null);
      }, 1000);
    } catch (error) {
      console.error('Delete error:', error);
      setIsDeletingFile(false);
      setDeleteConfirmFile(null);
      showToast("Failed to delete", "An error occurred while deleting the file.", "error");
    }
  };

  const confirmDeleteCollection = async () => {
    if (!deleteConfirmCollection) return;
    const col = deleteConfirmCollection;
    if (deleteCollectionInput !== col.name) return;
    
    setIsDeletingCollection(true);
    try {
      const filesToDelete = recentFiles.filter(f => f.collectionId === col.id);
      
      // Delete all files in the collection
      for (const file of filesToDelete) {
        try {
          const res = await fetch('/api/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: file.url })
          });
          if (res.ok) {
            await deleteDoc(doc(db, "files", file.id));
          }
        } catch (e) {
          console.error("Failed to delete file from collection:", e);
        }
      }
      
      // Delete the collection itself
      await deleteDoc(doc(db, "collections", col.id));
      
      setRecentFiles(prev => prev.filter(f => f.collectionId !== col.id));
      setCollections(prev => prev.filter(c => c.id !== col.id));
      setActiveTab('Collections');
      
      setIsDeletingCollection(false);
      setDeleteCollectionSuccess(true);
      setTimeout(() => {
        setDeleteCollectionSuccess(false);
        setDeleteConfirmCollection(null);
        setDeleteCollectionInput('');
      }, 2000);
      
    } catch (error) {
      console.error('Delete collection error:', error);
      setIsDeletingCollection(false);
      showToast("Failed to delete", "An error occurred while deleting the collection.", "error");
    }
  };

  const handleCreateCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCollectionName.trim();
    if (!name || !user) return;
    
    if (collections.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      showToast("Duplicate Collection", `A collection named '${name}' already exists.`, "error");
      return;
    }
    
    try {
      const docRef = await addDoc(collection(db, "collections"), {
        userId: user.uid,
        name,
        count: 0,
        createdAt: new Date().toISOString()
      });
      setCollections(prev => [...prev, { id: docRef.id, name, count: 0 }]);
      showToast("Collection created", `Successfully created the '${name}' collection.`, "success");
      setIsCreateCollectionOpen(false);
      setNewCollectionName('');
      setActiveTab('Collections');
    } catch (error) {
      console.error("Error creating collection:", error);
      showToast("Error", "Failed to create collection.", "error");
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const data: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          setUploadProgress(100);
          try {
            const responseData = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(responseData);
            } else {
              reject(new Error(responseData.error || 'Upload failed'));
            }
          } catch {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };
        xhr.send(formData);
      });

      try {
          const currentCollectionId = activeTab.startsWith('Collection:') ? activeTab.split(':')[1] : null;
          const currentCategoryId = activeTab.startsWith('Category:') ? activeTab.split(':')[1] : null;
          // Store metadata in Firebase
          await addDoc(collection(db, "files"), {
            name: file.name,
            size: file.size,
            type: file.type,
            url: data.urls?.raw || data.url,
            urls: data.urls || null,
            github_url: data.github_url || null,
            userId: user?.uid,
            collectionId: currentCollectionId,
            categoryId: currentCategoryId,
            createdAt: new Date().toISOString(),
          });
          
          if (currentCollectionId) {
            setCollections(prev => prev.map(c => c.id === currentCollectionId ? { ...c, count: c.count + 1 } : c));
          }
          console.log("File metadata saved to Firebase!");
        } catch (e) {
          console.error("Error saving metadata to Firebase: ", e);
        }

        if (user) fetchFiles(user.uid);
        showToast("Upload Successful", "File uploaded to GitHub and saved to Firebase.");
        
        setIsUploadSuccess(true);
        setTimeout(() => setIsUploadSuccess(false), 3000);
    } catch (error) {
      showToast("Upload failed", String(error), "error");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-[9999] flex flex-col items-center justify-center animate-in fade-in duration-300">
        <SecureLoader />
      </div>
    );
  }

  // Calculate dynamic stats
  const totalDocuments = recentFiles.length;
  const totalSizeBytes = recentFiles.reduce((sum, file) => sum + (file.size || 0), 0);
  const totalStorageGB = (totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2);
  const totalStorageMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);
  const storageDisplay = totalSizeBytes >= 1024 * 1024 * 1024 
    ? { value: totalStorageGB, unit: 'GB' } 
    : { value: totalStorageMB, unit: 'MB' };

  // Assuming 10 GB total for progress bar (mock storage limit)
  const storagePercent = Math.min(100, (totalSizeBytes / (10 * 1024 * 1024 * 1024)) * 100).toFixed(1);
  
  const collectionsCount = collections.length;

  const unorganizedFiles = recentFiles.filter((f: any) => !f.collectionId && !f.categoryId);

  const basicFields = ['preferredName', 'dob', 'gender', 'bloodGroup', 'nationality', 'religion', 'phone', 'altPhone', 'currentAddress', 'permanentAddress'];
  const academicFields = ['studentId', 'university', 'course', 'branch', 'yearSem', 'section', 'admissionYear', 'graduationYear'];
  const emergencyFields = ['emergencyName', 'emergencyPhone'];
  const additionalFields = ['aadhaar', 'pan', 'passport', 'drivingLicence', 'admissionDate', 'idExpiry', 'passportExpiry', 'drivingLicenceExpiry'];

  const isFieldComplete = (f: string) => profileData && profileData[f] && typeof profileData[f] === 'string' && profileData[f].trim() !== '';

  const isBasicComplete = basicFields.filter(isFieldComplete).length >= 4; // At least 4 basic fields
  const isAcademicComplete = academicFields.filter(isFieldComplete).length >= 4; // At least 4 academic fields
  const isEmergencyComplete = emergencyFields.every(isFieldComplete); // Both emergency fields
  const isAdditionalComplete = additionalFields.filter(isFieldComplete).length >= 2; // At least 2 additional fields

  const totalFields = [...basicFields, ...academicFields, ...emergencyFields, ...additionalFields];
  const filledFields = totalFields.filter(isFieldComplete).length;
  const profileCompletionPercentage = totalFields.length > 0 ? Math.round((filledFields / totalFields.length) * 100) : 0;

  const getCategoryCounts = () => {
    const counts = { Identity: 0, Education: 0, Career: 0, Projects: 0, Personal: 0, Other: 0 };
    recentFiles.forEach(file => {
      if (file.categoryId && Object.keys(counts).includes(file.categoryId)) {
        counts[file.categoryId as keyof typeof counts]++;
        return;
      }
      const name = file.name?.toLowerCase() || '';
      if (name.match(/id|passport|aadhaar|pan|license|driving|card/)) counts.Identity++;
      else if (name.match(/certificate|degree|mark|transcript|school|university|college|diploma/)) counts.Education++;
      else if (name.match(/resume|cv|offer|contract|salary|payslip|relieving|experience/)) counts.Career++;
      else if (name.match(/project|code|report|presentation/)) counts.Projects++;
      else if (name.match(/photo|family|letter|ticket|receipt|bill/)) counts.Personal++;
      else counts.Other++;
    });
    return counts;
  };
  const categoryCounts = getCategoryCounts();

  const getCategoryFiles = (files: any[], catName: string) => {
    return files.filter(f => {
      if (f.categoryId === catName) return true;
      if (f.categoryId && f.categoryId !== catName) return false;
      const name = f.name?.toLowerCase() || '';
      if (catName === 'Identity') return name.match(/id|passport|aadhaar|pan|license|driving|card/);
      if (catName === 'Education') return name.match(/certificate|degree|mark|transcript|school|university|college|diploma/);
      if (catName === 'Career') return name.match(/resume|cv|offer|contract|salary|payslip|relieving|experience/);
      if (catName === 'Projects') return name.match(/project|code|report|presentation/);
      if (catName === 'Personal') return name.match(/photo|family|letter|ticket|receipt|bill/);
      if (catName === 'Other') return !name.match(/id|passport|aadhaar|pan|license|driving|card|certificate|degree|mark|transcript|school|university|college|diploma|resume|cv|offer|contract|salary|payslip|relieving|experience|project|code|report|presentation|photo|family|letter|ticket|receipt|bill/);
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1c2a3f] border-r border-slate-700 fixed h-full z-20 shadow-2xl rounded-r-[32px]">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 mb-8 group">
            <Logo className="w-10 h-10 -ml-1 group-hover:scale-105 transition-transform" />
            <span className="font-bold text-xl tracking-tight text-white">SMART LOCKER</span>
          </Link>

          <nav className="space-y-1">
            <NavItem icon={<Home size={20}/>} label="Home" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
            <NavItem icon={<FileText size={20}/>} label="Documents" active={activeTab === 'Documents'} onClick={() => setActiveTab('Documents')} />
            <NavItem icon={<LayoutGrid size={20}/>} label="Categories" active={activeTab === 'Categories'} onClick={() => setActiveTab('Categories')} />
            <NavItem icon={<User size={20}/>} label="Personal Info" active={activeTab === 'Personal Info'} onClick={() => setActiveTab('Personal Info')} />
            <NavItem icon={<Folder size={20}/>} label="Collections" active={activeTab === 'Collections'} onClick={() => setActiveTab('Collections')} />
            <NavItem icon={<Heart size={20}/>} label="Favorites" active={activeTab === 'Favorites'} onClick={() => setActiveTab('Favorites')} />
            <NavItem icon={<Clock size={20}/>} label="Recent" active={activeTab === 'Recent'} onClick={() => setActiveTab('Recent')} />
            <NavItem icon={<Trash2 size={20}/>} label="Trash" active={activeTab === 'Trash'} onClick={() => setActiveTab('Trash')} />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1">
          <NavItem icon={<Shield size={20}/>} label="Security" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} />
          <NavItem icon={<Settings size={20}/>} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
          
          <div className="mt-6 pt-6 border-t border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-blue-400 font-bold overflow-hidden shadow-sm">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
              ) : (
                user?.displayName?.charAt(0) || "U"
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-semibold text-white truncate">{user?.displayName || "Student"}</div>
              <div className="text-xs text-slate-400 truncate">{user?.email || "Student"}</div>
            </div>
            <button 
              onClick={() => {
                 import('firebase/auth').then(({ signOut }) => signOut(auth));
              }}
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8 flex flex-col min-h-screen relative">
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        
        {/* DASHBOARD CONTENT (Top header removed per request) */}
        {/* DASHBOARD CONTENT */}
        {activeTab === 'Home' ? (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Greeting */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{getGreeting()}, {user?.displayName?.split(' ')[0] || 'User'}.</h1>
            <p className="text-slate-500">Everything important, right where you need it.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN (Main Overview & Actions) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* LOCKER OVERVIEW */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-blue-100 transition-colors duration-700"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">My Locker</h2>
                    <p className="text-sm text-slate-500">Your private space for important documents and information.</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100 shrink-0">
                    <ShieldCheck size={14} /> Protected
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{totalDocuments}</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Documents</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{storageDisplay.value} <span className="text-sm">{storageDisplay.unit}</span></div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Storage Used</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{collectionsCount}</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Collections</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">100%</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Organized</div>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between text-xs text-slate-500 font-medium mb-2">
                    <span>Storage</span>
                    <span>{storageDisplay.value} {storageDisplay.unit} of 10 GB used</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full relative overflow-hidden" style={{ width: `${storagePercent}%` }}>
                       <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Quick actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <UploadCard 
                    onClick={handleUploadClick}
                    isUploading={isUploading}
                    isSuccess={isUploadSuccess}
                    uploadProgress={uploadProgress}
                  />
                  <AddInfoCard onClick={() => setActiveTab('Personal Info')} />
                  <ScanCard onClick={() => showToast("Coming Soon", "Scanner functionality will be available in a future update.", "success")} />
                  <CreateCollectionCard onClick={() => setIsCreateCollectionOpen(true)} />
                </div>
              </div>

              {/* YOUR COLLECTIONS */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Your Collections</h3>
                  <button onClick={() => setActiveTab('Collections')} className="text-sm text-blue-600 font-medium hover:text-blue-700">View all</button>
                </div>
                {collections.length === 0 ? (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                    <Folder className="text-slate-300 mb-2" size={32} />
                    <p className="text-sm text-slate-500">No collections yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {collections.slice(0, 4).map((col, i) => {
                      const itemCount = recentFiles.filter((f: any) => f.collectionId === col.id).length;
                      return (
                        <div key={i} onClick={() => setActiveTab('Collection:' + col.id)} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Folder size={24} />
                          </div>
                          <h4 className="font-semibold text-slate-800 text-sm mb-1 truncate w-full">{col.name}</h4>
                          <p className="text-xs text-slate-500">{itemCount} items</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RECENTLY ADDED */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recently added</h3>
                  <Link href="#" className="text-sm text-blue-600 font-medium hover:text-blue-700">View all</Link>
                </div>
                
                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {unorganizedFiles.length === 0 && <EmptyState />}
                    {unorganizedFiles.slice(0, 5).map((file, i) => (
                      <div key={i} onClick={() => window.open(file.download_url || file.url, '_blank')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-blue-500 bg-blue-50">
                            <FileText size={18}/>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-slate-800">{file.name}</h4>
                            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <div className="hidden md:flex items-center gap-1">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Document" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={18} /></button>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Share Links" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={18} /></button>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download" onClick={(e) => { e.stopPropagation(); window.open(file.download_url || file.url, '_blank'); }}><Download size={18} /></button>
                                <HeartButton className="scale-90 origin-center -mx-1" isFavorite={file.isFavorite || false} onToggle={(e) => handleToggleFavorite(e, file)} />
                                <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={(e) => handleDeleteFile(e, file)}><Trash2 size={18} /></button>
                        </div>
                        {/* Mobile visible menu button */}
                        <div className="md:hidden flex gap-1">
                           <button className="p-1.5 text-slate-400" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={18} /></button>
                           <button className="p-1.5 text-slate-400" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={18} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (Categories, Info, Activity) */}
            <div className="space-y-8">
              
              {/* CATEGORIES */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Your documents</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Identity', count: categoryCounts.Identity, icon: <User size={16}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { name: 'Education', count: categoryCounts.Education, icon: <GraduationCap size={16}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { name: 'Career', count: categoryCounts.Career, icon: <Briefcase size={16}/>, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { name: 'Projects', count: categoryCounts.Projects, icon: <Folder size={16}/>, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { name: 'Personal', count: categoryCounts.Personal, icon: <Heart size={16}/>, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { name: 'Other', count: categoryCounts.Other, icon: <File size={16}/>, color: 'text-slate-600', bg: 'bg-slate-100' },
                  ].map((cat, i) => (
                    <div key={i} onClick={() => setActiveTab('Category:' + cat.name)} className="bg-white p-4 rounded-[20px] border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col gap-3">
                      <div className={`w-8 h-8 rounded-lg ${cat.bg} ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {cat.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{cat.name}</h4>
                        <p className="text-xs text-slate-500">{cat.count} items</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PERSONAL INFO CARD */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User size={16} />
                  </div>
                  <h3 className="font-semibold text-slate-900">Personal information</h3>
                </div>
                <p className="text-xs text-slate-500 mb-5">Keep your important details ready when you need them.</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-slate-700">Completion</span>
                    <span className="text-blue-600">{profileCompletionPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${profileCompletionPercentage}%` }}></div>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center justify-between text-sm">
                    <span className={isBasicComplete ? "text-slate-700" : "text-slate-500"}>Basic Information</span>
                    {isBasicComplete ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-slate-200" />}
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className={isAcademicComplete ? "text-slate-700" : "text-slate-500"}>Academic Information</span>
                    {isAcademicComplete ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-slate-200" />}
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className={isEmergencyComplete ? "text-slate-700" : "text-slate-500"}>Contact Information</span>
                    {isEmergencyComplete ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-slate-200" />}
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className={isAdditionalComplete ? "text-slate-700" : "text-slate-500"}>Additional Details</span>
                    {isAdditionalComplete ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-slate-200" />}
                  </li>
                </ul>

                <button onClick={() => setActiveTab('Personal Info')} className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 transition-colors">
                  {profileCompletionPercentage === 100 ? "View Profile" : "Complete Profile"}
                </button>
              </div>

              {/* SECURITY STATUS */}
              <div className="bg-slate-900 text-white rounded-[24px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <ShieldCheck size={16} />
                  </div>
                  <h3 className="font-semibold">Your locker is private.</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Account protection</span>
                    <span className="text-green-400 font-medium">Secure</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Last security check</span>
                    <span className="text-white">Today</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('Security')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors"
                >
                  Security settings
                </button>
              </div>

            </div>
          </div>
          </div>
        ) : activeTab === 'Documents' || activeTab.startsWith('Category:') ? (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-8 bg-white p-4 sm:px-6 sm:py-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                {activeTab.startsWith('Category:') && (
                  <button onClick={() => setActiveTab('Categories')} className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 shadow-sm border border-slate-100 hover:bg-slate-100 rounded-xl transition-colors">
                    <ChevronLeft size={20}/>
                  </button>
                )}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {activeTab.startsWith('Category:') ? activeTab.split(':')[1] + ' Documents' : 'All Documents'}
                  </h2>
                  {activeTab.startsWith('Category:') && (
                     <p className="text-sm text-slate-500">
                       {getCategoryFiles(recentFiles, activeTab.split(':')[1]).length} items
                     </p>
                  )}
                </div>
              </div>
              <button onClick={() => setIsUploadModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                <Plus size={18} /> Upload New
              </button>
            </div>
            
             <FilterControls />
            
            {getFilteredAndSortedFiles(activeTab.startsWith('Category:') ? getCategoryFiles(recentFiles, activeTab.split(':')[1]) : unorganizedFiles).length === 0 ? (
               <div className="mt-12 bg-white rounded-[32px] border border-slate-100 shadow-sm py-12">
                 <EmptyState />
               </div>
            ) : defaultFolderView === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {getFilteredAndSortedFiles(activeTab.startsWith('Category:') ? getCategoryFiles(recentFiles, activeTab.split(':')[1]) : unorganizedFiles).map((file, i) => (
                  <div key={i} onClick={() => window.open(file.download_url || file.url, '_blank')} className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-4 hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-full h-28 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-blue-400 group-hover:bg-blue-50/50 group-hover:scale-105 transition-all duration-300">
                      <FileText size={36} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 truncate mb-1 group-hover:text-blue-600 transition-colors" title={file.name}>{file.name}</h4>
                      <p className="text-xs text-slate-500 mt-auto">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 bg-white/95 backdrop-blur rounded-xl p-1 shadow-sm border border-slate-100 z-10">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={16} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Share" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={16} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={(e) => { e.stopPropagation(); handleDeleteFile(e, file); }}><Trash2 size={16} /></button>
                    </div>
                    <div className="absolute top-2 left-2 z-10" onClick={e => e.stopPropagation()}>
                       <HeartButton className="scale-75 origin-top-left" isFavorite={file.isFavorite || false} onToggle={(e) => handleToggleFavorite(e, file)} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {getFilteredAndSortedFiles(activeTab.startsWith('Category:') ? getCategoryFiles(recentFiles, activeTab.split(':')[1]) : unorganizedFiles).map((file, i) => (
                    <div key={i} onClick={() => window.open(file.download_url || file.url, '_blank')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-blue-500 bg-blue-50">
                          <FileText size={18}/>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-slate-800">{file.name}</h4>
                          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Document" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={18} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Share Links" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={18} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download" onClick={(e) => { e.stopPropagation(); window.open(file.download_url || file.url, '_blank'); }}><Download size={18} /></button>
                        <HeartButton className="scale-90 origin-center -mx-1" isFavorite={file.isFavorite || false} onToggle={(e) => handleToggleFavorite(e, file)} />
                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={(e) => handleDeleteFile(e, file)}><Trash2 size={18} /></button>
                      </div>
                      <div className="md:hidden flex gap-1">
                         <button className="p-1.5 text-slate-400" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={18} /></button>
                         <button className="p-1.5 text-slate-400" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'Categories' ? (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-8 bg-white p-4 sm:px-6 sm:py-5 rounded-2xl border border-slate-100 shadow-sm">
               <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider">Your documents</h2>
               <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                 <LayoutGrid size={20} />
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Identity', count: categoryCounts.Identity, icon: <User size={24}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
                { name: 'Education', count: categoryCounts.Education, icon: <GraduationCap size={24}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { name: 'Career', count: categoryCounts.Career, icon: <Briefcase size={24}/>, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { name: 'Projects', count: categoryCounts.Projects, icon: <Folder size={24}/>, color: 'text-purple-600', bg: 'bg-purple-50' },
                { name: 'Personal', count: categoryCounts.Personal, icon: <Heart size={24}/>, color: 'text-rose-600', bg: 'bg-rose-50' },
                { name: 'Other', count: categoryCounts.Other, icon: <File size={24}/>, color: 'text-slate-600', bg: 'bg-slate-100' },
              ].map((cat, i) => (
                <div key={i} onClick={() => setActiveTab('Category:' + cat.name)} className="bg-white p-6 rounded-[24px] border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{cat.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">{cat.count} items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'Personal Info' ? (
          <PersonalInfoView user={user} showToast={showToast} setGlobalProfileData={setProfileData} />
        ) : activeTab === 'Collections' ? (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-8 bg-white p-4 sm:px-6 sm:py-5 rounded-2xl border border-slate-100 shadow-sm">
               <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Collections</h2>
               <button onClick={() => setIsCreateCollectionOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                 <Plus size={18} /> New Collection
               </button>
            </div>
            
            {collections.length === 0 ? (
               <div className="mt-12 bg-white rounded-[32px] border border-slate-100 shadow-sm py-12 flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4"><Folder size={32}/></div>
                 <p className="text-slate-500 font-medium">No collections yet.</p>
               </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {collections.map((col, i) => {
                  const itemCount = recentFiles.filter((f: any) => f.collectionId === col.id).length;
                  return (
                    <div key={i} onClick={() => setActiveTab('Collection:' + col.id)} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Folder size={28} />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">{col.name}</h4>
                      <p className="text-xs text-slate-500">{itemCount} items</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeTab.startsWith('Collection:') ? (
          <div 
            className="relative p-4 sm:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300 min-h-screen"
            onDragEnter={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              dragCounter.current += 1;
              if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
                setIsDragging(true); 
              }
            }}
            onDragLeave={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              dragCounter.current -= 1;
              if (dragCounter.current === 0) {
                setIsDragging(false); 
              }
            }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
              dragCounter.current = 0;
              const file = e.dataTransfer.files?.[0];
              if (file) {
                setIsUploadModalOpen(true);
                processFile(file);
              }
            }}
          >
            {isDragging && (
              <div 
                className="absolute z-[100] animate-in fade-in duration-200 pointer-events-none grid place-items-center"
                style={{ inset: '14px', border: '2px dashed #6aa6ff', borderRadius: '22px', backgroundColor: '#f3f8ff' }}
              >
                <div className="flex flex-col items-center" style={{ gap: '6px' }}>
                  <svg style={{ width: '72px', height: '72px', color: '#6aa6ff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/>
                    <g className="animate-cloud-up"><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></g>
                  </svg>
                  <h2 style={{ margin: '18px 0 0', fontSize: '26px', fontWeight: '600', color: '#4a8cf5' }}>Drop file to upload</h2>
                  <span style={{ fontSize: '16px', color: '#6aa6ff' }}>Release to add to this collection</span>
                </div>
              </div>
            )}
            {(() => {
               const collectionId = activeTab.split(':')[1];
               const col = collections.find(c => c.id === collectionId);
               const collectionFiles = recentFiles.filter((f: any) => f.collectionId === collectionId);
               return (
                 <>
                   <div className="flex justify-between items-center mb-8 bg-white p-4 sm:px-6 sm:py-5 rounded-2xl border border-slate-100 shadow-sm">
                     <div className="flex items-center gap-4">
                       <button onClick={() => setActiveTab('Collections')} className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 shadow-sm border border-slate-100 hover:bg-slate-100 rounded-xl transition-colors"><ChevronLeft size={20}/></button>
                       <div>
                         <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{col?.name || 'Collection'}</h2>
                         <p className="text-sm text-slate-500">{collectionFiles.length} items</p>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => { setDeleteConfirmCollection(col); setDeleteCollectionInput(''); }} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                         <Trash2 size={18} /> Delete Collection
                       </button>
                       <button onClick={() => setIsUploadModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                         <Upload size={18} /> Upload Here
                       </button>
                     </div>
                   </div>
                   
                   <FilterControls />
                   
                   {getFilteredAndSortedFiles(collectionFiles).length === 0 ? (
                      <div className="mt-12 bg-white rounded-[32px] border border-slate-100 shadow-sm py-16 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4"><FileText size={40}/></div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No files match your filters</h3>
                        <p className="text-slate-500 font-medium mb-6">Upload some files or adjust your search.</p>
                        <button onClick={() => setIsUploadModalOpen(true)} className="text-blue-600 bg-blue-50 px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-100 transition-colors active:scale-95">Upload File</button>
                      </div>
                   ) : (
                     <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                       <div className="divide-y divide-slate-100">
                         {getFilteredAndSortedFiles(collectionFiles).map((file: any, i: number) => (
                           <div key={i} onClick={() => window.open(file.download_url || file.url, '_blank')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-blue-500 bg-blue-50">
                                 <FileText size={18}/>
                               </div>
                               <div>
                                 <h4 className="font-medium text-sm text-slate-800">{file.name}</h4>
                                 <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                               </div>
                             </div>
                             <div className="hidden md:flex items-center gap-1">
                               <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Document" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={18} /></button>
                               <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Share Links" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={18} /></button>
                               <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download" onClick={(e) => { e.stopPropagation(); window.open(file.download_url || file.url, '_blank'); }}><Download size={18} /></button>
                               <HeartButton className="scale-90 origin-center -mx-1" isFavorite={file.isFavorite || false} onToggle={(e) => handleToggleFavorite(e, file)} />
                               <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={(e) => handleDeleteFile(e, file)}><Trash2 size={18} /></button>
                             </div>
                             <div className="md:hidden flex gap-1">
                                <button className="p-1.5 text-slate-400" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={18} /></button>
                                <button className="p-1.5 text-slate-400" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={18} /></button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </>
               )
            })()}
          </div>
        ) : activeTab === 'Favorites' ? (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                <Heart size={24} className="fill-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Favorites</h2>
                <p className="text-slate-500 text-sm">Your most important files and documents.</p>
              </div>
            </div>
            
            {getFilteredAndSortedFiles(recentFiles.filter((f: any) => f.isFavorite)).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                <Heart size={48} className="text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No favorites yet</h3>
                <p className="text-slate-500">Click the heart icon on any file to add it to your favorites.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {getFilteredAndSortedFiles(recentFiles.filter((f: any) => f.isFavorite)).map((file: any, i: number) => (
                  <div key={i} onClick={() => setViewFile(file)} className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-xl ${
                        file.type?.includes('pdf') ? 'bg-red-50 text-red-600' :
                        file.type?.includes('image') ? 'bg-blue-50 text-blue-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {file.type?.includes('pdf') ? <FileText size={24}/> :
                         file.type?.includes('image') ? <FileBadge size={24}/> :
                         <File size={24}/>}
                      </div>
                      <div className="hidden md:flex items-center gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={18} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Share" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={18} /></button>
                        <HeartButton className="scale-90 origin-center -mx-1" isFavorite={file.isFavorite || false} onToggle={(e) => handleToggleFavorite(e, file)} />
                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={(e) => handleDeleteFile(e, file)}><Trash2 size={18} /></button>
                      </div>
                      <div className="md:hidden flex gap-1">
                        <button className="p-1.5 text-slate-400" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={18} /></button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-900 truncate mb-1">{file.name}</h3>
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{file.type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                      <span className="text-xs text-slate-400 truncate">{new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'Security' ? (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Security Settings</h2>
                  <p className="text-sm text-slate-500">Manage your account protection and authentication methods</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">2-Step Verification (OTP)</h3>
                    <p className="text-sm text-slate-600 max-w-lg">Protect your account with an extra layer of security. When enabled, a 6-digit code will be emailed to you every time you sign in.</p>
                  </div>
                  
                  <button 
                    onClick={toggleTwoStep}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoStepEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <span className="sr-only">Toggle 2-Step Verification</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${twoStepEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
                <div className="p-4 bg-white text-sm text-slate-500 flex items-center gap-2">
                  <ShieldCheck size={16} className={twoStepEnabled ? "text-green-500" : "text-slate-400"} />
                  {twoStepEnabled ? "Your account is currently protected by 2-step verification." : "We highly recommend enabling 2-step verification for maximum security."}
                </div>
              </div>

              {/* Login Alerts */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-1">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Unrecognized Login Alerts</h3>
                      <p className="text-sm text-slate-600 max-w-lg">Get instantly notified via email if anyone logs into your account from a new device or unfamiliar location.</p>
                    </div>
                  </div>
                  <button onClick={() => showToast('Success', 'Login alerts have been enabled', 'success')} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-orange-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm">
                    Enable Alerts
                  </button>
                </div>
                <div className="p-4 bg-white text-sm text-slate-500">
                  Status: Currently disabled for this account
                </div>
              </div>

              {/* Account Recovery */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-1">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Account Recovery</h3>
                      <p className="text-sm text-slate-600 max-w-lg">Set up backup methods so you can regain access to your account if you ever forget your password.</p>
                    </div>
                  </div>
                  <button onClick={() => showToast('Info', 'Manage recovery options', 'success')} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-purple-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm">
                    Manage Methods
                  </button>
                </div>
                <div className="p-4 bg-white flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Recovery Email</span>
                    <span className="font-medium text-slate-900">{user?.email || "Not set"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Recovery Phone</span>
                    <span className="font-medium text-slate-400 italic">Not configured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'Settings' ? (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                  <Settings size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Application Settings</h2>
                  <p className="text-sm text-slate-500">Manage your general application preferences</p>
                </div>
              </div>

              {/* Email Notifications */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Email Notifications</h3>
                      <p className="text-sm text-slate-600 max-w-lg">Receive weekly summaries of your storage usage and important updates about your Smart Locker.</p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleEmailNotifications}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailNotificationsEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <span className="sr-only">Toggle Notifications</span>
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Storage Management */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-1">
                      <Folder size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Storage Management</h3>
                      <p className="text-sm text-slate-600 max-w-lg">View your current storage usage across all your files and collections.</p>
                    </div>
                  </div>
                  <button onClick={() => showToast('Info', 'Upgrade options coming soon', 'success')} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors whitespace-nowrap">
                    Upgrade Plan
                  </button>
                </div>
                <div className="p-6 bg-white flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-semibold text-slate-700">12.4 GB <span className="font-normal text-slate-500">used of 15 GB</span></span>
                    <span className="text-slate-500">82%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>

              {/* Default View */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                      <LayoutList size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Default Folder View</h3>
                      <p className="text-sm text-slate-600 max-w-lg">Choose how you want your documents and collections to be displayed by default.</p>
                    </div>
                  </div>
                  <div className="flex bg-slate-200/50 p-1 rounded-lg">
                    <button onClick={() => changeDefaultView('list')} className={`${defaultFolderView === 'list' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'} px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors`}><LayoutList size={14}/> List</button>
                    <button onClick={() => changeDefaultView('grid')} className={`${defaultFolderView === 'grid' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'} px-4 py-1.5 rounded-md text-sm font-medium transition-colors`}>Grid</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'Recent' ? (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Recent Documents</h2>
                <p className="text-slate-500 text-sm">Your most recently uploaded or accessed files.</p>
              </div>
            </div>
            
            {recentFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                <Clock size={48} className="text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No recent files</h3>
                <p className="text-slate-500">Upload some documents to see them here.</p>
              </div>
            ) : defaultFolderView === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...recentFiles].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20).map((file, i) => (
                  <div key={i} onClick={() => window.open(file.download_url || file.url, '_blank')} className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-4 hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-full h-28 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-blue-400 group-hover:bg-blue-50/50 group-hover:scale-105 transition-all duration-300">
                      <FileText size={36} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 truncate mb-1 group-hover:text-blue-600 transition-colors" title={file.name}>{file.name}</h4>
                      <p className="text-xs text-slate-500 mt-auto">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 bg-white/95 backdrop-blur rounded-xl p-1 shadow-sm border border-slate-100 z-10">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={16} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Share" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={16} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={(e) => { e.stopPropagation(); handleDeleteFile(e, file); }}><Trash2 size={16} /></button>
                    </div>
                    <div className="absolute top-2 left-2 z-10" onClick={e => e.stopPropagation()}>
                       <HeartButton className="scale-75 origin-top-left" isFavorite={file.isFavorite || false} onToggle={(e) => handleToggleFavorite(e, file)} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {[...recentFiles].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20).map((file: any, i: number) => (
                    <div key={i} onClick={() => window.open(file.download_url || file.url, '_blank')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-blue-500 bg-blue-50">
                          <FileText size={18}/>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-slate-800">{file.name}</h4>
                          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Document" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={18} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Share Links" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={18} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download" onClick={(e) => { e.stopPropagation(); window.open(file.download_url || file.url, '_blank'); }}><Download size={18} /></button>
                        <HeartButton className="scale-90 origin-center -mx-1" isFavorite={file.isFavorite || false} onToggle={(e) => handleToggleFavorite(e, file)} />
                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={(e) => handleDeleteFile(e, file)}><Trash2 size={18} /></button>
                      </div>
                      <div className="md:hidden flex gap-1">
                         <button className="p-1.5 text-slate-400" onClick={(e) => { e.stopPropagation(); setViewFile(file); }}><Eye size={18} /></button>
                         <button className="p-1.5 text-slate-400" onClick={(e) => { e.stopPropagation(); setShareFile(file); }}><Share2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-300 min-h-[60vh]">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
              {activeTab === 'Collections' && <Folder size={32} />}
              {activeTab === 'Favorites' && <Heart size={32} />}
              {activeTab === 'Recent' && <Clock size={32} />}
              {activeTab === 'Trash' && <Trash2 size={32} />}
              {activeTab === 'Settings' && <Settings size={32} />}
              {activeTab === 'Search' && <Search size={32} />}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeTab}</h2>
            <p className="text-slate-500 max-w-md mx-auto">This section is currently under construction. Check back soon for updates to your digital locker.</p>
          </div>
        )}
      </main>

      {/* SHARE MODAL */}
      {shareFile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShareFile(null)}>
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Share2 size={20} className="text-blue-600"/> Share Document</h3>
              <button onClick={() => setShareFile(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500 mb-4">Share <span className="font-semibold text-slate-800">{shareFile.name}</span> using any of the links below:</p>
              
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Direct / Raw Link</label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={shareFile.urls?.raw || shareFile.url} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 outline-none" />
                    <button onClick={() => { navigator.clipboard.writeText(shareFile.urls?.raw || shareFile.url); showToast('Link Copied', 'Direct link copied to clipboard.'); }} className="px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors active:scale-95"><Copy size={16}/></button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Fast CDN (jsDelivr)</label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={shareFile.urls?.jsdelivr || ''} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 outline-none" />
                    <button onClick={() => { navigator.clipboard.writeText(shareFile.urls?.jsdelivr || ''); showToast('Link Copied', 'CDN link copied to clipboard.'); }} className="px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors active:scale-95"><Copy size={16}/></button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">GitHub View</label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={shareFile.urls?.github || ''} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 outline-none" />
                    <button onClick={() => { navigator.clipboard.writeText(shareFile.urls?.github || ''); showToast('Link Copied', 'GitHub link copied to clipboard.'); }} className="px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors active:scale-95"><Copy size={16}/></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewFile && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {viewFile.name.toLowerCase().match(/\.pdf$/) ? (
            <PdfViewer file={viewFile} onClose={() => setViewFile(null)} />
          ) : (
            <>
              <div className="px-4 py-3 sm:p-4 border-b border-slate-200 flex justify-between items-center bg-white z-10 shadow-sm shrink-0">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2 truncate max-w-[60%] sm:max-w-[80%]"><Eye size={20} className="text-blue-600 shrink-0"/> <span className="truncate">{viewFile.name}</span></h3>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setViewFile(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors active:scale-95">Close</button>
                </div>
              </div>
              <div className="flex-1 bg-slate-100 overflow-hidden relative flex flex-col">
                {viewFile.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|svg)$/) ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img src={viewFile.urls?.jsdelivr || viewFile.url} alt={viewFile.name} className="max-w-full max-h-full object-contain rounded-lg shadow-md" />
                  </div>
                ) : (
                  <iframe 
                    src={viewFile.urls?.jsdelivr || viewFile.url} 
                    className="w-full h-full border-none bg-white"
                    title={viewFile.name}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmFile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => { if (!isDeletingFile && !deleteFileSuccess) setDeleteConfirmFile(null); }}>
          <div className="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-center" onClick={e => e.stopPropagation()}>
            {deleteFileSuccess ? (
              <div className="p-12 flex flex-col items-center justify-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="animate-tick-pop" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Successfully Deleted</h3>
                <p className="text-slate-500 text-sm">The file has been removed.</p>
              </div>
            ) : isDeletingFile ? (
              <div className="p-12 flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-red-500 rounded-full animate-spin mb-6"></div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Deleting File...</h3>
                <p className="text-slate-500 text-sm">Removing file securely.</p>
              </div>
            ) : (
              <>
                <div className="p-8">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Delete File?</h3>
                  <p className="text-slate-500 text-sm">
                    Are you sure you want to permanently delete <strong className="text-slate-700">{deleteConfirmFile.name}</strong>? This action cannot be undone and will remove it from both your locker and the storage.
                  </p>
                </div>
                <div className="flex border-t border-slate-100">
                  <button onClick={() => setDeleteConfirmFile(null)} className="flex-1 py-4 font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                  <div className="w-[1px] bg-slate-100"></div>
                  <button onClick={confirmDeleteFile} className="flex-1 py-4 font-bold text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* DELETE COLLECTION CONFIRMATION MODAL */}
      {deleteConfirmCollection && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => { if (!isDeletingCollection && !deleteCollectionSuccess) { setDeleteConfirmCollection(null); setDeleteCollectionInput(''); } }}>
          <div className="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-center" onClick={e => e.stopPropagation()}>
            {deleteCollectionSuccess ? (
              <div className="p-12 flex flex-col items-center justify-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="animate-tick-pop" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Successfully Deleted</h3>
                <p className="text-slate-500 text-sm">The collection has been removed.</p>
              </div>
            ) : isDeletingCollection ? (
              <div className="p-12 flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-red-500 rounded-full animate-spin mb-6"></div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Deleting Collection...</h3>
                <p className="text-slate-500 text-sm">Removing all files securely.</p>
              </div>
            ) : (
              <>
                <div className="p-8">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Delete Collection?</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Are you sure you want to permanently delete <strong className="text-slate-700">{deleteConfirmCollection.name}</strong> and all of its files? This action cannot be undone.
                  </p>
                  <div className="text-left bg-red-50 p-4 rounded-xl border border-red-100 mb-2">
                    <label className="block text-xs font-bold text-red-800 mb-2 uppercase tracking-wider">Type "{deleteConfirmCollection.name}" to confirm</label>
                    <input 
                      type="text" 
                      value={deleteCollectionInput}
                      onChange={(e) => setDeleteCollectionInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="flex border-t border-slate-100">
                  <button onClick={() => { setDeleteConfirmCollection(null); setDeleteCollectionInput(''); }} className="flex-1 py-4 font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                  <div className="w-[1px] bg-slate-100"></div>
                  <button 
                    onClick={confirmDeleteCollection} 
                    disabled={deleteCollectionInput !== deleteConfirmCollection.name}
                    className="flex-1 py-4 font-bold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    Delete Everything
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CREATE COLLECTION MODAL */}
      {isCreateCollectionOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsCreateCollectionOpen(false)}>
          <div className="bg-white rounded-[24px] p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <Folder size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Create Collection</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Collections help you group related documents together (like &quot;Tax Returns&quot; or &quot;Medical Records&quot;) so you can keep your locker perfectly organized.
            </p>
            <form onSubmit={handleCreateCollectionSubmit}>
              <div className="mb-6">
                <label htmlFor="collectionName" className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Collection Name</label>
                <input 
                  type="text" 
                  id="collectionName"
                  autoFocus
                  placeholder="e.g., Travel Documents"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm font-medium"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsCreateCollectionOpen(false)} className="flex-1 py-3 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={!newCollectionName.trim()} className="flex-1 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl transition-colors shadow-sm">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-6 py-4 rounded-2xl shadow-2xl border z-50 flex items-start gap-4 max-w-sm
          ${toast.isHiding ? 'animate-toast-exit' : 'animate-toast-enter'}
          ${toast.type === 'error' 
            ? 'bg-red-600 dark:bg-red-500 border-red-700 dark:border-red-400 text-white' 
            : 'bg-slate-900 dark:bg-white border-slate-800 dark:border-slate-100 text-white dark:text-slate-900'}`}>
          <div className="shrink-0 mt-0.5">
            {toast.type === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white animate-tick-pop"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            ) : (
              <CheckCircle2 size={24} className={`animate-tick-pop ${toast.type === 'error' ? '' : 'text-emerald-400 dark:text-emerald-500'}`} />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{toast.message}</h4>
            {toast.description && <p className={`text-xs mt-1 leading-relaxed ${toast.type === 'error' ? 'text-red-100' : 'text-slate-300 dark:text-slate-600'}`}>{toast.description}</p>}
          </div>
          <button onClick={closeToast} className={`transition-colors ${toast.type === 'error' ? 'text-red-200 hover:text-white' : 'text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-slate-900'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}

      {/* MOBILE FLOATING ACTION BUTTON */}
      <button className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center active:scale-95 transition-transform z-30 border border-blue-500">
        <Plus size={28} />
      </button>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 pb-safe z-40">
        <div className="flex items-center justify-around h-16 px-2">
          <MobileNavItem icon={<Home size={24}/>} label="Home" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
          <MobileNavItem icon={<FileText size={24}/>} label="Docs" active={activeTab === 'Documents'} onClick={() => setActiveTab('Documents')} />
          
          {/* Centered Add Button alternative */}
          <div onClick={handleUploadClick} className="w-12 h-12 -mt-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-50 cursor-pointer active:scale-95 transition-transform">
            <Plus size={24} />
          </div>

          <MobileNavItem icon={<Search size={24}/>} label="Search" active={activeTab === 'Search'} onClick={() => setActiveTab('Search')} />
          <MobileNavItem icon={<LayoutGrid size={24}/>} label="Categories" active={activeTab === 'Categories'} onClick={() => setActiveTab('Categories')} />
          <MobileNavItem icon={<User size={24}/>} label="Profile" active={activeTab === 'Personal Info'} onClick={() => setActiveTab('Personal Info')} />
        </div>
      </nav>
      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => !isUploading && setIsUploadModalOpen(false)}>
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-bold text-xl text-slate-900">Upload File</h3>
              <button onClick={() => !isUploading && setIsUploadModalOpen(false)} disabled={isUploading} className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50">
                <Minus size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {isUploadSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="animate-tick-pop" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Upload Complete!</h3>
                  <p className="text-slate-500 text-sm">Your file has been safely stored.</p>
                </div>
              ) : isUploading ? (
                <div className="py-12 flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <div className="w-24 h-24 relative flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-blue-600 transition-all duration-300 ease-out" strokeDasharray={`${uploadProgress}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-700 text-xl">{uploadProgress}%</div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Uploading securely...</h3>
                  <p className="text-slate-500 text-sm">Please keep this window open.</p>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50'} rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processFile(file);
                  }}
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-500 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/>
                      <g className="animate-cloud-up"><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></g>
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Click or drag and drop</h3>
                  <p className="text-sm text-slate-500 max-w-[200px]">Upload PDFs, images, or documents up to 50MB.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents for cleaner code
function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${
        active 
          ? 'bg-blue-500/15 text-blue-300 shadow-sm' 
          : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
      }`}
    >
      <div className={active ? 'text-blue-300' : 'text-slate-500'}>{icon}</div>
      {label}
    </button>
  );
}

function MobileNavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 gap-1 ${
        active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function ActivityItem({ text, time }: { text: string, time: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-1 w-2 h-2 rounded-full bg-slate-300 shrink-0"></div>
      <div>
        <p className="text-sm font-medium text-slate-700 leading-tight">{text}</p>
        <p className="text-xs text-slate-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
