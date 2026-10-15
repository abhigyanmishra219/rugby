'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import {
  CheckCircle,
  Clock,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Search,
  LogOut,
  User as UserIcon,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Flame,
  Check,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Info,
  Users,
  UserPlus,
  Lock,
  ShieldCheck,
  UserCheck,
  Award,
  Briefcase,
} from 'lucide-react';
import OfficialTable from '@/components/OfficialTable';
import OfficialDetailsModal, { OfficialRecordDetail } from '@/components/OfficialDetailsModal';
import RejectionModal from '@/components/RejectionModal';

interface PlayerRecord {
  _id: string;
  registrationId: string;
  fullName: string;
  fatherName: string;
  dob: string;
  district: string;
  contactNumber: string;
  email: string;
  nsrsId?: string;
  address: string;
  emergencyContact?: string;
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED' | 'DELETED';
  approvedBy?: string;
  approvedById?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedById?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  deletedBy?: string;
  deletedById?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardCounts {
  total: number;
  pending: number;
  approved: number;
  deleted: number;
}

export interface AllDashboardCounts {
  players: { approved: number; pending: number; deleted: number; total: number };
  coaches: { approved: number; pending: number };
  managers: { approved: number; pending: number };
  referees: { approved: number; pending: number };
  admins: { total: number };
}

interface AdminUserRecord {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdBy?: string;
  createdById?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminCounts {
  total: number;
  active: number;
  createdByMe: number;
}

export type TabType =
  | 'APPROVED_PLAYERS'
  | 'PENDING_PLAYERS'
  | 'APPROVED_COACHES'
  | 'PENDING_COACHES'
  | 'APPROVED_MANAGERS'
  | 'PENDING_MANAGERS'
  | 'APPROVED_REFEREES'
  | 'PENDING_REFEREES'
  | 'DELETED_PLAYERS'
  | 'ADMINS';

export default function AdminDashboardPage() {
  const { user, token, isLoading: isAuthLoading, logout } = useUser();
  const router = useRouter();

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('APPROVED_PLAYERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Player Data state
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [counts, setCounts] = useState<DashboardCounts>({ total: 0, pending: 0, approved: 0, deleted: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [totalMatching, setTotalMatching] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Officials Data state (Coach, Manager, Referee)
  const [officials, setOfficials] = useState<OfficialRecordDetail[]>([]);
  const [selectedOfficial, setSelectedOfficial] = useState<OfficialRecordDetail | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<{
    id: string;
    name: string;
    role: 'PLAYER' | 'COACH' | 'MANAGER' | 'REFEREE';
    registrationId: string;
  } | null>(null);

  // Global counts across all 10 tabs
  const [allCounts, setAllCounts] = useState<AllDashboardCounts>({
    players: { approved: 0, pending: 0, deleted: 0, total: 0 },
    coaches: { approved: 0, pending: 0 },
    managers: { approved: 0, pending: 0 },
    referees: { approved: 0, pending: 0 },
    admins: { total: 0 },
  });

  // Admin Management Data state
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [adminCounts, setAdminCounts] = useState<AdminCounts>({ total: 0, active: 0, createdByMe: 0 });
  const [adminSearch, setAdminSearch] = useState('');
  const [debouncedAdminSearch, setDebouncedAdminSearch] = useState('');
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Create Admin Form state
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminConfirmPassword, setNewAdminConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Modals state for Admins
  const [selectedAdminUser, setSelectedAdminUser] = useState<AdminUserRecord | null>(null);
  const [deleteConfirmAdmin, setDeleteConfirmAdmin] = useState<AdminUserRecord | null>(null);

  // Processing action state
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Notification Banner
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Modals state for Players
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerRecord | null>(null);
  const [deleteConfirmPlayer, setDeleteConfirmPlayer] = useState<{
    player: PlayerRecord;
    isPermanent: boolean;
  } | null>(null);

  // Route protection
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/signin');
    }
  }, [user, isAuthLoading, router]);

  // Debounce search input for players and officials
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce search input for admins
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAdminSearch(adminSearch);
    }, 350);
    return () => clearTimeout(timer);
  }, [adminSearch]);

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Helper to get auth header
  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    return headers;
  }, [token]);

  const isOfficialTab = (tab: TabType) => {
    return [
      'APPROVED_COACHES',
      'PENDING_COACHES',
      'APPROVED_MANAGERS',
      'PENDING_MANAGERS',
      'APPROVED_REFEREES',
      'PENDING_REFEREES',
    ].includes(tab);
  };

  const getOfficialTypeAndStatus = (tab: TabType): { type: 'COACH' | 'MANAGER' | 'REFEREE'; status: 'APPROVED' | 'PENDING' } => {
    switch (tab) {
      case 'APPROVED_COACHES': return { type: 'COACH', status: 'APPROVED' };
      case 'PENDING_COACHES': return { type: 'COACH', status: 'PENDING' };
      case 'APPROVED_MANAGERS': return { type: 'MANAGER', status: 'APPROVED' };
      case 'PENDING_MANAGERS': return { type: 'MANAGER', status: 'PENDING' };
      case 'APPROVED_REFEREES': return { type: 'REFEREE', status: 'APPROVED' };
      case 'PENDING_REFEREES': return { type: 'REFEREE', status: 'PENDING' };
      default: return { type: 'COACH', status: 'APPROVED' };
    }
  };

  const getPlayerStatus = (tab: TabType): 'APPROVED' | 'PENDING' | 'DELETED' => {
    if (tab === 'PENDING_PLAYERS') return 'PENDING';
    if (tab === 'DELETED_PLAYERS') return 'DELETED';
    return 'APPROVED';
  };

  // Fetch all counts across tabs
  const fetchAllCounts = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/admin/counts', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.counts) {
          setAllCounts(data.counts);
          setCounts({
            total: data.counts.players.total,
            pending: data.counts.players.pending,
            approved: data.counts.players.approved,
            deleted: data.counts.players.deleted,
          });
          setAdminCounts((prev) => ({ ...prev, total: data.counts.admins.total }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin counts:', err);
    }
  }, [user, getAuthHeaders]);

  // Fetch official registrations (Coach, Manager, Referee)
  const fetchOfficials = useCallback(
    async (showLoadingSpinner = true) => {
      if (!user) return;
      const { type, status } = getOfficialTypeAndStatus(activeTab);

      if (showLoadingSpinner) setIsLoadingData(true);
      else setIsRefreshing(true);

      try {
        const queryParams = new URLSearchParams({
          type,
          status,
          search: debouncedSearch,
          page: currentPage.toString(),
          limit: pageSize.toString(),
        });

        const res = await fetch(`/api/admin/officials?${queryParams.toString()}`, {
          headers: getAuthHeaders(),
        });

        if (res.status === 401) {
          router.replace('/signin');
          return;
        }

        const data = await res.json();
        if (data.success) {
          setOfficials(data.officials || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalMatching(data.pagination?.total || 0);
        } else {
          setNotification({ type: 'error', message: data.message || 'Failed to load official registrations.' });
        }
      } catch (err: any) {
        setNotification({ type: 'error', message: err.message || 'Error connecting to database.' });
      } finally {
        setIsLoadingData(false);
        setIsRefreshing(false);
      }
    },
    [user, activeTab, debouncedSearch, currentPage, pageSize, getAuthHeaders, router]
  );

  // Fetch registrations from API
  const fetchRegistrations = useCallback(
    async (showLoadingSpinner = true) => {
      if (!user) return;
      const playerStatus = getPlayerStatus(activeTab);

      if (showLoadingSpinner) setIsLoadingData(true);
      else setIsRefreshing(true);

      try {
        const queryParams = new URLSearchParams({
          status: playerStatus,
          search: debouncedSearch,
          page: currentPage.toString(),
          limit: pageSize.toString(),
        });

        const res = await fetch(`/api/admin/registrations?${queryParams.toString()}`, {
          headers: getAuthHeaders(),
        });

        if (res.status === 401) {
          router.replace('/signin');
          return;
        }

        const data = await res.json();
        if (data.success) {
          setPlayers(data.registrations || []);
          setCounts(data.counts || { total: 0, pending: 0, approved: 0, deleted: 0 });
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalMatching(data.pagination?.total || 0);
        } else {
          setNotification({ type: 'error', message: data.message || 'Failed to load player registrations.' });
        }
      } catch (err: any) {
        setNotification({ type: 'error', message: err.message || 'Error connecting to database.' });
      } finally {
        setIsLoadingData(false);
        setIsRefreshing(false);
      }
    },
    [user, activeTab, debouncedSearch, currentPage, pageSize, getAuthHeaders, router]
  );

  // Fetch admin accounts from API
  const fetchAdminAccounts = useCallback(
    async (showLoadingSpinner = true) => {
      if (!user) return;
      if (showLoadingSpinner) setIsLoadingAdmins(true);
      else setIsRefreshing(true);

      try {
        const queryParams = new URLSearchParams({
          search: debouncedAdminSearch,
        });

        const res = await fetch(`/api/admin/users?${queryParams.toString()}`, {
          headers: getAuthHeaders(),
        });

        if (res.status === 401) {
          router.replace('/signin');
          return;
        }

        const data = await res.json();
        if (data.success) {
          setAdminUsers(data.users || []);
          setAdminCounts(data.counts || { total: 0, active: 0, createdByMe: 0 });
        } else {
          setNotification({ type: 'error', message: data.message || 'Failed to load administrator accounts.' });
        }
      } catch (err: any) {
        setNotification({ type: 'error', message: err.message || 'Error connecting to database.' });
      } finally {
        setIsLoadingAdmins(false);
        setIsRefreshing(false);
      }
    },
    [user, debouncedAdminSearch, getAuthHeaders, router]
  );

  // Master fetch router
  const fetchCurrentData = useCallback(
    async (showLoadingSpinner = true) => {
      if (activeTab === 'ADMINS') {
        await fetchAdminAccounts(showLoadingSpinner);
      } else if (isOfficialTab(activeTab)) {
        await fetchOfficials(showLoadingSpinner);
      } else {
        await fetchRegistrations(showLoadingSpinner);
      }
    },
    [activeTab, fetchAdminAccounts, fetchOfficials, fetchRegistrations]
  );

  // Initial and reactive load: Fetch data and global counts
  useEffect(() => {
    if (user) {
      fetchCurrentData(true);
      fetchAllCounts();
    }
  }, [user, activeTab, debouncedSearch, debouncedAdminSearch, currentPage, fetchCurrentData, fetchAllCounts]);

  // Handle Approve Player
  const handleApprove = async (player: PlayerRecord) => {
    setProcessingId(player._id);
    try {
      const res = await fetch(`/api/admin/registrations/${player._id}/approve`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: 'success',
          message: `Player ${player.fullName} (${player.registrationId}) approved successfully!`,
        });
        await Promise.all([fetchCurrentData(false), fetchAllCounts()]);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to approve player.',
        });
        await fetchCurrentData(false);
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to approve player.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Approve Official (Coach, Manager, Referee)
  const handleApproveOfficial = async (id: string, name: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/officials/${id}/approve`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: 'success',
          message: data.message || `Official ${name} approved successfully!`,
        });
        await Promise.all([fetchCurrentData(false), fetchAllCounts()]);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to approve official registration.',
        });
        await fetchCurrentData(false);
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to approve official.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Confirm Rejection (Player or Official)
  const handleConfirmRejection = async (reason: string) => {
    if (!rejectModalItem) return;
    setProcessingId(rejectModalItem.id);

    try {
      const endpoint = rejectModalItem.role === 'PLAYER'
        ? `/api/admin/registrations/${rejectModalItem.id}/reject`
        : `/api/admin/officials/${rejectModalItem.id}/reject`;

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectionReason: reason }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: 'success',
          message: data.message || `${rejectModalItem.role} ${rejectModalItem.name} rejected.`,
        });
        setRejectModalItem(null);
        await Promise.all([fetchCurrentData(false), fetchAllCounts()]);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to reject registration.',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error occurred while rejecting registration.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Soft or Permanent Delete Player
  const handleConfirmDeletePlayer = async () => {
    if (!deleteConfirmPlayer) return;
    const { player, isPermanent } = deleteConfirmPlayer;
    setProcessingId(player._id);

    try {
      const url = `/api/admin/registrations/${player._id}${isPermanent ? '?permanent=true' : ''}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: 'success',
          message: data.message || (isPermanent ? 'Player record permanently deleted.' : 'Player moved to Deleted tab.'),
        });
        setDeleteConfirmPlayer(null);
        await fetchRegistrations(false);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to delete player registration.',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error occurred during deletion.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Restore Player
  const handleRestore = async (player: PlayerRecord) => {
    setProcessingId(player._id);
    try {
      const res = await fetch(`/api/admin/registrations/${player._id}/restore`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: 'success',
          message: `Player ${player.fullName} restored to Pending Approvals.`,
        });
        await fetchRegistrations(false);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to restore player.',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to restore player.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Create Admin Account Submission
  const handleCreateAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!newAdminName.trim() || newAdminName.trim().length < 2) {
      errors.name = 'Full name is required (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newAdminEmail.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(newAdminEmail.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!newAdminPassword) {
      errors.password = 'Password is required';
    } else if (newAdminPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!newAdminConfirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (newAdminPassword !== newAdminConfirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsCreatingAdmin(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newAdminName.trim(),
          email: newAdminEmail.trim(),
          password: newAdminPassword,
          confirmPassword: newAdminConfirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: 'success',
          message: data.message || `Administrator account for ${newAdminName} created successfully!`,
        });
        // Reset form fields
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPassword('');
        setNewAdminConfirmPassword('');
        // Refresh admin accounts & counts
        await fetchAdminAccounts(false);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to create administrator account.',
        });
        if (data.message && data.message.toLowerCase().includes('email')) {
          setFormErrors({ email: data.message });
        }
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Network error occurred while creating admin account.',
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  // Handle Permanent Delete Admin Account
  const handleConfirmDeleteAdmin = async () => {
    if (!deleteConfirmAdmin) return;
    setProcessingId(deleteConfirmAdmin._id);

    try {
      const res = await fetch(`/api/admin/users/${deleteConfirmAdmin._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: 'success',
          message: data.message || `Administrator ${deleteConfirmAdmin.name} permanently deleted.`,
        });
        setDeleteConfirmAdmin(null);
        await fetchAdminAccounts(false);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to delete administrator account.',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error occurred during admin deletion.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Switch tab helper
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const getTabTitle = (tab: TabType): string => {
    switch (tab) {
      case 'APPROVED_PLAYERS': return 'Approved Players';
      case 'PENDING_PLAYERS': return 'Pending Player Approvals';
      case 'APPROVED_COACHES': return 'Approved Coaches';
      case 'PENDING_COACHES': return 'Pending Coach Approvals';
      case 'APPROVED_MANAGERS': return 'Approved Managers';
      case 'PENDING_MANAGERS': return 'Pending Manager Approvals';
      case 'APPROVED_REFEREES': return 'Approved Referees';
      case 'PENDING_REFEREES': return 'Pending Referee Approvals';
      case 'DELETED_PLAYERS': return 'Deleted Players';
      case 'ADMINS': return 'Admin Management';
    }
  };

  // Format dates
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Admin user initials
  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Show auth loading spinner
  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#008F65]/20 border-t-[#008F65] rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#5F6B65]">
          Authenticating administrator session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast / Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between border shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
              notification.type === 'success'
                ? 'bg-[#EAF7F1] border-[#008F65]/30 text-[#008F65]'
                : notification.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <div className="flex items-center space-x-3 text-xs sm:text-sm font-semibold">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-[#008F65] shrink-0" />
              ) : notification.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <Info className="w-5 h-5 text-amber-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Admin Header */}
        <div className="bg-white rounded-2xl border border-[#E1E8E3] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#EAF7F1] border border-[#008F65]/20 text-[#008F65] text-[11px] font-black tracking-widest uppercase">
              <Flame className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>OFFICIAL FEDERATION REGISTRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#17211D] uppercase tracking-tight">
              {activeTab === 'ADMINS'
                ? 'Administrator Account Management'
                : isOfficialTab(activeTab)
                ? `${getOfficialTypeAndStatus(activeTab).type} Registry Management`
                : 'Player Registry Management'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5F6B65] max-w-2xl">
              {activeTab === 'ADMINS'
                ? 'Create, inspect, and manage authorized administrative accounts with role-based access control.'
                : isOfficialTab(activeTab)
                ? `Review, approve, reject, and inspect ${getOfficialTypeAndStatus(activeTab).type.toLowerCase()} registration applications with declared qualification levels.`
                : 'Review registrations, approve players, and manage the official player registry.'}
            </p>
          </div>

          {/* Top-Right Authenticated Admin Profile Card & Logout */}
          <div className="flex items-center space-x-4 self-start md:self-auto bg-[#F5F7F5] border border-[#E1E8E3] p-2.5 sm:p-3 rounded-xl shadow-xs">
            <div className="w-11 h-11 rounded-full bg-[#008F65] text-white flex items-center justify-center font-black text-sm tracking-wider shadow-inner shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="text-left">
              <div className="text-[11px] text-[#5F6B65] uppercase font-bold tracking-wider">
                Welcome,
              </div>
              <div className="text-sm font-black text-[#17211D] leading-tight">
                {user.name}
              </div>
              <div className="text-[10px] text-[#008F65] font-semibold uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                <span>Authorized Admin</span>
              </div>
            </div>
            <div className="h-8 w-px bg-[#E1E8E3] mx-1" />
            <button
              onClick={logout}
              title="Logout from admin session"
              className="px-3 py-2 rounded-lg bg-white hover:bg-rose-50 text-[#5F6B65] hover:text-rose-600 border border-[#E1E8E3] hover:border-rose-200 text-xs font-bold uppercase transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Category Summary Cards */}
        {activeTab !== 'ADMINS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Players */}
            <div className="bg-white rounded-xl border border-[#E1E8E3] p-5 shadow-xs hover:border-[#008F65]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#5F6B65] tracking-wider">
                  Player Registrations
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#EAF7F1] text-[#008F65] flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#008F65]">{allCounts.players.approved}</span>
                <span className="text-xs font-bold text-[#5F6B65] uppercase">Approved</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E1E8E3] flex items-center justify-between text-xs">
                <button
                  onClick={() => handleTabChange('PENDING_PLAYERS')}
                  className="font-bold text-[#FF7900] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{allCounts.players.pending} Pending</span>
                </button>
                <button
                  onClick={() => handleTabChange('DELETED_PLAYERS')}
                  className="text-[#5F6B65] hover:text-rose-600 font-semibold cursor-pointer"
                >
                  <span>{allCounts.players.deleted} Archived</span>
                </button>
              </div>
            </div>

            {/* Card 2: Coaches */}
            <div className="bg-white rounded-xl border border-[#E1E8E3] p-5 shadow-xs hover:border-[#008F65]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#5F6B65] tracking-wider">
                  Coach Registrations
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#EAF7F1] text-[#008F65] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#008F65]">{allCounts.coaches.approved}</span>
                <span className="text-xs font-bold text-[#5F6B65] uppercase">Approved</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E1E8E3] flex items-center justify-between text-xs">
                <button
                  onClick={() => handleTabChange('PENDING_COACHES')}
                  className="font-bold text-[#FF7900] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{allCounts.coaches.pending} Pending</span>
                </button>
                <button
                  onClick={() => handleTabChange('APPROVED_COACHES')}
                  className="text-[#008F65] hover:underline font-semibold cursor-pointer"
                >
                  <span>View Registry →</span>
                </button>
              </div>
            </div>

            {/* Card 3: Managers */}
            <div className="bg-white rounded-xl border border-[#E1E8E3] p-5 shadow-xs hover:border-[#008F65]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#5F6B65] tracking-wider">
                  Manager Registrations
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#EAF7F1] text-[#008F65] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#008F65]">{allCounts.managers.approved}</span>
                <span className="text-xs font-bold text-[#5F6B65] uppercase">Approved</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E1E8E3] flex items-center justify-between text-xs">
                <button
                  onClick={() => handleTabChange('PENDING_MANAGERS')}
                  className="font-bold text-[#FF7900] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{allCounts.managers.pending} Pending</span>
                </button>
                <button
                  onClick={() => handleTabChange('APPROVED_MANAGERS')}
                  className="text-[#008F65] hover:underline font-semibold cursor-pointer"
                >
                  <span>View Registry →</span>
                </button>
              </div>
            </div>

            {/* Card 4: Referees */}
            <div className="bg-white rounded-xl border border-[#E1E8E3] p-5 shadow-xs hover:border-[#008F65]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#5F6B65] tracking-wider">
                  Referee Registrations
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#EAF7F1] text-[#008F65] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#008F65]">{allCounts.referees.approved}</span>
                <span className="text-xs font-bold text-[#5F6B65] uppercase">Approved</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E1E8E3] flex items-center justify-between text-xs">
                <button
                  onClick={() => handleTabChange('PENDING_REFEREES')}
                  className="font-bold text-[#FF7900] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{allCounts.referees.pending} Pending</span>
                </button>
                <button
                  onClick={() => handleTabChange('APPROVED_REFEREES')}
                  className="text-[#008F65] hover:underline font-semibold cursor-pointer"
                >
                  <span>View Registry →</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-[#E1E8E3] shadow-xs overflow-hidden">
          {/* Main Tabs Navigation Bar */}
          <div className="p-4 sm:p-6 border-b border-[#E1E8E3] space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Tab Navigation Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F5F7F5] rounded-xl border border-[#E1E8E3]">
                {/* 1. Approved Players */}
                <button
                  onClick={() => handleTabChange('APPROVED_PLAYERS')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'APPROVED_PLAYERS'
                      ? 'bg-[#008F65] text-white shadow-xs'
                      : 'text-[#5F6B65] hover:text-[#17211D] hover:bg-white/60'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Approved Players</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'APPROVED_PLAYERS' ? 'bg-white/20 text-white' : 'bg-[#E1E8E3] text-[#17211D]'
                    }`}
                  >
                    {allCounts.players.approved}
                  </span>
                </button>

                {/* 2. Pending Players */}
                <button
                  onClick={() => handleTabChange('PENDING_PLAYERS')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'PENDING_PLAYERS'
                      ? 'bg-[#FF7900] text-white shadow-xs'
                      : 'text-[#5F6B65] hover:text-[#17211D] hover:bg-white/60'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Player Approvals</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'PENDING_PLAYERS' ? 'bg-white/20 text-white' : 'bg-[#E1E8E3] text-[#17211D]'
                    }`}
                  >
                    {allCounts.players.pending}
                  </span>
                </button>

                {/* 3. Approved Coaches */}
                <button
                  onClick={() => handleTabChange('APPROVED_COACHES')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'APPROVED_COACHES'
                      ? 'bg-[#008F65] text-white shadow-xs'
                      : 'text-[#5F6B65] hover:text-[#17211D] hover:bg-white/60'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Approved Coaches</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'APPROVED_COACHES' ? 'bg-white/20 text-white' : 'bg-[#E1E8E3] text-[#17211D]'
                    }`}
                  >
                    {allCounts.coaches.approved}
                  </span>
                </button>

                {/* 4. Pending Coaches */}
                <button
                  onClick={() => handleTabChange('PENDING_COACHES')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'PENDING_COACHES'
                      ? 'bg-[#FF7900] text-white shadow-xs'
                      : 'text-[#5F6B65] hover:text-[#17211D] hover:bg-white/60'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Coach Approvals</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'PENDING_COACHES' ? 'bg-white/20 text-white' : 'bg-[#E1E8E3] text-[#17211D]'
                    }`}
                  >
                    {allCounts.coaches.pending}
                  </span>
                </button>

                {/* 5. Approved Managers */}
                <button
                  onClick={() => handleTabChange('APPROVED_MANAGERS')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'APPROVED_MANAGERS'
                      ? 'bg-[#008F65] text-white shadow-xs'
                      : 'text-[#5F6B65] hover:text-[#17211D] hover:bg-white/60'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Approved Managers</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'APPROVED_MANAGERS' ? 'bg-white/20 text-white' : 'bg-[#E1E8E3] text-[#17211D]'
                    }`}
                  >
                    {allCounts.managers.approved}
                  </span>
                </button>

                {/* 6. Pending Managers */}
                <button
                  onClick={() => handleTabChange('PENDING_MANAGERS')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'PENDING_MANAGERS'
                      ? 'bg-[#FF7900] text-white shadow-xs'
                      : 'text-[#5F6B65] hover:text-[#17211D] hover:bg-white/60'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Manager Approvals</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'PENDING_MANAGERS' ? 'bg-white/20 text-white' : 'bg-[#E1E8E3] text-[#17211D]'
                    }`}
                  >
                    {allCounts.managers.pending}
                  </span>
                </button>

                {/* 7. Approved Referees */}
                <button
                  onClick={() => handleTabChange('APPROVED_REFEREES')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'APPROVED_REFEREES'
                      ? 'bg-[#008F65] text-white shadow-xs'
                      : 'text-[#5F6B65] hover:text-[#17211D] hover:bg-white/60'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Approved Referees</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'APPROVED_REFEREES' ? 'bg-white/20 text-white' : 'bg-[#E1E8E3] text-[#17211D]'
                    }`}
                  >
                    {allCounts.referees.approved}
                  </span>
                </button>

                {/* 8. Pending Referees */}
                <button
                  onClick={() => handleTabChange('PENDING_REFEREES')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'PENDING_REFEREES'
                      ? 'bg-[#FF7900] text-white shadow-xs'
                      : 'text-[#5F6B65] hover:text-[#17211D] hover:bg-white/60'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Referee Approvals</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'PENDING_REFEREES' ? 'bg-white/20 text-white' : 'bg-[#E1E8E3] text-[#17211D]'
                    }`}
                  >
                    {allCounts.referees.pending}
                  </span>
                </button>

                {/* 9. Deleted Players */}
                <button
                  onClick={() => handleTabChange('DELETED_PLAYERS')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'DELETED_PLAYERS'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-[#5F6B65] hover:text-[#17211D] hover:bg-white/60'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Deleted Players</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'DELETED_PLAYERS' ? 'bg-white/20 text-white' : 'bg-[#E1E8E3] text-[#17211D]'
                    }`}
                  >
                    {allCounts.players.deleted}
                  </span>
                </button>

                {/* 10. Admin Management Tab */}
                <button
                  onClick={() => handleTabChange('ADMINS')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'ADMINS'
                      ? 'bg-[#17211D] text-white shadow-xs'
                      : 'text-[#5F6B65] hover:text-[#17211D] hover:bg-white/60'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#00B889]" />
                  <span>Admin Management</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'ADMINS' ? 'bg-[#008F65] text-white' : 'bg-[#E1E8E3] text-[#17211D]'
                    }`}
                  >
                    {adminCounts.total}
                  </span>
                </button>
              </div>

              {/* Search Bar (shown when on player or official tabs) */}
              {activeTab !== 'ADMINS' && (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F6B65]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        isOfficialTab(activeTab)
                          ? "Search name, email, phone, district..."
                          : "Search name, phone, NSRS ID..."
                      }
                      className="w-full pl-9 pr-9 py-2 rounded-lg bg-white border border-[#E1E8E3] text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65] transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6B65] hover:text-[#17211D] p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => fetchCurrentData(false)}
                    disabled={isRefreshing}
                    title="Refresh registration data"
                    className="p-2.5 rounded-lg bg-[#F5F7F5] border border-[#E1E8E3] text-[#5F6B65] hover:text-[#008F65] hover:bg-[#EAF7F1] transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#008F65]' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* Matching filter summary */}
            {activeTab !== 'ADMINS' && (
              <div className="flex items-center justify-between text-xs text-[#5F6B65] pt-1">
                <div>
                  Showing{' '}
                  <span className="font-bold text-[#17211D]">
                    {isOfficialTab(activeTab) ? officials.length : players.length}
                  </span>{' '}
                  of <span className="font-bold text-[#17211D]">{totalMatching}</span>{' '}
                  registrations in <span className="font-semibold uppercase">{getTabTitle(activeTab)}</span>
                  {debouncedSearch && <span> matching "{debouncedSearch}"</span>}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* TAB CONTENT: ADMIN MANAGEMENT                            */}
          {/* ======================================================== */}
          {activeTab === 'ADMINS' ? (
            <div className="p-6 sm:p-8 space-y-8 bg-[#FDFEFD]">
              
              {/* 2. Admin Management Overview Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-[#E1E8E3] p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#5F6B65] tracking-wider">
                      Total Admin Accounts
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#EAF7F1] text-[#008F65] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 text-3xl font-black text-[#17211D]">
                    {adminCounts.total}
                  </div>
                  <p className="mt-1 text-[11px] text-[#5F6B65]">
                    Total registered federation administrators
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#E1E8E3] p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#008F65] tracking-wider">
                      Active Admin Accounts
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#EAF7F1] text-[#008F65] flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 text-3xl font-black text-[#008F65]">
                    {adminCounts.active}
                  </div>
                  <p className="mt-1 text-[11px] text-[#5F6B65]">
                    Authorized active logins in MongoDB
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#E1E8E3] p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#FF7900] tracking-wider">
                      Admin Accounts Created by Me
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#FF7900] flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 text-3xl font-black text-[#FF7900]">
                    {adminCounts.createdByMe}
                  </div>
                  <p className="mt-1 text-[11px] text-[#5F6B65]">
                    Delegated accounts created under your session
                  </p>
                </div>
              </div>

              {/* Two Sections: 1. Create New Admin & 2. Existing Admin Accounts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 3. Section 1: Create New Admin Form (Left Column / Top on Mobile) */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-[#E1E8E3] p-6 shadow-xs space-y-6">
                  <div className="border-b border-[#E1E8E3] pb-3">
                    <div className="inline-flex items-center space-x-1.5 text-xs font-black text-[#008F65] uppercase tracking-wider mb-1">
                      <UserPlus className="w-4 h-4" />
                      <span>Federation Access</span>
                    </div>
                    <h3 className="text-lg font-black text-[#17211D] uppercase">
                      Create New Admin
                    </h3>
                    <p className="text-xs text-[#5F6B65]">
                      Issue a new administrative credential for Uttarakhand Rugby Association.
                    </p>
                  </div>

                  <form onSubmit={handleCreateAdminSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={newAdminName}
                        onChange={(e) => {
                          setNewAdminName(e.target.value);
                          if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                        }}
                        placeholder="e.g., Rajesh Sharma"
                        className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                          formErrors.name
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-rose-600 text-[11px] mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => {
                          setNewAdminEmail(e.target.value);
                          if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                        }}
                        placeholder="e.g., rajesh@rugbyuk.in"
                        className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                          formErrors.email
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-rose-600 text-[11px] mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Password with Eye Toggle */}
                    <div>
                      <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newAdminPassword}
                          onChange={(e) => {
                            setNewAdminPassword(e.target.value);
                            if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                          }}
                          placeholder="Minimum 6 characters"
                          className={`w-full pl-3 pr-10 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                            formErrors.password
                              ? 'border-rose-500 focus:border-rose-500'
                              : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6B65] hover:text-[#17211D] p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formErrors.password && (
                        <p className="text-rose-600 text-[11px] mt-1">{formErrors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password with Eye Toggle */}
                    <div>
                      <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={newAdminConfirmPassword}
                          onChange={(e) => {
                            setNewAdminConfirmPassword(e.target.value);
                            if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: '' });
                          }}
                          placeholder="Re-enter password"
                          className={`w-full pl-3 pr-10 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                            formErrors.confirmPassword
                              ? 'border-rose-500 focus:border-rose-500'
                              : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6B65] hover:text-[#17211D] p-1 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formErrors.confirmPassword && (
                        <p className="text-rose-600 text-[11px] mt-1">{formErrors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Role (Read-only ADMIN badge) */}
                    <div>
                      <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                        Assigned Role
                      </label>
                      <div className="px-3 py-2 rounded bg-[#F5F7F5] border border-[#E1E8E3] flex items-center justify-between">
                        <span className="text-xs text-[#17211D] font-bold">ADMIN</span>
                        <span className="px-2 py-0.5 rounded bg-[#EAF7F1] text-[#008F65] text-[10px] font-black uppercase border border-[#008F65]/20">
                          Auto-assigned
                        </span>
                      </div>
                      <p className="text-[10px] text-[#5F6B65] mt-1">
                        Restricted to administrative privileges. Other roles cannot be assigned.
                      </p>
                    </div>

                    {/* Account Created By (Read-only info) */}
                    <div>
                      <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                        Account Created By
                      </label>
                      <div className="px-3 py-2 rounded bg-[#F5F7F5] border border-[#E1E8E3] flex items-center justify-between">
                        <span className="text-xs text-[#17211D] font-bold">{user.name}</span>
                        <span className="text-[10px] text-[#5F6B65] font-mono">Current Session</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isCreatingAdmin}
                        className="w-full py-3 px-4 rounded-lg bg-[#008F65] hover:bg-[#007553] disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        {isCreatingAdmin ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating Admin Account...</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>CREATE ADMIN ACCOUNT</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* 4. Section 2: Existing Admin Accounts Table (Right Column / Bottom on Mobile) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-[#E1E8E3] shadow-xs overflow-hidden">
                  
                  {/* Section Heading & Search Filter */}
                  <div className="p-5 border-b border-[#E1E8E3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-[#17211D] uppercase tracking-tight flex items-center gap-2">
                        <span>Existing Admin Accounts</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#EAF7F1] text-[#008F65] text-xs font-black">
                          {adminUsers.length}
                        </span>
                      </h3>
                      <p className="text-xs text-[#5F6B65] mt-0.5">
                        Manage active administrative access and credentials.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 sm:w-60">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B65]" />
                        <input
                          type="text"
                          value={adminSearch}
                          onChange={(e) => setAdminSearch(e.target.value)}
                          placeholder="Search admin name/email..."
                          className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white border border-[#E1E8E3] text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none focus:border-[#008F65] transition-colors"
                        />
                        {adminSearch && (
                          <button
                            onClick={() => setAdminSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5F6B65] hover:text-[#17211D]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => fetchAdminAccounts(false)}
                        disabled={isRefreshing}
                        title="Refresh admin accounts"
                        className="p-2 rounded-lg bg-[#F5F7F5] border border-[#E1E8E3] text-[#5F6B65] hover:text-[#008F65] transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#008F65]' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Admin Table */}
                  <div className="overflow-x-auto">
                    {isLoadingAdmins ? (
                      <div className="p-6 space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-12 bg-[#F5F7F5] rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : adminUsers.length === 0 ? (
                      <div className="py-12 px-4 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-[#F5F7F5] border border-[#E1E8E3] flex items-center justify-center mx-auto text-[#5F6B65]">
                          <Search className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-black text-[#17211D] uppercase">
                          No Admin Accounts Found
                        </h4>
                        <p className="text-xs text-[#5F6B65]">
                          {adminSearch ? `No accounts match "${adminSearch}".` : 'No admin accounts registered.'}
                        </p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F5F7F5] border-b border-[#E1E8E3] text-[#5F6B65] uppercase text-[10px] font-black tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Administrator</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Created By</th>
                            <th className="py-3 px-4">Created Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E1E8E3] bg-white">
                          {adminUsers.map((adminItem) => {
                            const isCurrentLoggedInUser =
                              (user.id && user.id === adminItem._id) ||
                              user.email?.toLowerCase() === adminItem.email.toLowerCase();
                            const isRootSeedAdmin = adminItem.email.toLowerCase() === 'admin@gmail.com';

                            return (
                              <tr key={adminItem._id} className="hover:bg-[#F9FBFA] transition-colors">
                                {/* Administrator Name */}
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center space-x-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#008F65] text-white font-black flex items-center justify-center text-xs shrink-0">
                                      {getInitials(adminItem.name)}
                                    </div>
                                    <div>
                                      <div className="font-bold text-[#17211D] text-xs">
                                        {adminItem.name}
                                      </div>
                                      {isCurrentLoggedInUser && (
                                        <span className="text-[10px] text-[#008F65] font-semibold">
                                          (You)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Email */}
                                <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#17211D]">
                                  {adminItem.email}
                                </td>

                                {/* Role Badge */}
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#EAF7F1] text-[#008F65] font-black text-[10px] border border-[#008F65]/20">
                                    {adminItem.role}
                                  </span>
                                </td>

                                {/* Created By */}
                                <td className="py-3.5 px-4 whitespace-nowrap text-[#5F6B65]">
                                  {adminItem.createdBy || 'System / Root'}
                                </td>

                                {/* Created Date */}
                                <td className="py-3.5 px-4 whitespace-nowrap text-[#5F6B65]">
                                  {formatDate(adminItem.createdAt)}
                                </td>

                                {/* Status */}
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                                    Active
                                  </span>
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end space-x-1.5">
                                    {/* View Details */}
                                    <button
                                      onClick={() => setSelectedAdminUser(adminItem)}
                                      className="px-2.5 py-1 rounded bg-[#F5F7F5] hover:bg-[#EAF7F1] text-[#17211D] hover:text-[#008F65] border border-[#E1E8E3] font-bold text-[10px] uppercase transition-colors cursor-pointer"
                                    >
                                      View
                                    </button>

                                    {/* Delete Button with Safeguards */}
                                    {isCurrentLoggedInUser ? (
                                      <span
                                        title="Cannot delete your own active session"
                                        className="px-2 py-1 rounded bg-zinc-100 text-zinc-400 text-[10px] font-bold uppercase cursor-not-allowed border border-zinc-200"
                                      >
                                        Current
                                      </span>
                                    ) : isRootSeedAdmin ? (
                                      <span
                                        title="Primary system administrator cannot be deleted"
                                        className="px-2 py-1 rounded bg-zinc-100 text-zinc-400 text-[10px] font-bold uppercase cursor-not-allowed border border-zinc-200"
                                      >
                                        Protected
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => setDeleteConfirmAdmin(adminItem)}
                                        className="px-2.5 py-1 rounded bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-400 font-bold text-[10px] uppercase transition-colors flex items-center space-x-1 cursor-pointer"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Delete</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : isOfficialTab(activeTab) ? (
            /* ======================================================== */
            /* TAB CONTENT: OFFICIAL REGISTRATIONS (Coach, Mgr, Referee)*/
            /* ======================================================== */
            <OfficialTable
              type={getOfficialTypeAndStatus(activeTab).type}
              status={getOfficialTypeAndStatus(activeTab).status}
              officials={officials}
              totalMatching={totalMatching}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              isLoading={isLoadingData}
              onPageChange={(page) => setCurrentPage(page)}
              onViewDetails={(off) => setSelectedOfficial(off)}
              onApprove={(id, name) => handleApproveOfficial(id, name)}
              onReject={(off) => {
                setRejectModalItem({
                  id: off._id,
                  name: off.fullName,
                  role: off.type,
                  registrationId: off.registrationId,
                });
              }}
              processingId={processingId}
            />
          ) : (
            /* ======================================================== */
            /* TAB CONTENT: PLAYER REGISTRATIONS (Approved/Pending/Del) */
            /* ======================================================== */
            <>
              {/* Table Container / View */}
              <div className="overflow-x-auto">
                {isLoadingData ? (
                  /* Loading Skeleton */
                  <div className="p-8 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-14 bg-[#F5F7F5] rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : players.length === 0 ? (
                  /* Empty State */
                  <div className="py-16 px-4 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-[#F5F7F5] border border-[#E1E8E3] flex items-center justify-center mx-auto text-[#5F6B65]">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-[#17211D] uppercase">
                      No {getTabTitle(activeTab).toLowerCase()} found
                    </h3>
                    <p className="text-xs text-[#5F6B65] max-w-sm mx-auto">
                      {debouncedSearch
                        ? `No records matching "${debouncedSearch}" in the ${getTabTitle(activeTab).toLowerCase()} list.`
                        : `Currently there are no player registrations in ${getTabTitle(activeTab)}.`}
                    </p>
                    {debouncedSearch && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="px-4 py-2 rounded-lg bg-[#EAF7F1] text-[#008F65] font-bold text-xs uppercase"
                      >
                        Clear Search Filter
                      </button>
                    )}
                  </div>
                ) : (
                  /* Professional Player Data Table */
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F7F5] border-b border-[#E1E8E3] text-[#5F6B65] uppercase text-[10px] font-black tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6">Player Name</th>
                        <th className="py-3.5 px-4">Phone Number</th>
                        <th className="py-3.5 px-4">Address</th>
                        <th className="py-3.5 px-4">NSRS ID</th>
                        {activeTab === 'APPROVED_PLAYERS' && (
                          <>
                            <th className="py-3.5 px-4">Approved By</th>
                            <th className="py-3.5 px-4">Approval Date</th>
                          </>
                        )}
                        {activeTab === 'PENDING_PLAYERS' && (
                          <th className="py-3.5 px-4">Registration Date</th>
                        )}
                        {activeTab === 'DELETED_PLAYERS' && (
                          <>
                            <th className="py-3.5 px-4">Deleted By</th>
                            <th className="py-3.5 px-4">Deletion Date</th>
                          </>
                        )}
                        <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E1E8E3] bg-white">
                      {players.map((player) => (
                        <tr
                          key={player._id}
                          className="hover:bg-[#F9FBFA] transition-colors group"
                        >
                          {/* Player Name & District */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-lg bg-[#EAF7F1] text-[#008F65] font-black flex items-center justify-center text-xs shrink-0 border border-[#008F65]/20">
                                {player.fullName ? player.fullName.charAt(0).toUpperCase() : 'P'}
                              </div>
                              <div>
                                <div className="font-black text-[#17211D] text-sm">
                                  {player.fullName}
                                </div>
                                <div className="text-[11px] text-[#5F6B65] flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[#008F65] font-semibold">{player.district}</span>
                                  <span>•</span>
                                  <span className="font-mono text-[10px] text-[#FF7900]">{player.registrationId}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Phone Number */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="font-semibold text-[#17211D]">
                              {player.contactNumber || '—'}
                            </div>
                            {player.email && (
                              <div className="text-[11px] text-[#5F6B65] truncate max-w-[150px]">
                                {player.email}
                              </div>
                            )}
                          </td>

                          {/* Address */}
                          <td className="py-4 px-4 max-w-xs">
                            <div className="text-[#17211D] line-clamp-2 text-xs">
                              {player.address || '—'}
                            </div>
                          </td>

                          {/* NSRS ID */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {player.nsrsId ? (
                              <span className="inline-block px-2.5 py-1 rounded-md bg-[#FFF5EB] border border-[#FF7900]/20 text-[#FF7900] font-mono font-bold text-[11px]">
                                {player.nsrsId}
                              </span>
                            ) : (
                              <span className="text-[#5F6B65] italic text-[11px]">
                                Not Issued
                              </span>
                            )}
                          </td>

                          {/* Tab 1: Approved By & Date */}
                          {activeTab === 'APPROVED_PLAYERS' && (
                            <>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#EAF7F1] text-[#008F65] font-bold text-xs border border-[#008F65]/20">
                                  <Shield className="w-3 h-3" />
                                  <span>{player.approvedBy || 'Admin'}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap text-[#5F6B65] font-medium">
                                {formatDateTime(player.approvedAt)}
                              </td>
                            </>
                          )}

                          {/* Tab 2: Registration Date */}
                          {activeTab === 'PENDING_PLAYERS' && (
                            <td className="py-4 px-4 whitespace-nowrap text-[#5F6B65] font-medium">
                              {formatDate(player.createdAt)}
                            </td>
                          )}

                          {/* Tab 3: Deleted By & Deletion Date */}
                          {activeTab === 'DELETED_PLAYERS' && (
                            <>
                              <td className="py-4 px-4 whitespace-nowrap text-rose-700 font-semibold">
                                {player.deletedBy || 'Admin'}
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap text-[#5F6B65] font-medium">
                                {formatDateTime(player.deletedAt)}
                              </td>
                            </>
                          )}

                          {/* Action Buttons */}
                          <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-2">
                              {/* View Details Button */}
                              <button
                                onClick={() => setSelectedPlayer(player)}
                                className="px-3 py-1.5 rounded-lg bg-[#F5F7F5] hover:bg-[#EAF7F1] text-[#17211D] hover:text-[#008F65] border border-[#E1E8E3] font-bold text-[11px] uppercase transition-colors flex items-center space-x-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>

                              {/* Tab 1 (Approved): Badge */}
                              {activeTab === 'APPROVED_PLAYERS' && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#EAF7F1] text-[#008F65] font-bold text-[11px] border border-[#008F65]/20">
                                  <Check className="w-3 h-3 mr-1" />
                                  Approved
                                </span>
                              )}

                              {/* Tab 2 (Pending): Approve, Reject & Delete Buttons */}
                              {activeTab === 'PENDING_PLAYERS' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(player)}
                                    disabled={processingId === player._id}
                                    className="px-3.5 py-1.5 rounded-lg bg-[#008F65] hover:bg-[#007553] disabled:opacity-60 text-white font-black text-[11px] uppercase tracking-wider transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                                  >
                                    {processingId === player._id ? (
                                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    )}
                                    <span>Approve</span>
                                  </button>

                                  <button
                                    onClick={() =>
                                      setRejectModalItem({
                                        id: player._id,
                                        name: player.fullName,
                                        role: 'PLAYER',
                                        registrationId: player.registrationId,
                                      })
                                    }
                                    disabled={processingId === player._id}
                                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 hover:border-rose-500 font-bold text-[11px] uppercase transition-colors flex items-center space-x-1 cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>Reject</span>
                                  </button>

                                  <button
                                    onClick={() =>
                                      setDeleteConfirmPlayer({ player, isPermanent: false })
                                    }
                                    disabled={processingId === player._id}
                                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-[#5F6B65] border border-[#E1E8E3] hover:border-zinc-400 font-bold text-[11px] uppercase transition-colors flex items-center space-x-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </>
                              )}

                              {/* Tab 3 (Deleted): Restore & Permanent Delete Buttons */}
                              {activeTab === 'DELETED_PLAYERS' && (
                                <>
                                  <button
                                    onClick={() => handleRestore(player)}
                                    disabled={processingId === player._id}
                                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#EAF7F1] text-[#008F65] border border-[#008F65]/30 font-bold text-[11px] uppercase transition-colors flex items-center space-x-1 cursor-pointer"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Restore</span>
                                  </button>

                                  <button
                                    onClick={() =>
                                      setDeleteConfirmPlayer({ player, isPermanent: true })
                                    }
                                    disabled={processingId === player._id}
                                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] uppercase transition-colors flex items-center space-x-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Permanent</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 sm:p-5 border-t border-[#E1E8E3] bg-[#F5F7F5] flex items-center justify-between">
                  <span className="text-xs text-[#5F6B65]">
                    Page <span className="font-bold text-[#17211D]">{currentPage}</span> of{' '}
                    <span className="font-bold text-[#17211D]">{totalPages}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1 || isLoadingData}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E1E8E3] text-xs font-bold text-[#17211D] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 flex items-center space-x-1 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                            currentPage === page
                              ? 'bg-[#008F65] text-white shadow-xs'
                              : 'bg-white border border-[#E1E8E3] text-[#5F6B65] hover:bg-zinc-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || isLoadingData}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E1E8E3] text-xs font-bold text-[#17211D] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 flex items-center space-x-1 transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 6. Player Details Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E1E8E3] max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#F5F7F5] border-b border-[#E1E8E3] p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#008F65] text-white flex items-center justify-center font-black shadow-xs">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#17211D] uppercase">
                    Player Registration Details
                  </h3>
                  <div className="text-xs text-[#5F6B65] font-mono">
                    ID: <span className="text-[#FF7900] font-bold">{selectedPlayer.registrationId}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlayer(null)}
                className="p-2 rounded-lg bg-white hover:bg-zinc-200 border border-[#E1E8E3] text-[#5F6B65] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Status Banner */}
              <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold uppercase bg-[#F5F7F5] border-[#E1E8E3]">
                <span className="text-[#5F6B65]">Current Registration Status:</span>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-black ${
                    selectedPlayer.status === 'APPROVED'
                      ? 'bg-[#EAF7F1] text-[#008F65] border border-[#008F65]/30'
                      : selectedPlayer.status === 'PENDING'
                      ? 'bg-[#FFF5EB] text-[#FF7900] border border-[#FF7900]/30'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {selectedPlayer.status}
                </span>
              </div>

              {/* Personal Details Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#17211D] uppercase tracking-wider border-b border-[#E1E8E3] pb-1.5">
                  1. Athlete Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E1E8E3]">
                    <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Full Name:</span>
                    <span className="font-black text-[#17211D] text-sm">{selectedPlayer.fullName || '—'}</span>
                  </div>

                  <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E1E8E3]">
                    <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Father's Name:</span>
                    <span className="font-bold text-[#17211D]">{selectedPlayer.fatherName || '—'}</span>
                  </div>

                  <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E1E8E3]">
                    <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Date of Birth (DOB):</span>
                    <span className="font-bold text-[#17211D]">{formatDate(selectedPlayer.dob)}</span>
                  </div>

                  <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E1E8E3]">
                    <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Uttarakhand District:</span>
                    <span className="font-bold text-[#008F65]">{selectedPlayer.district} District</span>
                  </div>

                  <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E1E8E3]">
                    <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Contact Phone:</span>
                    <span className="font-bold text-[#17211D]">{selectedPlayer.contactNumber || '—'}</span>
                  </div>

                  <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E1E8E3]">
                    <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Email Address:</span>
                    <span className="font-bold text-[#17211D]">{selectedPlayer.email || '—'}</span>
                  </div>

                  <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E1E8E3] sm:col-span-2">
                    <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">NSRS ID:</span>
                    <span className="font-mono font-bold text-[#FF7900]">
                      {selectedPlayer.nsrsId || 'Not Assigned / Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#17211D] uppercase tracking-wider border-b border-[#E1E8E3] pb-1.5">
                  2. Residential & Emergency Contacts
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="bg-[#F8FAF9] p-3.5 rounded-lg border border-[#E1E8E3]">
                    <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Residential Address:</span>
                    <span className="font-medium text-[#17211D] leading-relaxed block mt-0.5">
                      {selectedPlayer.address || '—'}
                    </span>
                  </div>

                  <div className="bg-[#F8FAF9] p-3.5 rounded-lg border border-[#E1E8E3]">
                    <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Emergency Contact Person & Phone:</span>
                    <span className="font-bold text-[#17211D] block mt-0.5">
                      {selectedPlayer.emergencyContact || 'Not Provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Administrative Tracking */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#17211D] uppercase tracking-wider border-b border-[#E1E8E3] pb-1.5">
                  3. Administrative Audit Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#F5F7F5] border border-[#E1E8E3]">
                    <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Registration Date:</span>
                    <span className="font-semibold text-[#17211D]">{formatDateTime(selectedPlayer.createdAt)}</span>
                  </div>

                  {selectedPlayer.approvedBy && (
                    <div className="p-3 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20">
                      <span className="text-[10px] text-[#008F65] uppercase font-bold block">Approved By Admin:</span>
                      <span className="font-bold text-[#008F65]">{selectedPlayer.approvedBy}</span>
                      <div className="text-[10px] text-[#5F6B65] mt-0.5">
                        {formatDateTime(selectedPlayer.approvedAt)}
                      </div>
                    </div>
                  )}

                  {selectedPlayer.deletedBy && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                      <span className="text-[10px] text-rose-700 uppercase font-bold block">Deleted By Admin:</span>
                      <span className="font-bold text-rose-700">{selectedPlayer.deletedBy}</span>
                      <div className="text-[10px] text-[#5F6B65] mt-0.5">
                        {formatDateTime(selectedPlayer.deletedAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#F5F7F5] border-t border-[#E1E8E3] flex items-center justify-between">
              <button
                onClick={() => setSelectedPlayer(null)}
                className="px-5 py-2.5 rounded-lg bg-white border border-[#E1E8E3] text-[#17211D] font-bold text-xs uppercase hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Close
              </button>

              {/* Quick actions from inside modal */}
              <div className="flex items-center space-x-2">
                {selectedPlayer.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => {
                        const playerToReject = selectedPlayer;
                        setSelectedPlayer(null);
                        setRejectModalItem({
                          id: playerToReject._id,
                          name: playerToReject.fullName,
                          role: 'PLAYER',
                          registrationId: playerToReject.registrationId,
                        });
                      }}
                      className="px-4 py-2.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 font-bold text-xs uppercase transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => {
                        handleApprove(selectedPlayer);
                        setSelectedPlayer(null);
                      }}
                      className="px-5 py-2.5 rounded-lg bg-[#008F65] hover:bg-[#007553] text-white font-black text-xs uppercase transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Player</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Admin User Details Modal */}
      {selectedAdminUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E1E8E3] max-w-md w-full shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            <div className="bg-[#F5F7F5] border-b border-[#E1E8E3] p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#008F65] text-white flex items-center justify-center font-black shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#17211D] uppercase">
                    Admin Account Profile
                  </h3>
                  <div className="text-xs text-[#5F6B65]">Federation Administrator</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedAdminUser(null)}
                className="p-1.5 rounded-lg bg-white hover:bg-zinc-200 border border-[#E1E8E3] text-[#5F6B65] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-[#F8FAF9] rounded-lg border border-[#E1E8E3]">
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Administrator Name:</span>
                <span className="font-black text-[#17211D] text-sm">{selectedAdminUser.name}</span>
              </div>

              <div className="p-3 bg-[#F8FAF9] rounded-lg border border-[#E1E8E3]">
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Registered Email:</span>
                <span className="font-bold text-[#17211D]">{selectedAdminUser.email}</span>
              </div>

              <div className="p-3 bg-[#F8FAF9] rounded-lg border border-[#E1E8E3] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Role:</span>
                  <span className="font-bold text-[#008F65]">{selectedAdminUser.role}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#EAF7F1] text-[#008F65] text-[10px] font-black uppercase border border-[#008F65]/20">
                  Full Admin Access
                </span>
              </div>

              <div className="p-3 bg-[#F8FAF9] rounded-lg border border-[#E1E8E3]">
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Account Created By:</span>
                <span className="font-bold text-[#17211D]">{selectedAdminUser.createdBy || 'System / Root'}</span>
              </div>

              <div className="p-3 bg-[#F8FAF9] rounded-lg border border-[#E1E8E3]">
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">Account Creation Date:</span>
                <span className="font-bold text-[#17211D]">{formatDateTime(selectedAdminUser.createdAt)}</span>
              </div>

              <div className="p-3 bg-[#F8FAF9] rounded-lg border border-[#E1E8E3] flex items-center justify-between">
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold">Authentication Status:</span>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                  Active in MongoDB
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#F5F7F5] border-t border-[#E1E8E3] flex justify-end">
              <button
                onClick={() => setSelectedAdminUser(null)}
                className="px-5 py-2 rounded-lg bg-white border border-[#E1E8E3] text-[#17211D] font-bold text-xs uppercase hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Delete Admin Account Confirmation Dialog */}
      {deleteConfirmAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E1E8E3] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-[#17211D] uppercase">
                Permanently Delete Admin Account?
              </h3>
              <p className="text-xs text-[#5F6B65] leading-relaxed">
                Are you sure you want to permanently delete administrator{' '}
                <strong className="text-[#17211D]">{deleteConfirmAdmin.name}</strong> (
                <span className="text-[#008F65]">{deleteConfirmAdmin.email}</span>)?
              </p>
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] text-left">
                ⚠️ <strong>Warning:</strong> This account and its administrative login access will be permanently removed from MongoDB. This action cannot be undone.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmAdmin(null)}
                className="py-2.5 px-4 rounded-xl bg-[#F5F7F5] hover:bg-zinc-200 text-[#17211D] font-bold text-xs uppercase border border-[#E1E8E3] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteAdmin}
                disabled={processingId === deleteConfirmAdmin._id}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-black text-xs uppercase transition-colors shadow-md cursor-pointer flex items-center justify-center space-x-1"
              >
                {processingId === deleteConfirmAdmin._id ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete / Permanent Delete Player Confirmation Dialog */}
      {deleteConfirmPlayer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E1E8E3] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-[#17211D] uppercase">
                {deleteConfirmPlayer.isPermanent
                  ? 'Permanently Delete Registration?'
                  : 'Delete Player Registration?'}
              </h3>
              <p className="text-xs text-[#5F6B65] leading-relaxed">
                {deleteConfirmPlayer.isPermanent ? (
                  <>
                    Are you sure you want to permanently delete{' '}
                    <strong className="text-[#17211D]">
                      {deleteConfirmPlayer.player.fullName}
                    </strong>{' '}
                    ({deleteConfirmPlayer.player.registrationId}) from MongoDB? This operation cannot be undone.
                  </>
                ) : (
                  <>
                    This action will move{' '}
                    <strong className="text-[#17211D]">
                      {deleteConfirmPlayer.player.fullName}
                    </strong>{' '}
                    ({deleteConfirmPlayer.player.registrationId}) to the <strong>Deleted Players</strong> tab. You will be able to restore it later if needed.
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmPlayer(null)}
                className="py-2.5 px-4 rounded-xl bg-[#F5F7F5] hover:bg-zinc-200 text-[#17211D] font-bold text-xs uppercase border border-[#E1E8E3] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeletePlayer}
                disabled={processingId === deleteConfirmPlayer.player._id}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-black text-xs uppercase transition-colors shadow-md cursor-pointer flex items-center justify-center space-x-1"
              >
                {processingId === deleteConfirmPlayer.player._id ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>
                  {deleteConfirmPlayer.isPermanent ? 'Confirm Delete' : 'Confirm'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Official Details Modal */}
      <OfficialDetailsModal
        official={selectedOfficial}
        onClose={() => setSelectedOfficial(null)}
        onApprove={
          selectedOfficial?.status === 'PENDING'
            ? (id) => {
                handleApproveOfficial(id, selectedOfficial.fullName);
                setSelectedOfficial(null);
              }
            : undefined
        }
        onReject={
          selectedOfficial?.status === 'PENDING'
            ? (off) => {
                setSelectedOfficial(null);
                setRejectModalItem({
                  id: off._id,
                  name: off.fullName,
                  role: off.type,
                  registrationId: off.registrationId,
                });
              }
            : undefined
        }
      />

      {/* 10. Rejection Dialog (Player or Official) */}
      <RejectionModal
        isOpen={!!rejectModalItem}
        onClose={() => setRejectModalItem(null)}
        onConfirm={handleConfirmRejection}
        applicantName={rejectModalItem?.name || ''}
        applicantRole={rejectModalItem?.role || 'Applicant'}
        registrationId={rejectModalItem?.registrationId || ''}
        isProcessing={!!processingId}
      />
    </div>
  );
}
